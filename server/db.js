import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env');
}

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// ── Bootstrap all tables on startup ──────────────────────────────────────────

export const bootstrapSchema = async () => {
  // Run each CREATE TABLE separately (Turso executeMultiple can be flaky)
  const tables = [
    `CREATE TABLE IF NOT EXISTS media_items (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      category   TEXT    NOT NULL DEFAULT 'photo',
      title      TEXT    NOT NULL DEFAULT '',
      url        TEXT    NOT NULL,
      public_id  TEXT    NOT NULL,
      thumbnail  TEXT    DEFAULT '',
      duration   TEXT    DEFAULT '',
      file_type  TEXT    DEFAULT '',
      created_at TEXT    DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS player_history (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      goals             INTEGER DEFAULT 0,
      assists           INTEGER DEFAULT 0,
      pass_accuracy     TEXT    DEFAULT '',
      shot_conversion   TEXT    DEFAULT '',
      dribble_success   TEXT    DEFAULT '',
      recoveries        TEXT    DEFAULT '',
      chances_created   TEXT    DEFAULT '',
      sprint_speed      TEXT    DEFAULT '',
      avg_distance      TEXT    DEFAULT '',
      sprints_per_match TEXT    DEFAULT '',
      label             TEXT    DEFAULT '',
      snapped_at        TEXT    DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS previous_clubs (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      club_name  TEXT NOT NULL,
      role       TEXT DEFAULT '',
      season     TEXT DEFAULT '',
      apps       TEXT DEFAULT '',
      goals      TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS fixtures (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      match_date   TEXT NOT NULL,
      match_time   TEXT DEFAULT '',
      home_team    TEXT NOT NULL,
      away_team    TEXT NOT NULL,
      venue        TEXT DEFAULT '',
      competition  TEXT DEFAULT '',
      home_score   INTEGER DEFAULT NULL,
      away_score   INTEGER DEFAULT NULL,
      is_completed INTEGER DEFAULT 0,
      notes        TEXT DEFAULT '',
      created_at   TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS community_follows (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      email       TEXT DEFAULT '',
      message     TEXT DEFAULT '',
      status      TEXT DEFAULT 'approved',
      created_at  TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS community_comments (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      follow_id   INTEGER DEFAULT NULL,
      name        TEXT NOT NULL,
      email       TEXT DEFAULT '',
      comment     TEXT NOT NULL,
      status      TEXT DEFAULT 'approved',
      created_at  TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS site_settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS chatbot_profile (
      id   INTEGER PRIMARY KEY DEFAULT 1,
      data TEXT    DEFAULT '{}'
    )`,
    `CREATE TABLE IF NOT EXISTS chatbot_photos (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      url         TEXT    NOT NULL,
      public_id   TEXT    NOT NULL DEFAULT '',
      caption     TEXT    DEFAULT '',
      uploaded_at TEXT    DEFAULT (datetime('now'))
    )`,
  ];

  for (const sql of tables) {
    await db.execute({ sql, args: [] });
  }

  for (const col of [
    `ALTER TABLE community_comments ADD COLUMN ai_reply TEXT DEFAULT ''`,
    `ALTER TABLE fixtures ADD COLUMN commentary TEXT DEFAULT ''`,
  ]) {
    try { await db.execute({ sql: col, args: [] }); } catch { /* column already exists */ }
  }

  // Seed default site settings
  const defaults = [
    ['accent_color', 'red'],
    ['hero_image_url', ''],
    ['hero_image_public_id', ''],
    ['profile_image_url', ''],
    ['profile_image_public_id', ''],
  ];
  for (const [key, value] of defaults) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)`,
      args: [key, value],
    });
  }
};

// ── Site settings ─────────────────────────────────────────────────────────────

export const getSiteSettings = async () => {
  const result = await db.execute({ sql: `SELECT key, value FROM site_settings`, args: [] });
  const settings = {};
  for (const row of result.rows) settings[row.key] = row.value;
  return settings;
};

export const setSiteSetting = async (key, value) => {
  await db.execute({
    sql: `INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    args: [key, value],
  });
};

// ── Default player ────────────────────────────────────────────────────────────

