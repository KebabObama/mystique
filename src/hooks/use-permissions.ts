"use client";

import { useUser } from "@/hooks/use-user";
import { Game } from "@/lib/game";
import { InGameHelpers } from "@/lib/ingame-helpers";
import { create } from "zustand";

type PermissionsStore = {
  instance: Game.Instance | null;
  userId?: string;
  currentEntityId?: Game.Entity["id"];
  isMaster: boolean;
  isMasterOnTurn: boolean;
  canEndTurn: boolean;
  canControlCurrent: boolean;
  update: (instance?: Game.Instance | null) => void;
  isEntityActive: (entity: Game.Entity) => boolean;
  isOwner: (entity: Game.Entity) => boolean;
  canControlEntity: (entity: Game.Entity) => boolean;
  isUsersEntity: (entity: Game.Entity) => boolean;
};

const getCurrentEntity = (instance: Game.Instance | null) => {
  if (!instance) return undefined;
  if (instance.data.turn < 0) return undefined;
  return InGameHelpers.getEntityById(instance, instance.data.sequence[instance.data.turn]);
};

/** Provides the Zustand store for permissions. */
export const usePermissions = create<PermissionsStore>((set, get) => ({
  instance: null,
  userId: undefined,
  currentEntityId: undefined,
  isMaster: false,
  isMasterOnTurn: false,
  canEndTurn: false,
  canControlCurrent: false,

  update: (instanceArg) => {
    const instance = instanceArg === undefined ? get().instance : instanceArg;
    const userId = useUser.getState()?.id;
    const current = getCurrentEntity(instance);
    const isMaster = Boolean(userId && instance && instance.masterId === userId);
    const isMasterOnTurn = Boolean(isMaster && instance?.data.turn === -1);

    let canEndTurn = false;
    if (userId && instance) {
      if (instance.data.turn === -1) {
        canEndTurn = isMaster;
      } else if (current?.type === "character") {
        canEndTurn = current.ownerId === userId;
      } else if (current?.type === "monster") {
        canEndTurn = isMaster;
      }
    }

    const canControlCurrent = Boolean(
      userId &&
      current &&
      ((current.type === "character" && current.ownerId === userId) ||
        (current.type === "monster" && isMaster))
    );

    set({
      instance,
      userId,
      currentEntityId: current?.id,
      isMaster,
      isMasterOnTurn,
      canEndTurn,
      canControlCurrent,
    });
  },

  isEntityActive: (entity) => get().currentEntityId === entity.id,

  isOwner: (entity) => {
    const userId = get().userId;
    if (!userId) return false;
    return entity.type === "character" && entity.ownerId === userId;
  },

  canControlEntity: (entity) => {
    const userId = get().userId;
    const isMaster = get().isMaster;
    if (!userId) return false;
    if (entity.type === "character") return entity.ownerId === userId;
    if (entity.type === "monster") return isMaster;
    return false;
  },

  isUsersEntity: (entity) => {
    return get().isEntityActive(entity) && get().canControlEntity(entity);
  },
}));
