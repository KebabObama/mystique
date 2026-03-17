import * as sch from "@/db/schema";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

/** Defines the schema constant. */
export const schema = sch;
/** Defines the db constant. */
export const db = drizzle({
  connection: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_DB,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    ssl: false,
  },
  schema,
});
