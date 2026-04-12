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
  is_available: 1
};

const readLocalPlayer = async () => {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    const content = await fs.readFile(dataFile, "utf8");
    return JSON.parse(content);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(defaultPlayer, null, 2));
    return defaultPlayer;
  }
};

const writeLocalPlayer = async (player) => {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(player, null, 2));
};

const createLocalClient = () => ({
  execute: async (query) => {
    const sql = typeof query === "string" ? query : query.sql;
    if (sql.trim().toUpperCase().startsWith("SELECT")) {
      const player = await readLocalPlayer();
      return { rows: [player] };
    }

    if (sql.trim().toUpperCase().startsWith("UPDATE")) {
      const args = query.args || [];
      const keys = ["club", "goals", "assists", "recoveries", "age", "position", "pass_accuracy", "instagram", "facebook", "whatsapp", "is_available"];
      const current = await readLocalPlayer();
      const next = keys.reduce((player, key, index) => ({ ...player, [key]: args[index] }), current);
      await writeLocalPlayer(next);
      return { rowsAffected: 1 };
    }

    throw new Error(`Unsupported local query: ${sql}`);
  }
});

export const client = process.env.TURSO_DATABASE_URL
  ? createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  : createLocalClient();