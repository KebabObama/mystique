import { Game } from "../../lib/game";

export const bite = (min: number, max: number): Game.Ability => ({
  name: "Bite",
  cost: 1,
  range: 1,
  targeting: 0,
  amount: [min, max],
  effects: Game.withEffects(),
});

export const slash = (min: number, max: number): Game.Ability => ({
  name: "Slash",
  cost: 1,
  range: 1,
  targeting: 0,
  amount: [min, max],
  effects: Game.withEffects(),
});

export const smite = (min: number, max: number): Game.Ability => ({
  name: "Smite",
  cost: 2,
  range: 1,
  targeting: 1,
  amount: [min, max],
  effects: Game.withEffects(),
});

export const bolt = (min: number, max: number): Game.Ability => ({
  name: "Bolt",
  cost: 1,
  range: 6,
  targeting: 0,
  amount: [min, max],
  effects: Game.withEffects({ shocked: 1 }),
});

export const frost = (min: number, max: number): Game.Ability => ({
  name: "Frost",
  cost: 2,
  range: 5,
  targeting: 1,
  amount: [min, max],
  effects: Game.withEffects({ frostbite: 2 }),
});

export const flame = (min: number, max: number): Game.Ability => ({
  name: "Flame",
  cost: 2,
  range: 4,
  targeting: 1,
  amount: [min, max],
  effects: Game.withEffects({ burning: 2 }),
});

export const rot = (min: number, max: number): Game.Ability => ({
  name: "Corrode",
  cost: 2,
  range: 4,
  targeting: 0,
  amount: [min, max],
  effects: Game.withEffects({ corroding: 2 }),
});

export const strike = (min: number, max: number): Game.Ability => ({
  name: "Strike",
  cost: 1,
  range: 1,
  targeting: 0,
  amount: [min, max],
  effects: Game.withEffects(),
});

export const stab = (min: number, max: number): Game.Ability => ({
  name: "Stab",
  cost: 1,
  range: 1,
  targeting: 0,
  amount: [min, max],
  effects: Game.withEffects({ corroding: 1 }),
});

export const focusBolt = (min: number, max: number): Game.Ability => ({
  name: "Focus Bolt",
  cost: 1,
  range: 4,
  targeting: 0,
  amount: [min, max],
  effects: Game.withEffects({ shocked: 1 }),
});
