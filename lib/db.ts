import { schema } from "@/lib/schema";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle({
  schema,
  connection: {
    host: process.env.DATABASE_HOST as string,
    port: Number(process.env.DATABASE_PORT as string),
    database: process.env.DATABASE_DB as string,
    user: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PASSWORD as string,
    ssl: false,
  },
});
