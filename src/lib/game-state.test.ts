import assert from "node:assert/strict";
import test from "node:test";
import { applyStateSync, diffStateSync } from "./game-state";
import type { Game } from "./types";

const createInstance = (overrides: Partial<Game.Instance> = {}): Game.Instance =>
  ({
    id: "lobby-1",
    masterId: "user-1",
    data: { walls: [], sequence: [], turn: -1 },
    members: [],
    characters: [],
    monsters: [],
    chests: [],
    campfires: [],
    ...overrides,
  }) as Game.Instance;

const createCharacter = (
  id: string,
  overrides: Partial<Game.CharacterEntity> = {}
): Game.CharacterEntity =>
  ({
    id,
    type: "character",
    name: id,
    position: { x: 0, z: 0 },
    hp: 10,
    maxHp: 10,
    stamina: 3,
    actions: 1,
    maxActions: 1,
    ownerId: "user-1",
    inventory: [],
    ...overrides,
  }) as Game.CharacterEntity;

test("diffStateSync returns a full snapshot for first sync", () => {
  const next = createInstance();
  const sync = diffStateSync(null, next);

  assert.deepEqual(sync, { type: "full", instance: next });
});

test("diffStateSync emits only changed entities and removals", () => {
  const previous = createInstance({
    characters: [createCharacter("a"), createCharacter("b")],
    chests: [{ id: "chest-1", type: "chest" } as Game.ChestEntity],
  });
  const next = createInstance({
    characters: [createCharacter("a", { hp: 7 }), createCharacter("c")],
    chests: [],
  });

  const sync = diffStateSync(previous, next);

  assert.deepEqual(sync, {
    type: "patch",
    patch: {
      characters: {
        upsert: [createCharacter("a", { hp: 7 }), createCharacter("c")],
        remove: ["b"],
      },
      chests: { remove: ["chest-1"] },
    },
  });
});

test("applyStateSync merges partial data and entity patches", () => {
  const current = createInstance({
    data: { walls: [], sequence: ["a", "b"] as Game.Data["sequence"], turn: 0 },
    characters: [createCharacter("a"), createCharacter("b")],
  });

  const next = applyStateSync(current, {
    type: "patch",
    patch: {
      data: { turn: 1 },
      characters: {
        upsert: [createCharacter("a", { hp: 5 }), createCharacter("c")],
        remove: ["b"],
      },
    },
  });

  assert.deepEqual(next?.data, { walls: [], sequence: ["a", "b"], turn: 1 });
  assert.deepEqual(next?.characters, [createCharacter("a", { hp: 5 }), createCharacter("c")]);
});
