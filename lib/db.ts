import { schema } from "@/lib/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import Redis from "ioredis";
import { Pool } from "pg";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
});

export const db = drizzle(
  new Pool({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_DB,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    ssl: false,
  }),
  {
    schema,
    cache: {
      strategy: () => "all",
      get: async (key) => {
        console.log("get");
        const result = await redis.get(`drizzle:cache:${key}`);
        return result ? JSON.parse(result) : null;
      },
      put: async (key, value) => {
        console.log("put");
        await redis.set(`drizzle:cache:${key}`, JSON.stringify(value), "EX", 3600);
      },
      onMutate: async (notifier) => {
        console.log("mutation");
        const tables = Array.isArray(notifier.tables) ? notifier.tables : [notifier.tables];
        if (tables.length > 0 && tables[0] !== undefined) {
          const keys = await redis.keys("drizzle:cache:*");
          if (keys.length > 0) {
            await redis.del(...keys);
            console.log(`Cleared ${keys.length} cached queries.`);
          }
        }
      },
    },
  }
);
