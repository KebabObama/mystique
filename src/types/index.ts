// Export all types from the consolidated types folder

// Game types
export type {
  Campfire,
  CampfireEntity,
  Character,
  CharacterEntity,
  Chest,
  ChestEntity,
  CombatEntity,
  Entity,
  GameAbility,
  GameAttribute,
  GameData,
  GameEffect,
  GameItemType,
  GameRace,
  Instance,
  Monster,
  MonsterEntity,
  Position,
} from "./game";

export type * as Game from "./game";

// Lobby types
export type { Brand, Lobby, SocketAuth } from "./lobby";

// Bucket types
export type { BucketNames } from "./bucket";

// Render types
export type { RenderDistanceType, RenderPointerType } from "./render";