const defaultPlayer = {
  id: 1,
  name: 'Kagisho Blom',
  club: 'Kimberley United FC',
  position: 'Midfielder',
  nationality: 'South African',
  age: 19,
  height: '',
  weight: '',
  preferred_foot: 'Right',
  jersey_number: '15',
  work_rate: 'High/High',
  goals: 6,
  assists: 4,
  recoveries: '8.1',
  pass_accuracy: '87%',
  shot_conversion: '18%',
  dribble_success: '64%',
  chances_created: '12',
  sprint_speed: '34.2 km/h',
  avg_distance: '11.4 km',
  sprints_per_match: '28',
  email: '',
  phone: '',
  whatsapp: '0634133628',
  instagram: '',
  facebook: '',
  bio: 'A dedicated midfielder known for tactical intelligence, physical presence, and composure in high-pressure competitive environments.',
  cv_summary: 'Professional footballer profile prepared for scouts, clubs, and representatives.',
  achievements: '',
  highlight_title_1: 'Season Highlights 2025/26',
  highlight_url_1: '',
  highlight_duration_1: '4:15',
  highlight_title_2: 'Defensive Masterclass',
  highlight_url_2: '',
  highlight_duration_2: '3:40',
  is_available: 1,
  updated_at: '',
};

const normalizePlayer = (row = {}) => ({
  ...defaultPlayer,
  ...row,
  goals: Number(row.goals ?? defaultPlayer.goals) || 0,
  assists: Number(row.assists ?? defaultPlayer.assists) || 0,
  age: Number(row.age ?? defaultPlayer.age) || 0,
  is_available: row.is_available === false || row.is_available === 0 || row.is_available === '0' ? 0 : 1,
});

// ── Player CRUD ───────────────────────────────────────────────────────────────

export const getPlayer = async () => {
  const result = await db.execute({ sql: 'SELECT * FROM player_stats WHERE id = 1 LIMIT 1', args: [] });
  return normalizePlayer(result.rows[0] || defaultPlayer);
};

export const updatePlayer = async (updates) => {
  const current = await getPlayer();
  const next = normalizePlayer({ ...current, ...updates, id: 1 });
  const fields = [
    'name','club','position','nationality','age','height','weight',
    'preferred_foot','jersey_number','work_rate','goals','assists',
    'recoveries','pass_accuracy','shot_conversion','dribble_success',
    'chances_created','sprint_speed','avg_distance','sprints_per_match',
    'email','phone','whatsapp','instagram','facebook',
    'bio','cv_summary','achievements',
    'highlight_title_1','highlight_url_1','highlight_duration_1',
    'highlight_title_2','highlight_url_2','highlight_duration_2',
    'is_available',
  ];
  const now = new Date().toISOString();
  await db.execute({
    sql: `UPDATE player_stats SET ${fields.map(f => `${f} = ?`).join(', ')}, updated_at = ? WHERE id = 1`,
    args: [...fields.map(f => next[f] ?? null), now],
  });
  snapshotStats(next).catch(() => {});
  return { ...next, updated_at: now };
};

// ── Player history / trends ───────────────────────────────────────────────────

