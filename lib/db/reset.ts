import { config } from "dotenv";
import postgres from "postgres";

config({
  path: ".env.local",
});

const resetDatabase = async () => {
  const databaseUrl =
    process.env.POSTGRES_URL ?? process.env.STORAGE_POSTGRES_URL;

  if (!databaseUrl) {
    throw new Error("POSTGRES_URL is not defined");
  }

  const sql = postgres(databaseUrl, { max: 1 });

  try {
    console.log("⏳ Resetting database schema...");
    await sql`DROP SCHEMA IF EXISTS public CASCADE`;
    await sql`CREATE SCHEMA public`;
    await sql`GRANT ALL ON SCHEMA public TO CURRENT_USER`;
    await sql`GRANT ALL ON SCHEMA public TO PUBLIC`;
    await sql`DROP SCHEMA IF EXISTS drizzle CASCADE`;
    await sql`CREATE SCHEMA drizzle`;
    console.log("✅ Database schema reset. Run migrations next.");
  } finally {
    await sql.end();
  }
};

resetDatabase().catch((error) => {
  console.error("❌ Database reset failed");
  console.error(error);
  process.exit(1);
});
