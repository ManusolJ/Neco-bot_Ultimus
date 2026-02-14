import { Pool } from "pg";

const DB = process.env.DB_NAME;
const USER = process.env.DB_USER;
const HOST = process.env.DB_HOST;
const PASSWORD = process.env.DB_PASSWORD;
const PORT = parseInt(process.env.DB_PORT || "5432");

const pool = new Pool({
  host: HOST,
  port: PORT,
  user: USER,
  database: DB,
  password: PASSWORD,
});

pool.on("error", (err) => {
  console.error("[ERROR] Unexpected pool error:", err);
});

export async function connectDb(): Promise<void> {
  const client = await pool.connect();
  client.release();
  console.log("Database connected.");
}

export default pool;
