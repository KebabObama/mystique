import { readdir } from "node:fs/promises";
import { extname } from "node:path";
import { db } from "../lib/db";

type Seed = { seed?: () => Promise<void> };

const isSeedFile = (name: string) => {
  if (name.endsWith(".d.ts")) return false;
  return [".ts", ".tsx", ".js", ".mjs", ".cjs"].includes(extname(name));
};

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
      console.warn(`[seed] Skipping ${file}: no exported seed() found.`);
      continue;
    }
    console.info(`[seed] Running ${file}...`);
    await seedModule.seed();
  }
  console.info("[seed] Completed.");
} catch (error) {
  console.error("[seed] Failed:", error);
  process.exitCode = 1;
} finally {
  await db.$client.end();
}
