import { createClient } from "redis";

const cache = createClient({
  socket: {
    host: process.env.CACHE_HOST as string,
    port: Number(process.env.CACHE_PORT as string),
  },
});
await cache.connect();
export { cache };
