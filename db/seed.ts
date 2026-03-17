import "dotenv/config";
import { readdir } from "node:fs/promises";
import { extname } from "node:path";
import { db } from "../src/lib/db";
/** Re-exports public module members. */
export { db, schema } from "../src/lib/db";
/** Re-exports the game API. */
export { Game } from "../src/lib/game";
/** Re-exports the in game helpers API. */
export { InGameHelpers } from "../src/lib/ingame-helpers";

type Seed = { seed?: () => Promise<void> };

const isSeedFile = (name: string) => {
  if (name.endsWith(".d.ts")) return false;
  return [".ts", ".tsx", ".js", ".mjs", ".cjs"].includes(extname(name));
};

const run = async () => {
  try {
    const seedDir = new URL("./seed/", import.meta.url);
    const entries = await readdir(seedDir, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && isSeedFile(entry.name))
      .map((entry) => entry.name);

    for (const file of files) {
      const moduleUrl = new URL(`./seed/${file}`, import.meta.url);
      const seedModule = (await import(moduleUrl.href)) as Seed;
      if (typeof seedModule.seed !== "function") {
        continue;
      }
      await seedModule.seed();
    }
  } catch (error) {
    process.exitCode = 1;
    throw error;
  } finally {
    db.$client.end();
  }
};

void run();
