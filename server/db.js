import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "player.json");

const defaultPlayer = {
  id: 1,
  name: "Kagisho Blom",
  club: "Kaizer Chiefs",
  goals: 6,
  assists: 4,
  recoveries: "8.1",
  age: 26,
  position: "Midfielder",
  pass_accuracy: "87%",
  instagram: "",
  facebook: "",
  whatsapp: "27720000000",
  email: "",
  phone: "",
  nationality: "South African",
  height: "",
  weight: "",
  preferred_foot: "Right",
  jersey_number: "15",
  work_rate: "High/High",
  bio: "A dedicated midfielder known for tactical intelligence, physical presence, and composure in high-pressure competitive environments.",
  cv_summary: "Professional footballer profile prepared for scouts, clubs, and representatives.",
  achievements: "",
  highlight_title_1: "Season Highlights 2025/26",
  highlight_url_1: "",
  highlight_title_2: "Defensive Masterclass",
  highlight_url_2: "",
  highlight_duration_1: "4:15",
  highlight_duration_2: "3:40",
  is_available: 1
};

const normalizePlayer = (player = {}) => ({
  ...defaultPlayer,
  ...player,
  goals: Number(player.goals ?? defaultPlayer.goals) || 0,
  assists: Number(player.assists ?? defaultPlayer.assists) || 0,
  age: Number(player.age ?? defaultPlayer.age) || 0,
  is_available: player.is_available === false || player.is_available === 0 || player.is_available === "0" ? 0 : 1
});

const readLocalPlayer = async () => {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    const content = await fs.readFile(dataFile, "utf8");
    return normalizePlayer(JSON.parse(content));
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(defaultPlayer, null, 2));
    return defaultPlayer;
  }
};

const writeLocalPlayer = async (player) => {
  await fs.mkdir(dataDir, { recursive: true });
  const normalized = normalizePlayer(player);
  await fs.writeFile(dataFile, JSON.stringify(normalized, null, 2));
  return normalized;
};

const tursoClient = process.env.TURSO_DATABASE_URL
  ? createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  : null;

export const getPlayer = async () => {
  if (!tursoClient) {
    return readLocalPlayer();
  }

  const result = await tursoClient.execute("SELECT * FROM player_stats WHERE id = 1");
  return normalizePlayer(result.rows[0] || defaultPlayer);
};

export const updatePlayer = async (updates) => {
  const current = await getPlayer();
  const next = normalizePlayer({ ...current, ...updates, id: 1 });

  if (!tursoClient) {
    return writeLocalPlayer(next);
  }

  const fields = [
    "name",
    "club",
    "goals",
    "assists",
    "recoveries",
    "age",
    "position",
    "pass_accuracy",
    "instagram",
    "facebook",
    "whatsapp",
    "email",
    "phone",
    "nationality",
    "height",
    "weight",
    "preferred_foot",
    "jersey_number",
    "work_rate",
    "bio",
    "cv_summary",
    "achievements",
    "highlight_title_1",
    "highlight_url_1",
    "highlight_title_2",
    "highlight_url_2",
    "highlight_duration_1",
    "highlight_duration_2",
    "is_available"
  ];

  await tursoClient.execute({
    sql: `UPDATE player_stats SET ${fields.map((field) => `${field} = ?`).join(", ")} WHERE id = 1`,
    args: fields.map((field) => next[field] ?? "")
  });

  return next;
};

export const client = {
  execute: async (query) => {
    const sql = typeof query === "string" ? query : query.sql;
    if (sql.trim().toUpperCase().startsWith("SELECT")) {
      return { rows: [await getPlayer()] };
    }
    if (sql.trim().toUpperCase().startsWith("UPDATE")) {
      return { rowsAffected: 1 };
    }
    throw new Error(`Unsupported query: ${sql}`);
  }
};
