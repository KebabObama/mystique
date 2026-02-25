import { db, schema } from "../../lib/db";
import { Game } from "../../lib/game";

const bite = (min: number, max: number): Game.Ability => ({
  name: "Bite",
  cost: 1,
  range: 1,
  targeting: 0,
  amount: [min, max],
  effects: Game.withEffects(),
});

const slash = (min: number, max: number): Game.Ability => ({
  name: "Slash",
  cost: 1,
  range: 1,
  targeting: 0,
  amount: [min, max],
  effects: Game.withEffects(),
});

const smite = (min: number, max: number): Game.Ability => ({
  name: "Smite",
  cost: 2,
  range: 1,
  targeting: 1,
  amount: [min, max],
  effects: Game.withEffects(),
});

const bolt = (min: number, max: number): Game.Ability => ({
  name: "Bolt",
  cost: 1,
  range: 6,
  targeting: 0,
  amount: [min, max],
  effects: Game.withEffects({ shocked: 1 }),
});

const frost = (min: number, max: number): Game.Ability => ({
  name: "Frost",
  cost: 2,
  range: 5,
  targeting: 1,
  amount: [min, max],
  effects: Game.withEffects({ frostbite: 2 }),
});

const flame = (min: number, max: number): Game.Ability => ({
  name: "Flame",
  cost: 2,
  range: 4,
  targeting: 1,
  amount: [min, max],
  effects: Game.withEffects({ burning: 2 }),
});

const rot = (min: number, max: number): Game.Ability => ({
  name: "Corrode",
  cost: 2,
  range: 4,
  targeting: 0,
  amount: [min, max],
  effects: Game.withEffects({ corroding: 2 }),
});

// prettier-ignore
const MONSTERS: (typeof schema.monster.$inferInsert)[] = [
  { name: "Goblin", level: 1, hp: 8, maxHp: 8, armor: 0, stamina: 4, maxActions: 1, memory: 1, abilities: [slash(2, 4)] },
  { name: "Skeleton", level: 2, hp: 12, maxHp: 12, armor: 1, stamina: 5, maxActions: 1, memory: 2, abilities: [slash(3, 5)] },
  { name: "Kobold Scout", level: 1, hp: 7, maxHp: 7, armor: 0, stamina: 5, maxActions: 2, memory: 1, abilities: [bite(2, 3)] },
  { name: "Bog Rat Swarm", level: 1, hp: 9, maxHp: 9, armor: 0, stamina: 4, maxActions: 1, memory: 1, abilities: [bite(1, 4)] },
  { name: "Bandit Cutthroat", level: 2, hp: 11, maxHp: 11, armor: 1, stamina: 5, maxActions: 2, memory: 1, abilities: [slash(3, 6)] },
  { name: "Ghoul", level: 2, hp: 13, maxHp: 13, armor: 0, stamina: 5, maxActions: 1, memory: 2, abilities: [bite(3, 5), rot(2, 4)] },
  { name: "Orc", level: 3, hp: 18, maxHp: 18, armor: 2, stamina: 6, maxActions: 2, memory: 2, abilities: [smite(4, 7)] },
  { name: "Wolf Alpha", level: 3, hp: 16, maxHp: 16, armor: 1, stamina: 7, maxActions: 2, memory: 1, abilities: [bite(3, 6)] },
  { name: "Stone Imp", level: 3, hp: 15, maxHp: 15, armor: 2, stamina: 5, maxActions: 1, memory: 2, abilities: [bolt(3, 5)] },
  { name: "Cult Acolyte", level: 3, hp: 14, maxHp: 14, armor: 1, stamina: 6, maxActions: 2, memory: 3, abilities: [bolt(3, 6), flame(2, 5)] },
  { name: "Hobgoblin Captain", level: 4, hp: 20, maxHp: 20, armor: 2, stamina: 6, maxActions: 2, memory: 2, abilities: [smite(5, 8)] },
  { name: "Wraith", level: 4, hp: 17, maxHp: 17, armor: 1, stamina: 7, maxActions: 2, memory: 3, abilities: [rot(3, 6), bolt(2, 5)] },
  { name: "Dire Boar", level: 4, hp: 24, maxHp: 24, armor: 2, stamina: 6, maxActions: 1, memory: 1, abilities: [smite(5, 9)] },
  { name: "Troll", level: 5, hp: 30, maxHp: 30, armor: 3, stamina: 7, maxActions: 2, memory: 2, abilities: [smite(6, 10)] },
  { name: "Mire Hag", level: 5, hp: 21, maxHp: 21, armor: 1, stamina: 7, maxActions: 2, memory: 4, abilities: [rot(4, 7), frost(3, 5)] },
  { name: "Ogre Brute", level: 5, hp: 32, maxHp: 32, armor: 3, stamina: 6, maxActions: 1, memory: 1, abilities: [smite(7, 11)] },
  { name: "Frost Revenant", level: 6, hp: 26, maxHp: 26, armor: 3, stamina: 7, maxActions: 2, memory: 3, abilities: [frost(4, 7)] },
  { name: "Venom Basilisk", level: 6, hp: 27, maxHp: 27, armor: 2, stamina: 8, maxActions: 2, memory: 2, abilities: [rot(5, 8)] },
  { name: "Dune Stalker", level: 6, hp: 23, maxHp: 23, armor: 2, stamina: 8, maxActions: 3, memory: 2, abilities: [slash(4, 8)] },
  { name: "Lich", level: 7, hp: 22, maxHp: 22, armor: 2, stamina: 8, maxActions: 3, memory: 4, abilities: [bolt(5, 9), frost(4, 8), flame(4, 8)] },
  { name: "Blood Knight", level: 7, hp: 31, maxHp: 31, armor: 4, stamina: 7, maxActions: 2, memory: 2, abilities: [smite(7, 12)] },
  { name: "Shadow Assassin", level: 7, hp: 24, maxHp: 24, armor: 2, stamina: 9, maxActions: 3, memory: 3, abilities: [slash(5, 9)] },
  { name: "Clockwork Sentinel", level: 8, hp: 36, maxHp: 36, armor: 5, stamina: 6, maxActions: 1, memory: 2, abilities: [smite(8, 13), bolt(5, 8)] }, 
];

try {
  await db.transaction(async (tx) => {
    await tx.delete(schema.monster);
    await tx.insert(schema.monster).values(MONSTERS);
  });
  console.info(`[seed] Re-seeded ${MONSTERS.length} monster(s).`);
} catch (error) {
  console.error("[seed] Failed to seed monsters:", error);
  process.exitCode = 1;
} finally {
  await db.$client.end();
}
