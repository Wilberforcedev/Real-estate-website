# EstateVue

Map-first real estate search: interactive listings, advanced filters, side-by-side comparison, mortgage estimates, tour scheduling, saved searches, and AI-powered neighborhood insights and property Q&A.

## Stack

- React 19 + TypeScript + Vite 6, Tailwind CSS 4
- Leaflet + React Leaflet (OpenStreetMap / CARTO / Esri tiles)
- Express 4 server (`server.ts`) serving the SPA, Gemini endpoints, and same-origin data proxy
- Python FastAPI service with PostgreSQL for the shared property catalog and browser-session data
- `@google/genai` with Google Search grounding for local area insights

## Requirements

- Node.js 20+ (tested on Node 20/22)
- Docker Compose for the PostgreSQL and Python data services
- A Gemini API key for AI features (the rest of the app works without one)

## Local development

```bash
cp .env.example .env    # set a local POSTGRES_PASSWORD
docker compose up -d database data-api
npm install
npm run dev             # http://localhost:3000
```

The Express server proxies `/api/data/*` to FastAPI, so browser requests stay same-origin. The Python service is available at `http://127.0.0.1:8000` during local development. FastAPI's interactive docs are at `http://127.0.0.1:8000/docs`.

To run the complete containerized app instead:

```bash
cp .env.example .env
docker compose up --build
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server with Vite HMR |
| `npm run lint` | TypeScript type check (`tsc --noEmit`) |
| `npm run build` | Build the client to `dist/` and bundle the server to `server-dist/server.cjs` |
| `npm start` | Run the production build (sets production mode via npm lifecycle) |
| `npm run preview` | Preview the Vite client build |

## Production

Set a strong `POSTGRES_PASSWORD`, `APP_ENV=production`, and `SESSION_COOKIE_SECURE=true` in the deployment environment. Provide `GEMINI_API_KEY` if the AI features are enabled, then build and run the full stack:

```bash
docker compose up --build -d
```

The stack contains the React/Express web service, the Python API, and PostgreSQL. The web container proxies data requests to FastAPI over the internal Compose network. Keep the database and Python API ports private in production.

For a web-only image, the existing `Dockerfile` still builds the React client and Express server, but `DATA_API_URL` must point to a running Python API service. `dist/` contains only client assets; the Express server must serve `dist/` because `/api/*` is required at runtime.

### Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | – | Server-side Gemini key. AI endpoints return `503` when missing |
| `GEMINI_MODEL` | `gemini-3.6-flash` | Model used by both AI endpoints |
| `PORT` | `3000` | Express HTTP port |
| `DATA_API_URL` | `http://127.0.0.1:8000` | Internal FastAPI base URL |
| `POSTGRES_PASSWORD` | Required | Database password; use a strong secret in deployments |
| `DB_HOST` / `DB_PORT` | `database` / `5432` in Compose | PostgreSQL connection settings |
| `DB_NAME` / `DB_USER` | `estatevue` / `estatevue` | PostgreSQL database and role |
| `APP_ENV` | `development` | Set to `production` to disable Python API docs |
| `SESSION_COOKIE_SECURE` | `false` in local .env example | Set to `true` behind HTTPS in production |
| `NODE_ENV` | `development` | `production` enables static serving, logging, CSP and HSTS |
| `TRUST_PROXY` | `1` in production, `0` in development | Hop count/flag for `X-Forwarded-For`. Keep `0` if directly exposed |
| `AI_TIMEOUT_MS` | `30000` | Upstream Gemini timeout |
| `AI_RATE_LIMIT` / `AI_RATE_WINDOW_MS` | `20` / `300000` | Per-IP AI request budget shared by both AI endpoints (5 minutes) |
| `API_RATE_LIMIT` / `API_RATE_WINDOW_MS` | `300` / `60000` | Per-IP limit for all `/api` requests |

### Docker

Use `docker compose up --build` to start the web app, Python data API, and PostgreSQL database. The web image runs as the non-root `node` user; the Python image runs as a non-root user. The web container has a health check on `/api/health`, and the data API has a database readiness check.

### Health check

`GET /api/health` → `{ status, environment, uptimeSeconds, aiConfigured, model }`. It never exposes the key.

## API

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/api/local-insights` | Body: `{ address?, title?, city?, state? }`; Google Search grounded report |
| `POST` | `/api/property-chat` | Body: `{ property, message, chatHistory? }`; capped at 2k chars/message, last 10 turns |
| `GET` | `/api/health` | Express liveness probe |
| `GET` | `/api/data/properties` | Shared property catalog (proxied to FastAPI) |
| `GET` | `/api/data/state` | Read anonymous browser-session data |
| `PUT` | `/api/data/state` | Save favorites, saved searches, tours, inquiries, and custom listings |
| `DELETE` | `/api/data/state` | Delete the current browser-session data |

Both AI endpoints validate and truncate input, cancel the upstream request after `AI_TIMEOUT_MS`, and share a per-IP rate limit. Internal error details are only returned outside production.

## Security notes

- The Gemini key stays on the server; the browser only calls same-origin `/api` routes.
- Visitor state is isolated by a random HTTP-only cookie. Set `SESSION_COOKIE_SECURE=true` behind HTTPS in production; anonymous sessions do not provide account recovery or multi-device access.
- Production responses include CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, referrer and permissions policies.
- Rate limiting is in-memory and per instance. Behind multiple replicas, use a shared limiter (e.g. Redis) or enforce limits at the edge.
- `TRUST_PROXY` defaults to `1` in production for PaaS deployments. If the server is directly internet-facing, set `TRUST_PROXY=0`, otherwise clients can spoof `X-Forwarded-For`.

## Data persistence

The demo property catalog is seeded into PostgreSQL from `python-api/seed_properties.json` the first time the database starts. Favorites, saved searches, tour requests, inquiries, and user-added demo listings are stored in PostgreSQL under a random, HTTP-only browser-session cookie. Existing localStorage data is imported into a new session on its first successful sync and then removed from the browser cache.

The session is anonymous and tied to one browser. There is no account system or cross-device sync. Tour requests and inquiries are stored for review; no emails or appointments are sent. Replace the sample catalog with a verified listing feed and connect an agent workflow before using this as a live marketplace. The PostgreSQL volume must be backed up in production.
