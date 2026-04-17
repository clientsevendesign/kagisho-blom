# Kagisho Blom — Player Profile & CRM

A full-stack footballer profile and CRM for Kagisho Blom. Scouts, clubs, and agents can view stats, watch highlights, download a CV, and submit inquiries. Kagisho manages everything through a private CRM panel.

---

## Stack

| Layer           | Service                           |
|-----------------|-----------------------------------|
| Frontend        | React + Vite + Tailwind CSS       |
| Backend         | Express (Node.js)                 |
| Database        | Turso (LibSQL / SQLite edge)      |
| Media Storage   | Cloudinary (images, video, PDFs)  |
| Email           | Brevo (transactional)             |
| AI Dashboard    | Groq — Llama 3 (free)            |
| Frontend deploy | Vercel                            |
| Backend deploy  | Render                            |

---

## Project Structure

```
root/
├── client/                        # React frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── home.jsx           # Hero, fixtures, media preview, contact, community teaser
│   │   │   ├── about.jsx          # Bio, profile pic, club history
│   │   │   ├── stats.jsx          # Technical data + progress bars
│   │   │   ├── media.jsx          # Gallery + lightbox
│   │   │   ├── fixtures.jsx       # Upcoming + past results
│   │   │   ├── community.jsx      # Follow + comment system
│   │   │   ├── contact.jsx        # Dedicated contact page
│   │   │   ├── thankyou.jsx       # Post-contact confirmation
│   │   │   └── crm.jsx            # Full CRM (protected)
│   │   ├── components/
│   │   │   ├── navbar.jsx         # Responsive + hamburger
│   │   │   ├── footer.jsx
│   │   │   ├── statbox.jsx
│   │   │   └── crminput.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/
    ├── db.js                      # Turso client + all DB functions
    ├── index.js                   # Express routes
    └── package.json
```

---

## Environment Variables

### Server (`server/.env`)

```env
# Turso database
TURSO_DATABASE_URL=libsql://your-db-name-your-org.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token

# CRM password
CRM_PASSWORD=choose_a_strong_password_here

# Brevo transactional email
BREVO_API_KEY=your-brevo-api-key

# Cloudinary (media uploads + delete)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Render keep-alive (set this to your Render service URL)
RENDER_EXTERNAL_URL=https://your-app.onrender.com

PORT=3001
CLIENT_ORIGIN=https://your-vercel-frontend.vercel.app
```

### Client (`client/.env`)

```env
# Leave blank in local dev (Vite proxies /api to localhost:3001)
VITE_API_URL=https://your-render-backend.onrender.com

# Cloudinary unsigned upload (client-side)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=kagisho_media

# Groq AI (free — get key at console.groq.com)
VITE_GROQ_API_KEY=your_groq_api_key
```

---

## Turso Setup

### 1. Install CLI & login

```bash
curl -sSfL https://get.tur.so/install.sh | bash
turso auth login
```

### 2. Create database

```bash
turso db create kagisho-blom
turso db show kagisho-blom --url      # → TURSO_DATABASE_URL
turso db tokens create kagisho-blom   # → TURSO_AUTH_TOKEN
```

### 3. Create the core tables

```bash
turso db shell kagisho-blom
```

Paste and run:

```sql
CREATE TABLE IF NOT EXISTS player_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL DEFAULT 'Kagisho Blom',
  club TEXT DEFAULT 'Kimberley United FC',
  position TEXT DEFAULT 'Midfielder',
  nationality TEXT DEFAULT 'South African',
  age INTEGER DEFAULT 19,
  height TEXT DEFAULT '',
  weight TEXT DEFAULT '',
  preferred_foot TEXT DEFAULT 'Right',
  jersey_number TEXT DEFAULT '15',
  work_rate TEXT DEFAULT 'High/High',
  goals INTEGER DEFAULT 6,
  assists INTEGER DEFAULT 4,
  recoveries TEXT DEFAULT '8.1',
  pass_accuracy TEXT DEFAULT '87%',
  shot_conversion TEXT DEFAULT '18%',
  dribble_success TEXT DEFAULT '64%',
  chances_created TEXT DEFAULT '12',
  sprint_speed TEXT DEFAULT '34.2 km/h',
  avg_distance TEXT DEFAULT '11.4 km',
  sprints_per_match TEXT DEFAULT '28',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '0634133628',
  instagram TEXT DEFAULT '',
  facebook TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  cv_summary TEXT DEFAULT '',
  achievements TEXT DEFAULT '',
  highlight_title_1 TEXT DEFAULT 'Season Highlights 2025/26',
  highlight_url_1 TEXT DEFAULT '',
  highlight_duration_1 TEXT DEFAULT '4:15',
  highlight_title_2 TEXT DEFAULT 'Defensive Masterclass',
  highlight_url_2 TEXT DEFAULT '',
  highlight_duration_2 TEXT DEFAULT '3:40',
  is_available INTEGER DEFAULT 1,
  updated_at TEXT DEFAULT ''
);

INSERT OR IGNORE INTO player_stats (id) VALUES (1);

CREATE TABLE IF NOT EXISTS contact_leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS server_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  meta TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```

