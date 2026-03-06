// Export all types from the consolidated types folder

// Game types
export type {
  Ability,
  Attribute,
  Campfire,
  CampfireEntity,
  Character,
  CharacterEntity,
  Chest,
  ChestEntity,
  CombatEntity,
  Data,
  Effect,
  Entity,
  Instance,
  ItemType,
  Monster,
  MonsterEntity,
  Position,
  Race,
} from "./game";

export * as Game from "./game";

// Lobby types
export type { Brand, Lobby, SocketAuth } from "./lobby";

// Render types
export type { RenderDistanceType, RenderPointerType } from "./render";