export const snapshotStats = async (player, label = '') => {
  await db.execute({
    sql: `INSERT INTO player_history (goals,assists,pass_accuracy,shot_conversion,dribble_success,recoveries,chances_created,sprint_speed,avg_distance,sprints_per_match,label) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    args: [player.goals,player.assists,player.pass_accuracy,player.shot_conversion,player.dribble_success,player.recoveries,player.chances_created,player.sprint_speed,player.avg_distance,player.sprints_per_match, label || new Date().toLocaleDateString('en-ZA')],
  });
};

export const getPlayerHistory = async (limit = 20) => {
  const result = await db.execute({ sql: `SELECT * FROM player_history ORDER BY snapped_at DESC LIMIT ?`, args: [limit] });
  return result.rows.reverse();
};

// ── Previous clubs ────────────────────────────────────────────────────────────

export const getPreviousClubs = async () => {
  const result = await db.execute({ sql: `SELECT * FROM previous_clubs ORDER BY sort_order ASC, created_at ASC`, args: [] });
  return result.rows;
};

export const savePreviousClub = async ({ club_name, role, season, apps, goals, sort_order }) => {
  const result = await db.execute({
    sql: `INSERT INTO previous_clubs (club_name, role, season, apps, goals, sort_order) VALUES (?,?,?,?,?,?)`,
    args: [club_name, role || '', season || '', apps || '', goals || '', sort_order || 0],
  });
  return result.lastInsertRowid;
};

export const updatePreviousClub = async (id, data) => {
  await db.execute({
    sql: `UPDATE previous_clubs SET club_name=?, role=?, season=?, apps=?, goals=?, sort_order=? WHERE id=?`,
    args: [data.club_name, data.role||'', data.season||'', data.apps||'', data.goals||'', data.sort_order||0, id],
  });
};

export const deletePreviousClub = async (id) => {
  await db.execute({ sql: `DELETE FROM previous_clubs WHERE id = ?`, args: [id] });
};

// ── Fixtures ──────────────────────────────────────────────────────────────────

export const getFixtures = async ({ upcoming = false, limit = 20 } = {}) => {
  const today = new Date().toISOString().split('T')[0];
  const sql = upcoming
    ? `SELECT * FROM fixtures WHERE match_date >= ? ORDER BY match_date ASC LIMIT ?`
    : `SELECT * FROM fixtures ORDER BY match_date DESC LIMIT ?`;
  const args = upcoming ? [today, limit] : [limit];
  const result = await db.execute({ sql, args });
  return result.rows;
};

export const saveFixture = async (data) => {
  const result = await db.execute({
    sql: `INSERT INTO fixtures (match_date,match_time,home_team,away_team,venue,competition,home_score,away_score,is_completed,notes) VALUES (?,?,?,?,?,?,?,?,?,?)`,
    args: [data.match_date,data.match_time||'',data.home_team,data.away_team,data.venue||'',data.competition||'',data.home_score??null,data.away_score??null,data.is_completed?1:0,data.notes||''],
  });
  return result.lastInsertRowid;
};

export const updateFixture = async (id, data) => {
  await db.execute({
    sql: `UPDATE fixtures SET match_date=?,match_time=?,home_team=?,away_team=?,venue=?,competition=?,home_score=?,away_score=?,is_completed=?,notes=? WHERE id=?`,
    args: [data.match_date,data.match_time||'',data.home_team,data.away_team,data.venue||'',data.competition||'',data.home_score??null,data.away_score??null,data.is_completed?1:0,data.notes||'',id],
  });
};

export const deleteFixture = async (id) => {
  await db.execute({ sql: `DELETE FROM fixtures WHERE id = ?`, args: [id] });
};

// ── Community: follows ────────────────────────────────────────────────────────

export const getCommunityFollows = async () => {
  const result = await db.execute({ sql: `SELECT * FROM community_follows ORDER BY created_at DESC`, args: [] });
  return result.rows;
};

export const saveCommunityFollow = async ({ name, message }) => {
  const result = await db.execute({
    sql: `INSERT INTO community_follows (name, email, message, status) VALUES (?,?,?,?)`,
    args: [name, '', message || '', 'approved'],
  });
  return result.lastInsertRowid;
};

export const updateFollowStatus = async (id, status) => {
  await db.execute({ sql: `UPDATE community_follows SET status = ? WHERE id = ?`, args: [status, id] });
};

export const getFollowByEmail = async (email) => {
  const result = await db.execute({ sql: `SELECT * FROM community_follows WHERE email = ? LIMIT 1`, args: [email] });
  return result.rows[0] || null;
};

// ── Community: comments ───────────────────────────────────────────────────────

export const getCommunityComments = async (status = null) => {
  const sql = status
    ? `SELECT * FROM community_comments WHERE status = ? ORDER BY created_at DESC`
    : `SELECT * FROM community_comments ORDER BY created_at DESC`;
  const result = await db.execute({ sql, args: status ? [status] : [] });
  return result.rows;
};

export const saveCommunityComment = async ({ name, comment }) => {
  const result = await db.execute({
    sql: `INSERT INTO community_comments (name, email, comment, follow_id, status) VALUES (?,?,?,?,?)`,
    args: [name, '', comment, null, 'approved'],
  });
  return result.lastInsertRowid;
};

export const updateCommentStatus = async (id, status) => {
  await db.execute({ sql: `UPDATE community_comments SET status = ? WHERE id = ?`, args: [status, id] });
};

export const deleteComment = async (id) => {
  await db.execute({ sql: `DELETE FROM community_comments WHERE id = ?`, args: [id] });
};

export const deleteFollow = async (id) => {
  await db.execute({ sql: `DELETE FROM community_follows WHERE id = ?`, args: [id] });
};

// ── Media items ───────────────────────────────────────────────────────────────

export const getMediaItems = async (category = null) => {
  const sql = category
    ? `SELECT * FROM media_items WHERE category = ? ORDER BY created_at DESC`
    : `SELECT * FROM media_items ORDER BY created_at DESC`;
  const result = await db.execute({ sql, args: category ? [category] : [] });
  return result.rows;
};

export const saveMediaItem = async ({ category, title, url, public_id, thumbnail, duration, file_type }) => {
  const result = await db.execute({
    sql: `INSERT INTO media_items (category,title,url,public_id,thumbnail,duration,file_type) VALUES (?,?,?,?,?,?,?)`,
    args: [category, title||'', url, public_id, thumbnail||'', duration||'', file_type||''],
  });
  return result.lastInsertRowid;
};

export const deleteMediaItem = async (id) => {
  const result = await db.execute({ sql: `SELECT public_id FROM media_items WHERE id = ?`, args: [id] });
  const publicId = result.rows[0]?.public_id || null;
  await db.execute({ sql: `DELETE FROM media_items WHERE id = ?`, args: [id] });
  return publicId;
};

export const updateMediaItem = async (id, { title, category }) => {
  await db.execute({ sql: `UPDATE media_items SET title=?, category=? WHERE id=?`, args: [title, category, id] });
};

// ── Contact leads ─────────────────────────────────────────────────────────────

export const saveContactLead = async ({ name, email, message }) => {
  await db.execute({
    sql: `INSERT INTO contact_leads (name,email,message,read,created_at) VALUES (?,?,?,0,datetime('now'))`,
    args: [name, email, message],
  });
};

export const getContactLeads = async () => {
  const result = await db.execute({ sql: `SELECT * FROM contact_leads ORDER BY created_at DESC`, args: [] });
  return result.rows;
};

export const markLeadRead = async (id) => {
  await db.execute({ sql: `UPDATE contact_leads SET read = 1 WHERE id = ?`, args: [id] });
};

export const updateCommentAiReply = async (id, aiReply) => {
  await db.execute({ sql: `UPDATE community_comments SET ai_reply = ? WHERE id = ?`, args: [aiReply, id] });
};

export const updateFixtureCommentary = async (id, commentary) => {
  await db.execute({ sql: `UPDATE fixtures SET commentary = ? WHERE id = ?`, args: [commentary, id] });
};

// ── Server logs ───────────────────────────────────────────────────────────────

export const saveLog = async (level, message, meta = null) => {
  try {
    await db.execute({
      sql: `INSERT INTO server_logs (level,message,meta,created_at) VALUES (?,?,?,datetime('now'))`,
      args: [level, message, meta ? JSON.stringify(meta) : null],
    });
  } catch { /* never crash on log */ }
};

export const getLogs = async (limit = 200) => {
  const result = await db.execute({ sql: `SELECT * FROM server_logs ORDER BY created_at DESC LIMIT ?`, args: [limit] });
  return result.rows.reverse();
};
// ── Chatbot profile ───────────────────────────────────────────────────────────

export const getChatbotProfile = async () => {
  const result = await db.execute({ sql: `SELECT data FROM chatbot_profile WHERE id = 1 LIMIT 1`, args: [] });
  try { return JSON.parse(result.rows[0]?.data || '{}'); } catch { return {}; }
};

export const saveChatbotProfile = async (data) => {
  await db.execute({
    sql: `INSERT INTO chatbot_profile (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data`,
    args: [JSON.stringify(data)],
  });
};

// ── Chatbot photos ────────────────────────────────────────────────────────────

export const getChatbotPhotos = async () => {
  const result = await db.execute({ sql: `SELECT * FROM chatbot_photos ORDER BY uploaded_at DESC`, args: [] });
  return result.rows;
};

export const saveChatbotPhoto = async ({ url, public_id, caption }) => {
  const result = await db.execute({
    sql: `INSERT INTO chatbot_photos (url, public_id, caption) VALUES (?, ?, ?)`,
    args: [url, public_id, caption || ''],
  });
  return result.lastInsertRowid;
};

export const deleteChatbotPhoto = async (id) => {
  const result = await db.execute({ sql: `SELECT public_id FROM chatbot_photos WHERE id = ?`, args: [id] });
  const publicId = result.rows[0]?.public_id || null;
  await db.execute({ sql: `DELETE FROM chatbot_photos WHERE id = ?`, args: [id] });
  return publicId;
};