> **The server auto-creates all other tables** (media_items, player_history, previous_clubs, fixtures, community_follows, community_comments, site_settings) on first startup via `bootstrapSchema()`. You don't need to create them manually.

---

## Cloudinary Setup

1. Sign up free at [cloudinary.com](https://cloudinary.com)
2. From the dashboard, copy **Cloud Name**, **API Key**, **API Secret** → server `.env`
3. Copy just **Cloud Name** → client `.env` as `VITE_CLOUDINARY_CLOUD_NAME`
4. Go to **Settings → Upload → Upload Presets → Add Upload Preset**
   - Signing mode: **Unsigned**
   - Preset name: **`kagisho_media`**
   - Save
5. Add `VITE_CLOUDINARY_UPLOAD_PRESET=kagisho_media` to client `.env`

---

## Groq AI Setup (Free)

1. Go to [console.groq.com](https://console.groq.com) — sign up free, no credit card
2. Create an API key
3. Add `VITE_GROQ_API_KEY=your_key` to `client/.env`
4. Restart Vite (or redeploy frontend)

The AI Dashboard uses **Llama 3 8B** via Groq. It can analyse Kagisho's stats, suggest bio improvements, and give coaching tips.

---

## Brevo Email Setup

1. Sign up at [brevo.com](https://brevo.com)
2. Go to **Settings → API Keys** → copy key → `BREVO_API_KEY` in server `.env`
3. **Important:** Go to **Senders & Domains → Domains** and verify `kagishoblom.com` (or whatever domain you use as sender). Unverified domains cause silent email failures.
4. On startup the server validates your key and logs `Brevo ✓ authenticated as your@email.com`

---

## Local Development

```bash
# Terminal 1 — backend
cd server && npm install && npm run dev

# Terminal 2 — frontend
cd client && npm install && npm run dev
```

- Frontend: http://localhost:5000
- Backend: http://localhost:3001

---

## Deployment

### Backend → Render

1. Push repo to GitHub
2. Render → New Web Service → connect repo → Root Directory: `server`
3. Build: `npm install` · Start: `node index.js`
4. Add all `server/.env` vars under **Environment**
5. Add `RENDER_EXTERNAL_URL=https://your-app.onrender.com` — this enables the keep-alive ping that prevents Render free tier from sleeping

### Frontend → Vercel

1. Vercel → New Project → connect repo → Root Directory: `client`
2. Add all `client/.env` vars under **Environment Variables**
3. Deploy

---

## CRM Features

Navigate to `/login`. Enter `CRM_PASSWORD`.

| Tab | What it does |
|-----|-------------|
| **AI Dashboard** | Groq AI analyses stats, suggests bio improvements, gives coaching tips |
| **Profile** | Edit all player info, upload hero image + profile photo |
| **Stats** | Update season stats — each save creates a trend snapshot |
| **Achievements** | Add/remove honours and achievements |
| **Club History** | Add previous clubs with apps/goals/season |
| **Fixtures** | Add upcoming matches and log results |
| **Media** | Upload photos, videos, certificates, press with Cloudinary |
| **Trends** | Sparkline charts of stats over time |
| **Community** | Approve/reject follows and comments, email notifications auto-sent |
| **Leads** | View and manage scout inquiries |
| **Settings** | Switch website accent colour (Red / Sky Blue), AI key instructions |

---

## CV Generation

`GET /api/cv` — print-ready HTML with all player data including club history and certificates. Use browser Print → Save as PDF.
