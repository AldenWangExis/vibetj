import dotenv from "dotenv";
import path from "path";
import { sql } from "drizzle-orm";

// Load .env.local manually
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testConnection() {
  // Dynamic import to ensure env vars are loaded first
  const { db } = await import("../src/lib/db");
  
  try {
    console.log("Testing database connection...");
    const result = await db.execute(sql`SELECT NOW() as time, version() as version`);
    console.log("Connection Successful!");
    console.log("Database Time:", result.rows[0].time);
    console.log("Postgres Version:", result.rows[0].version);
    process.exit(0);
  } catch (error) {
    console.error("Connection Failed:", error);
    process.exit(1);
  }
}

testConnection();
