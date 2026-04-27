# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Frontend (run from repo root)
npm run dev        # Vite dev server on localhost:5000 (proxies /api to localhost:3001)
npm run build      # Production build → dist/
npm run lint       # ESLint (flat config, v9+)
npm run preview    # Preview production build

# Backend (run from server/)
npm run dev        # Express with --watch hot reload on port 3001
npm start          # Production mode
```

Both must run simultaneously for local development. The Vite proxy forwards `/api/*` to `http://localhost:3001`.

## Architecture

**Full-stack footballer profile & CRM.** Frontend on Vercel, backend on Render, database on Turso (edge SQLite), media on Cloudinary, email via Brevo, AI via Groq (Llama 3 8B).

### Frontend (`src/`)

Single-page React 19 app with React Router v7. All top-level state (player data, settings, theme, auth) lives in `App.jsx` and flows down as props — no Redux or Zustand.

**Routing** is defined in `App.jsx`. The `/login` route conditionally renders `AdminLogin` or `CRM` based on `isAuthenticated` (derived from `sessionStorage.getItem('crm_token')`).

**API calls** use Axios with an interceptor that injects `x-crm-token` from sessionStorage. Production base URL is set via `VITE_API_URL`; in dev the Vite proxy handles it.

**Theming** uses a `data-theme` attribute on `<html>` for dark/light and a `--site-accent` CSS variable for the brand accent color (red `#e10600` or sky blue `#0ea5e9`).

### Backend (`server/`)

`server/index.js` — all Express routes (~988 lines). Public `/api/*` routes need no auth; protected routes call the `requireAuth` middleware which validates `x-crm-token`.

`server/db.js` — all Turso/LibSQL query functions (~600 lines). The database is a single SQLite instance accessed via `@libsql/client`.

**AI** is server-side only (Groq or Gemini). The `callAI()` function in `server/index.js` is the single entrypoint; it selects the provider based on which API key is set in the DB settings.

**SSE** (`/api/logs/stream`) broadcasts structured log entries to connected CRM clients in real time.

**Keep-alive** — the backend pings itself every 13 minutes to prevent Render free-tier sleep.

### Database Schema (Turso/SQLite)

Key tables: `player_stats` (single row, id=1), `site_settings` (key-value), `media_items`, `fixtures`, `previous_clubs`, `community_follows`, `community_comments`, `contact_leads`, `player_history` (stat snapshots for trend charts), `chatbot_profile`, `chatbot_photos`, `server_logs`.

### CRM Dashboard (`src/pages/crm.jsx`)

Protected at `/login`. Has 12 tabs: AI Dashboard, Profile, Stats, Achievements, Club History, Fixtures, Media, Trends, Community, Leads, Settings, Share, Chatbot Setup.

### Media Uploads

Client-side: unsigned upload to Cloudinary via `VITE_CLOUDINARY_CLOUD_NAME` + `VITE_CLOUDINARY_UPLOAD_PRESET` (`kagisho_media`).  
Server-side deletes: signed with `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET` from `server/.env`.

## Environment Variables

**Root `.env` (frontend, Vite-prefixed):**
```
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
VITE_API_URL=          # blank in dev; set to Render URL in production
```

**`server/.env` (backend):**
```
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
CRM_PASSWORD=
BREVO_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RENDER_EXTERNAL_URL=
PORT=3001
CLIENT_ORIGIN=         # Vercel frontend URL for CORS
```

## Deployment

- Frontend → Vercel. `vercel.json` rewrites all routes to `index.html` for SPA routing.
- Backend → Render. Set all `server/.env` vars as Render environment variables.
- Database → Turso. Run `server/db.js` schema init once to create tables.
