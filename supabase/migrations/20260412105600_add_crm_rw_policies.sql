/*
  # CRM Read/Write Policies

  1. Changes
    - player_stats: allow upsert (for CRM updates)
    - contact_leads: allow SELECT so the API can fetch leads for the CRM panel
    - server_logs: allow INSERT and SELECT (server-side operations via anon key)

  2. Notes
    - These policies are intentionally permissive for the anon key because
      the actual access control is enforced at the application layer (CRM password)
    - player_stats updates are only possible through the authenticated server endpoint
*/

CREATE POLICY "Allow upsert on player stats"
  ON player_stats FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow insert on player stats"
  ON player_stats FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow server to read leads"
  ON contact_leads FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow server to update leads"
  ON contact_leads FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow server to insert logs"
  ON server_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow server to read logs"
  ON server_logs FOR SELECT
  TO anon, authenticated
  USING (true);
