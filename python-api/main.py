from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
import secrets
from contextlib import asynccontextmanager
from datetime import timedelta
from typing import Annotated, Any

import asyncpg
from fastapi import FastAPI, HTTPException, Request, Response
from pydantic import BaseModel, ConfigDict, Field

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://estatevue:estatevue-local-only@127.0.0.1:5432/estatevue",
)
IS_PRODUCTION = os.getenv("APP_ENV", "development") == "production"
COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE", "true" if IS_PRODUCTION else "false").lower() in {"1", "true", "yes"}
SESSION_COOKIE_NAME = "estatevue_session"
SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30
MAX_STATE_BYTES = 256 * 1024

JsonObject = dict[str, Any]
ShortId = Annotated[str, Field(min_length=1, max_length=128)]


class UserState(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    saved_property_ids: list[ShortId] = Field(default_factory=list, alias="savedPropertyIds", max_length=500)
    saved_searches: list[JsonObject] = Field(default_factory=list, alias="savedSearches", max_length=100)
    tour_bookings: list[JsonObject] = Field(default_factory=list, alias="tourBookings", max_length=100)
    agent_inquiries: list[JsonObject] = Field(default_factory=list, alias="agentInquiries", max_length=100)
    custom_properties: list[JsonObject] = Field(default_factory=list, alias="customProperties", max_length=25)


EMPTY_STATE = UserState()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    global pool
    pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=10)
    await pool.set_type_codec(
        "jsonb",
        encoder=json.dumps,
        decoder=json.loads,
        schema="pg_catalog",
    )
    async with pool.acquire() as connection:
        await connection.execute(
            """
            CREATE TABLE IF NOT EXISTS estatevue_visitor_state (
                session_hash TEXT PRIMARY KEY,
                saved_property_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
                saved_searches JSONB NOT NULL DEFAULT '[]'::jsonb,
                tour_bookings JSONB NOT NULL DEFAULT '[]'::jsonb,
                agent_inquiries JSONB NOT NULL DEFAULT '[]'::jsonb,
                custom_properties JSONB NOT NULL DEFAULT '[]'::jsonb,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                expires_at TIMESTAMPTZ NOT NULL
            )
            """
        )
        await connection.execute(
            "CREATE INDEX IF NOT EXISTS estatevue_visitor_state_expiry_idx "
            "ON estatevue_visitor_state (expires_at)"
        )
        await connection.execute(
            """
            CREATE TABLE IF NOT EXISTS estatevue_properties (
                property_id TEXT PRIMARY KEY,
                payload JSONB NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
            """
        )
        seed_properties = json.loads(
            Path(__file__).with_name("seed_properties.json").read_text(encoding="utf-8")
        )
        async with connection.transaction():
            for property_data in seed_properties:
                await connection.execute(
                    """
                    INSERT INTO estatevue_properties (property_id, payload)
                    VALUES ($1, $2)
                    ON CONFLICT (property_id) DO NOTHING
                    """,
                    property_data["id"],
                    property_data,
                )
    yield
    await pool.close()
    pool = None


pool: asyncpg.Pool | None = None
app = FastAPI(
    title="EstateVue Data API",
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
    lifespan=lifespan,
)


@app.middleware("http")
async def limit_request_size(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length and content_length.isdigit() and int(content_length) > MAX_STATE_BYTES:
        return Response(
            content=json.dumps({"detail": "Request body is too large"}),
            status_code=413,
            media_type="application/json",
        )
    return await call_next(request)


def get_pool() -> asyncpg.Pool:
    if pool is None:
        raise HTTPException(status_code=503, detail="Data service is starting")
    return pool


def digest_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


async def resolve_session(request: Request, response: Response) -> tuple[str, bool]:
    db = get_pool()
    token = request.cookies.get(SESSION_COOKIE_NAME, "")
    if token and len(token) <= 128:
        session_hash = digest_token(token)
        async with db.acquire() as connection:
            row = await connection.fetchrow(
                """
                UPDATE estatevue_visitor_state
                SET expires_at = NOW() + $2::interval
                WHERE session_hash = $1 AND expires_at > NOW()
                RETURNING session_hash
                """,
                session_hash,
                timedelta(seconds=SESSION_MAX_AGE_SECONDS),
            )
        if row:
            return session_hash, False

    token = secrets.token_urlsafe(32)
    session_hash = digest_token(token)
    async with db.acquire() as connection:
        await connection.execute(
            """
            INSERT INTO estatevue_visitor_state (session_hash, expires_at)
            VALUES ($1, NOW() + $2::interval)
            """,
            session_hash,
            timedelta(seconds=SESSION_MAX_AGE_SECONDS),
        )
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        max_age=SESSION_MAX_AGE_SECONDS,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        path="/api/data",
    )
    return session_hash, True


def state_from_row(row: asyncpg.Record | None) -> UserState:
    if not row:
        return EMPTY_STATE
    return UserState(
        savedPropertyIds=row["saved_property_ids"],
        savedSearches=row["saved_searches"],
        tourBookings=row["tour_bookings"],
        agentInquiries=row["agent_inquiries"],
        customProperties=row["custom_properties"],
    )


@app.get("/health/live")
async def live_health():
    return {"status": "ok"}


@app.get("/health/ready")
async def ready_health():
    db = get_pool()
    async with db.acquire() as connection:
        await connection.fetchval("SELECT 1")
    return {"status": "ok", "database": "connected"}


@app.get("/api/properties")
async def list_properties():
    db = get_pool()
    async with db.acquire() as connection:
        rows = await connection.fetch(
            "SELECT payload FROM estatevue_properties ORDER BY created_at DESC, property_id"
        )
    return {"properties": [row["payload"] for row in rows]}


@app.get("/api/state")
async def read_state(request: Request, response: Response):
    session_hash, is_new_session = await resolve_session(request, response)
    db = get_pool()
    async with db.acquire() as connection:
        row = await connection.fetchrow(
            """
            SELECT saved_property_ids, saved_searches, tour_bookings,
                   agent_inquiries, custom_properties
            FROM estatevue_visitor_state
            WHERE session_hash = $1
            """,
            session_hash,
        )
    return {"state": state_from_row(row).model_dump(by_alias=True), "isNewSession": is_new_session}


@app.put("/api/state")
async def write_state(state: UserState, request: Request, response: Response):
    session_hash, _ = await resolve_session(request, response)
    db = get_pool()
    async with db.acquire() as connection:
        await connection.execute(
            """
            UPDATE estatevue_visitor_state
            SET saved_property_ids = $2,
                saved_searches = $3,
                tour_bookings = $4,
                agent_inquiries = $5,
                custom_properties = $6,
                updated_at = NOW(),
                expires_at = NOW() + $7::interval
            WHERE session_hash = $1
            """,
            session_hash,
            state.saved_property_ids,
            state.saved_searches,
            state.tour_bookings,
            state.agent_inquiries,
            state.custom_properties,
            timedelta(seconds=SESSION_MAX_AGE_SECONDS),
        )
    return {"state": state.model_dump(by_alias=True), "saved": True}


@app.delete("/api/state")
async def delete_state(request: Request, response: Response):
    token = request.cookies.get(SESSION_COOKIE_NAME, "")
    if token and len(token) <= 128:
        db = get_pool()
        async with db.acquire() as connection:
            await connection.execute(
                "DELETE FROM estatevue_visitor_state WHERE session_hash = $1",
                digest_token(token),
            )
    response.delete_cookie(
        key=SESSION_COOKIE_NAME,
        path="/api/data",
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
    )
    return {"state": EMPTY_STATE.model_dump(by_alias=True), "deleted": True}
