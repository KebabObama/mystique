import { Game, InGameHelpers } from "../seed";

// Physical Melee
export const bite = (min: number, max: number): Game.Ability => ({
  name: "Bite",
  cost: 1,
  range: 1,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const slash = (min: number, max: number): Game.Ability => ({
  name: "Slash",
  cost: 1,
  range: 1,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const smite = (min: number, max: number): Game.Ability => ({
  name: "Smite",
  cost: 2,
  range: 1,
  targeting: 1,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const bolt = (min: number, max: number): Game.Ability => ({
  name: "Bolt",
  cost: 1,
  range: 6,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ shocked: 1 }),
});

export const frost = (min: number, max: number): Game.Ability => ({
  name: "Frost",
  cost: 2,
  range: 5,
  targeting: 1,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ frostbite: 2 }),
});

export const flame = (min: number, max: number): Game.Ability => ({
  name: "Flame",
  cost: 2,
  range: 4,
  targeting: 1,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ burning: 2 }),
});

export const rot = (min: number, max: number): Game.Ability => ({
  name: "Corrode",
  cost: 2,
  range: 4,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ corroding: 2 }),
});

export const strike = (min: number, max: number): Game.Ability => ({
  name: "Strike",
  cost: 1,
  range: 1,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const stab = (min: number, max: number): Game.Ability => ({
  name: "Stab",
  cost: 1,
  range: 1,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ corroding: 1 }),
});

export const focusBolt = (min: number, max: number): Game.Ability => ({
  name: "Focus Bolt",
  cost: 1,
  range: 4,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ shocked: 1 }),
});

// Additional Physical Melee
export const cleave = (min: number, max: number): Game.Ability => ({
  name: "Cleave",
  cost: 2,
  range: 1,
  targeting: -2,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const whirlwind = (min: number, max: number): Game.Ability => ({
  name: "Whirlwind",
  cost: 3,
  range: 2,
  targeting: -3,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const pierce = (min: number, max: number): Game.Ability => ({
  name: "Pierce",
  cost: 1,
  range: 1,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const crush = (min: number, max: number): Game.Ability => ({
  name: "Crush",
  cost: 2,
  range: 1,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const pummel = (min: number, max: number): Game.Ability => ({
  name: "Pummel",
  cost: 2,
  range: 1,
  targeting: -2,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const impale = (min: number, max: number): Game.Ability => ({
  name: "Impale",
  cost: 3,
  range: 1,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const swipe = (min: number, max: number): Game.Ability => ({
  name: "Swipe",
  cost: 1,
  range: 1,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const hack = (min: number, max: number): Game.Ability => ({
  name: "Hack",
  cost: 1,
  range: 1,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const rend = (min: number, max: number): Game.Ability => ({
  name: "Rend",
  cost: 2,
  range: 1,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ corroding: 1 }),
});

// Ranged Physical
export const arrow = (min: number, max: number): Game.Ability => ({
  name: "Arrow Shot",
  cost: 1,
  range: 6,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const volley = (min: number, max: number): Game.Ability => ({
  name: "Volley",
  cost: 2,
  range: 5,
  targeting: -3,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const pierceShot = (min: number, max: number): Game.Ability => ({
  name: "Pierce Shot",
  cost: 2,
  range: 7,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const multishot = (min: number, max: number): Game.Ability => ({
  name: "Multishot",
  cost: 3,
  range: 6,
  targeting: -4,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const snipe = (min: number, max: number): Game.Ability => ({
  name: "Snipe",
  cost: 2,
  range: 8,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

// Elemental - Fire
export const fireball = (min: number, max: number): Game.Ability => ({
  name: "Fireball",
  cost: 3,
  range: 5,
  targeting: 2,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ burning: 2 }),
});

export const inferno = (min: number, max: number): Game.Ability => ({
  name: "Inferno",
  cost: 4,
  range: 4,
  targeting: 3,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ burning: 3 }),
});

export const burn = (min: number, max: number): Game.Ability => ({
  name: "Burn",
  cost: 1,
  range: 3,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ burning: 1 }),
});

export const scorch = (min: number, max: number): Game.Ability => ({
  name: "Scorch",
  cost: 2,
  range: 4,
  targeting: 1,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ burning: 2 }),
});

// Elemental - Ice
export const blizzard = (min: number, max: number): Game.Ability => ({
  name: "Blizzard",
  cost: 4,
  range: 6,
  targeting: 2,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ frostbite: 3 }),
});

export const icicle = (min: number, max: number): Game.Ability => ({
  name: "Icicle",
  cost: 2,
  range: 5,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ frostbite: 1 }),
});

export const freeze = (min: number, max: number): Game.Ability => ({
  name: "Freeze",
  cost: 2,
  range: 4,
  targeting: 1,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ frostbite: 2 }),
});

export const snowstorm = (min: number, max: number): Game.Ability => ({
  name: "Snowstorm",
  cost: 3,
  range: 5,
  targeting: -2,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ frostbite: 2 }),
});

// Elemental - Lightning
export const lightning = (min: number, max: number): Game.Ability => ({
  name: "Lightning",
  cost: 2,
  range: 6,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ shocked: 2 }),
});

export const chainLightning = (min: number, max: number): Game.Ability => ({
  name: "Chain Lightning",
  cost: 3,
  range: 5,
  targeting: -2,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ shocked: 1 }),
});

export const shock = (min: number, max: number): Game.Ability => ({
  name: "Shock",
  cost: 1,
  range: 4,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ shocked: 1 }),
});

export const thunder = (min: number, max: number): Game.Ability => ({
  name: "Thunder",
  cost: 2,
  range: 5,
  targeting: 1,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ shocked: 2 }),
});

