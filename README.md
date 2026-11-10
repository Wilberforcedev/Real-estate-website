# EstateVue

Map-first real estate search: interactive listings, advanced filters, side-by-side comparison, mortgage estimates, tour scheduling, saved searches, and AI-powered neighborhood insights and property Q&A.

## Stack

- React 19 + TypeScript + Vite 6, Tailwind CSS 4
- Leaflet + React Leaflet (OpenStreetMap / CARTO / Esri tiles)
- Express 4 server (`server.ts`) serving the SPA and two Gemini endpoints
- `@google/genai` with Google Search grounding for local area insights

## Requirements

- Node.js 20+ (tested on Node 20/22)
- A Gemini API key for the AI features (the rest of the app works without one)

## Local development

```bash
npm install
cp .env.example .env    # add GEMINI_API_KEY
npm run dev             # http://localhost:3000
```

`npm run dev` runs `tsx server.ts`, which mounts Vite in middleware mode and serves the API on the same origin.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server with Vite HMR |
| `npm run lint` | TypeScript type check (`tsc --noEmit`) |
| `npm run build` | Build the client to `dist/` and bundle the server to `server-dist/server.cjs` |
| `npm start` | Run the production build (sets production mode via npm lifecycle) |
| `npm run preview` | Preview the Vite client build |

## Production

```bash
npm ci
npm run lint
npm run build
NODE_ENV=production PORT=3000 GEMINI_API_KEY=... npm start
```

`dist/` contains only client assets; the server bundle lives in `server-dist/` so it is never served statically. The server must serve `dist/` — do not deploy the static folder to a plain static host, because `/api/*` is required at runtime.

### Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | – | Server-side Gemini key. AI endpoints return `503` when missing |
| `GEMINI_MODEL` | `gemini-3.6-flash` | Model used by both AI endpoints |
| `PORT` | `3000` | HTTP port |
| `NODE_ENV` | `development` | `production` enables static serving, logging, CSP and HSTS |
| `TRUST_PROXY` | `1` in production, `0` in development | Hop count/flag for `X-Forwarded-For`. Keep `0` if directly exposed |
| `AI_TIMEOUT_MS` | `30000` | Upstream Gemini timeout |
| `AI_RATE_LIMIT` / `AI_RATE_WINDOW_MS` | `20` / `300000` | Per-IP AI request budget shared by both AI endpoints (5 minutes) |
| `API_RATE_LIMIT` / `API_RATE_WINDOW_MS` | `300` / `60000` | Per-IP limit for all `/api` requests |

### Docker

```bash
docker build -t estatevue .
docker run -p 3000:3000 -e GEMINI_API_KEY=... estatevue
```

The image runs as the non-root `node` user, uses the multi-stage build, and exposes a `HEALTHCHECK` against `/api/health`.

### Health check

`GET /api/health` → `{ status, environment, uptimeSeconds, aiConfigured, model }`. It never exposes the key.

## API

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/api/local-insights` | Body: `{ address?, title?, city?, state? }`; Google Search grounded report |
| `POST` | `/api/property-chat` | Body: `{ property, message, chatHistory? }`; capped at 2k chars/message, last 10 turns |
| `GET` | `/api/health` | Liveness probe |

Both AI endpoints validate and truncate input, cancel the upstream request after `AI_TIMEOUT_MS`, and share a per-IP rate limit. Internal error details are only returned outside production.

## Security notes

- The Gemini key stays on the server; the browser only calls same-origin `/api` routes.
- Production responses include CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, referrer and permissions policies.
- Rate limiting is in-memory and per instance. Behind multiple replicas, use a shared limiter (e.g. Redis) or enforce limits at the edge.
- `TRUST_PROXY` defaults to `1` in production for PaaS deployments. If the server is directly internet-facing, set `TRUST_PROXY=0`, otherwise clients can spoof `X-Forwarded-For`.

## Data persistence

Listings (including user-added ones), favorites, tours, and saved searches live in `localStorage` — per device, no account or database. The server is stateless apart from the in-memory rate-limit counters and the AI cache is per browser session.
