import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

export const sql = postgres(process.env.DB_URL!, {
  transform: postgres.toCamel,
  ssl: "require",
});
