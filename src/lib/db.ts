import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Please add it to your .env.local file.\n" +
      "Get it from your Supabase project settings > Database > Connection string.\n\n" +
      "Example .env.local:\n" +
      "DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
  );
}

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