// Elemental - Toxic
export const poison = (min: number, max: number): Game.Ability => ({
  name: "Poison",
  cost: 2,
  range: 4,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ corroding: 1 }),
});

export const venom = (min: number, max: number): Game.Ability => ({
  name: "Venom",
  cost: 3,
  range: 4,
  targeting: 1,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ corroding: 2 }),
});

export const toxicCloud = (min: number, max: number): Game.Ability => ({
  name: "Toxic Cloud",
  cost: 3,
  range: 5,
  targeting: 2,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ corroding: 2 }),
});

export const acidBolt = (min: number, max: number): Game.Ability => ({
  name: "Acid Bolt",
  cost: 1,
  range: 5,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ corroding: 1 }),
});

// Support - Healing
export const heal = (min: number, max: number): Game.Ability => ({
  name: "Heal",
  cost: 2,
  range: 4,
  targeting: 0,
  amount: [-min, -max],
  effects: InGameHelpers.withEffects(),
});

export const greaterHeal = (min: number, max: number): Game.Ability => ({
  name: "Greater Heal",
  cost: 3,
  range: 5,
  targeting: 0,
  amount: [-min, -max],
  effects: InGameHelpers.withEffects(),
});

export const regenerate = (min: number, max: number): Game.Ability => ({
  name: "Regenerate",
  cost: 3,
  range: 6,
  targeting: 0,
  amount: [-min, -max],
  effects: InGameHelpers.withEffects(),
});

export const blessing = (min: number, max: number): Game.Ability => ({
  name: "Blessing",
  cost: 2,
  range: 5,
  targeting: -1,
  amount: [-min, -max],
  effects: InGameHelpers.withEffects(),
});

// Support - Buffs & Utility
export const protect = (min: number, max: number): Game.Ability => ({
  name: "Protect",
  cost: 2,
  range: 5,
  targeting: 0,
  amount: [0, 0],
  effects: InGameHelpers.withEffects(),
});

export const haste = (min: number, max: number): Game.Ability => ({
  name: "Haste",
  cost: 2,
  range: 4,
  targeting: 0,
  amount: [0, 0],
  effects: InGameHelpers.withEffects(),
});

export const fortify = (min: number, max: number): Game.Ability => ({
  name: "Fortify",
  cost: 3,
  range: 5,
  targeting: 0,
  amount: [0, 0],
  effects: InGameHelpers.withEffects(),
});

export const cloak = (min: number, max: number): Game.Ability => ({
  name: "Cloak",
  cost: 2,
  range: 0,
  targeting: 0,
  amount: [0, 0],
  effects: InGameHelpers.withEffects(),
});

// Counter & Defensive
export const riposte = (min: number, max: number): Game.Ability => ({
  name: "Riposte",
  cost: 1,
  range: 1,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const parry = (min: number, max: number): Game.Ability => ({
  name: "Parry",
  cost: 1,
  range: 0,
  targeting: 0,
  amount: [0, 0],
  effects: InGameHelpers.withEffects(),
});

export const reflect = (min: number, max: number): Game.Ability => ({
  name: "Reflect",
  cost: 2,
  range: 0,
  targeting: 0,
  amount: [0, 0],
  effects: InGameHelpers.withEffects(),
});

export const dodge = (min: number, max: number): Game.Ability => ({
  name: "Dodge",
  cost: 1,
  range: 0,
  targeting: 0,
  amount: [0, 0],
  effects: InGameHelpers.withEffects(),
});

// Crowd Control & Debuffs
export const stun = (min: number, max: number): Game.Ability => ({
  name: "Stun",
  cost: 2,
  range: 3,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const knockback = (min: number, max: number): Game.Ability => ({
  name: "Knockback",
  cost: 2,
  range: 2,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

export const silence = (min: number, max: number): Game.Ability => ({
  name: "Silence",
  cost: 2,
  range: 4,
  targeting: 0,
  amount: [min, max],
  effects: InGameHelpers.withEffects(),
});

// Ultimate/High Cost
export const meteor = (min: number, max: number): Game.Ability => ({
  name: "Meteor",
  cost: 5,
  range: 6,
  targeting: 3,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ burning: 3 }),
});

export const apocalypse = (min: number, max: number): Game.Ability => ({
  name: "Apocalypse",
  cost: 5,
  range: 7,
  targeting: 4,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ burning: 2, shocked: 2, frostbite: 2 }),
});

export const tsunami = (min: number, max: number): Game.Ability => ({
  name: "Tsunami",
  cost: 5,
  range: 5,
  targeting: 3,
  amount: [min, max],
  effects: InGameHelpers.withEffects({ frostbite: 3, corroding: 1 }),
});
