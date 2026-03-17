import { Game } from "@/lib/types";

const isEqual = (left: unknown, right: unknown) => JSON.stringify(left) === JSON.stringify(right);

const getDataPatch = (previous: Game.Data, next: Game.Data): Partial<Game.Data> | undefined => {
  const patch: Partial<Game.Data> = {};

  if (!isEqual(previous.walls, next.walls)) patch.walls = next.walls;
  if (!isEqual(previous.sequence, next.sequence)) patch.sequence = next.sequence;
  if (previous.turn !== next.turn) patch.turn = next.turn;

  return Object.keys(patch).length > 0 ? patch : undefined;
};

const getEntityPatch = <T extends { id: string }>(
  previous: T[],
  next: T[]
): Game.EntityPatch<T> | undefined => {
  const previousById = new Map(previous.map((entity) => [entity.id, entity]));
  const nextById = new Map(next.map((entity) => [entity.id, entity]));
  const upsert = next.filter((entity) => !isEqual(previousById.get(entity.id), entity));
  const remove = previous.filter((entity) => !nextById.has(entity.id)).map((entity) => entity.id);

  if (upsert.length === 0 && remove.length === 0) return undefined;

  return { ...(upsert.length > 0 ? { upsert } : {}), ...(remove.length > 0 ? { remove } : {}) };
};

const applyEntityPatch = <T extends { id: string }>(current: T[], patch?: Game.EntityPatch<T>) => {
  if (!patch) return current;

  const removedIds = new Set(patch.remove ?? []);
  const upsertById = new Map((patch.upsert ?? []).map((entity) => [entity.id, entity]));

  const next = current
    .filter((entity) => !removedIds.has(entity.id))
    .map((entity) => upsertById.get(entity.id) ?? entity);

  for (const entity of patch.upsert ?? []) {
    if (!current.some((currentEntity) => currentEntity.id === entity.id)) next.push(entity);
  }

  return next;
};

export const diffStateSync = (
  previous: Game.Instance | null | undefined,
  next: Game.Instance
): Game.StateSync | null => {
  if (!previous) return { type: "full", instance: next };

  const patch: Game.StatePatch = {};
  const data = getDataPatch(previous.data, next.data);
  const characters = getEntityPatch(previous.characters, next.characters);
  const monsters = getEntityPatch(previous.monsters, next.monsters);
  const chests = getEntityPatch(previous.chests, next.chests);
  const campfires = getEntityPatch(previous.campfires, next.campfires);

  if (data) patch.data = data;
  if (!isEqual(previous.members, next.members)) patch.members = next.members;
  if (characters) patch.characters = characters;
  if (monsters) patch.monsters = monsters;
  if (chests) patch.chests = chests;
  if (campfires) patch.campfires = campfires;

  return Object.keys(patch).length > 0 ? { type: "patch", patch } : null;
};

export const applyStateSync = (
  current: Game.Instance | null,
  sync: Game.StateSync
): Game.Instance | null => {
  if (sync.type === "full") return sync.instance;
  if (!current) return current;

  const { patch } = sync;

  return {
    ...current,
    data: patch.data ? { ...current.data, ...patch.data } : current.data,
    members: patch.members ?? current.members,
    characters: applyEntityPatch(current.characters, patch.characters),
    monsters: applyEntityPatch(current.monsters, patch.monsters),
    chests: applyEntityPatch(current.chests, patch.chests),
    campfires: applyEntityPatch(current.campfires, patch.campfires),
  };
};
