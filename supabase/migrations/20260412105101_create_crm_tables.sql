/*
  # CRM Database Schema

  1. New Tables
    - `player_stats`
      - Stores the footballer's profile, stats, media links, and contact info
      - Single row (id=1) used as a singleton config
    - `contact_leads`
      - Stores all incoming scout/club contact form submissions
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `message` (text)
      - `created_at` (timestamptz)
      - `read` (boolean, default false)
    - `server_logs`
      - Stores server-side request and event logs for the CRM terminal view
      - `id` (uuid, primary key)
      - `level` (text: info, warn, error)
      - `message` (text)
      - `meta` (jsonb, optional extra data)
      - `created_at` (timestamptz)

  2. Security
    - RLS enabled on all tables
    - player_stats: public read, no public write
    - contact_leads: public insert (for form submissions), no public read
    - server_logs: no public access (server-side only via service role)

  3. Notes
    - contact_leads.read allows CRM to mark leads as reviewed
    - server_logs stores up to 1000 recent entries (managed by server)
*/

CREATE TABLE IF NOT EXISTS player_stats (
  id integer PRIMARY KEY DEFAULT 1,
  name text NOT NULL DEFAULT 'Kagisho Blom',
  club text NOT NULL DEFAULT 'Kaizer Chiefs',
  goals integer NOT NULL DEFAULT 6,
  assists integer NOT NULL DEFAULT 4,
  recoveries text NOT NULL DEFAULT '8.1',
  age integer NOT NULL DEFAULT 26,
  position text NOT NULL DEFAULT 'Midfielder',
  pass_accuracy text NOT NULL DEFAULT '87%',
  instagram text NOT NULL DEFAULT '',
  facebook text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '27720000000',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  nationality text NOT NULL DEFAULT 'South African',
  height text NOT NULL DEFAULT '',
  weight text NOT NULL DEFAULT '',
  preferred_foot text NOT NULL DEFAULT 'Right',
  jersey_number text NOT NULL DEFAULT '15',
  work_rate text NOT NULL DEFAULT 'High/High',
  bio text NOT NULL DEFAULT 'A dedicated midfielder known for tactical intelligence, physical presence, and composure in high-pressure competitive environments.',
  cv_summary text NOT NULL DEFAULT 'Professional footballer profile prepared for scouts, clubs, and representatives.',
  achievements text NOT NULL DEFAULT '',
  highlight_title_1 text NOT NULL DEFAULT 'Season Highlights 2025/26',
  highlight_url_1 text NOT NULL DEFAULT '',
  highlight_title_2 text NOT NULL DEFAULT 'Defensive Masterclass',
  highlight_url_2 text NOT NULL DEFAULT '',
  highlight_duration_1 text NOT NULL DEFAULT '4:15',
  highlight_duration_2 text NOT NULL DEFAULT '3:40',
  is_available integer NOT NULL DEFAULT 1,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO player_stats (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read player stats"
  ON player_stats FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS contact_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact lead"
  ON contact_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS server_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL DEFAULT 'info',
  message text NOT NULL,
  meta jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE server_logs ENABLE ROW LEVEL SECURITY;
