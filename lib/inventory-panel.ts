import { Game } from "@/lib/game";
import { Render } from "@/lib/render";

export type InventoryItem = { id: string; name: string };
export type ListEntry = { item: InventoryItem; quantity: number };
export type Permissions = { canView: boolean; canEdit: boolean; canTransfer: boolean };
export const NO_PERMISSIONS: Permissions = { canView: false, canEdit: false, canTransfer: false };

export const getEntries = (entity: Game.Entity): ListEntry[] => {
  if (entity.type === "monster" || entity.type === "campfire") return [];

  return entity.playable.inventory
    .map((entry): ListEntry => ({ item: entry.item, quantity: entry.quantity }))
    .sort((a: ListEntry, b: ListEntry) => a.item.name.localeCompare(b.item.name));
};

export const getEntityLabel = (entity: Game.Entity) => {
  if (entity.type === "chest") return entity.playable.name || "Chest";
  return entity.playable.name;
};

export const getInventoryDescription = (permissions: Permissions) => {
  if (permissions.canEdit) return "Manage inventory items";
  if (permissions.canTransfer) return "View and transfer items";
  return "View only";
};

export const getManhattanDistance = (a: Game.Position, b: Game.Position) =>
  Render.distance(a, b, "manhattan");

export const getEntityInventory = (entity: Game.Entity) => {
  if (entity.type === "monster" || entity.type === "campfire") return [];
  return entity.playable.inventory;
};

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

  const isOwner = entity.playable.ownerId === userId;
  return {
    canView: true,
    canEdit: canUseMasterPermissions && isOnTurn,
    canTransfer: isOwner || canUseMasterPermissions,
  };
};
