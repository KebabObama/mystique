import { Game } from "@/lib/game";
import { Render } from "@/lib/render";

/** Represents the inventory item type. */
export type InventoryItem = { id: string; name: string };
/** Represents the list entry type. */
export type ListEntry = { item: InventoryItem; quantity: number };
/** Represents the permissions type. */
export type Permissions = { canView: boolean; canEdit: boolean; canTransfer: boolean };
/** Defines the no permissions constant. */
export const NO_PERMISSIONS: Permissions = { canView: false, canEdit: false, canTransfer: false };

/** Defines the get entries constant. */
export const getEntries = (entity: Game.Entity): ListEntry[] => {
  if (entity.type === "monster" || entity.type === "campfire") return [];

  return entity.inventory
    .map(
      (entry): ListEntry => ({ item: { id: entry.id, name: entry.name }, quantity: entry.quantity })
    )
    .sort((a: ListEntry, b: ListEntry) => a.item.name.localeCompare(b.item.name));
};

/** Provides the get entity label function. */
export const getEntityLabel = (entity: Game.Entity) => {
  if (entity.type === "chest") return entity.name || "Chest";
  if (entity.type === "campfire") return "Campfire";
  return entity.name;
};

/** Provides the get inventory description function. */
export const getInventoryDescription = (permissions: Permissions) => {
  if (permissions.canEdit) return "Manage inventory items";
  if (permissions.canTransfer) return "View and transfer items";
  return "View only";
};

/** Provides the get manhattan distance function. */
export const getManhattanDistance = (a: Game.Position, b: Game.Position) =>
  Render.distance(a, b, "manhattan");

/** Provides the get entity inventory function. */
export const getEntityInventory = (entity: Game.Entity) => {
  if (entity.type === "monster" || entity.type === "campfire") return [];
  return entity.inventory;
};

/** Defines the get permissions constant. */
export const getPermissions = (
  entity: Game.Entity,
  userId: string,
  canUseMasterPermissions: boolean,
  isOnTurn: boolean
): Permissions => {
  if (entity.type === "monster") {
    return { canView: false, canEdit: false, canTransfer: false };
  }

  if (entity.type === "campfire") {
    return { canView: false, canEdit: false, canTransfer: false };
  }

  if (entity.type === "chest") {
    return { canView: true, canEdit: canUseMasterPermissions, canTransfer: true };
  }

  const isOwner = entity.ownerId === userId;
  return {
    canView: true,
    canEdit: canUseMasterPermissions && isOnTurn,
    canTransfer: isOwner || canUseMasterPermissions,
  };
};
