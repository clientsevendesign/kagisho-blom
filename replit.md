# Kagisho Blom Profile

## Overview
React and Vite frontend with an Express API backend for player profile data, contact form handling, and profile updates.

## Project Structure
- `src/`: React application pages and components
- `server/`: Express API server and data access layer
- `public/`: Static assets served by Vite

## Replit Setup
- Development runs through a single web workflow on port 5000.
- Vite listens on `0.0.0.0:5000` and allows all hosts for the Replit preview proxy.
- The Express API binds to `127.0.0.1:3001` during development and is proxied by Vite through `/api`.
- Production builds the frontend into `dist` and serves it from the Express server.

## Data and Services
- If `TURSO_DATABASE_URL` is provided, the backend uses Turso/libSQL.
- Without Turso credentials, the backend uses a local JSON-backed player profile at `server/data/player.json`.
- If `BREVO_API_KEY` is provided, contact submissions send Brevo transactional emails.
- Without Brevo credentials, contact submissions are accepted and logged by the backend.