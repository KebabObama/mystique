"use client";

import { toast } from "@/components/layout/toast";
import { useSocket } from "@/hooks/use-socket";
import { useUser } from "@/hooks/use-user";
import { Game } from "@/lib/game";
import { create } from "zustand";

export type GameMode =
  | { type: "normal" }
  | { type: "character:move" }
  | { type: "ability"; ability: Game.Ability }
  | { type: "wall:place" }
  | { type: "wall:destroy" }
  | { type: "chest:place" }
  | { type: "chest:move"; entityId: Game.Entity["id"] }
  | { type: "monster:place"; monsterId: string };

export type MessageData = {
  message: string;
  variant?: "default" | "success" | "error" | "warning";
};

export type GameStore = {
  instance: Game.Instance | null;
  init: () => void;
  joinInstance: (instanceId: string) => void;
  leaveInstance: () => void;
  send: (event: string, ...args: any[]) => void;
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  isEntityActive: (entity: Game.Entity) => boolean;
  isUsersEntity: (entity: Game.Entity) => boolean;
  movement: {
    moveTo: (entityId: Game.Entity["id"], position: Game.Position) => void;
    getViable: (entityId: Game.Entity["id"]) => Game.Position[];
  };
  chest: {
    addAt: (position: Game.Position) => void;
    moveTo: (entityId: Game.Entity["id"], position: Game.Position) => void;
    deleteById: (entityId: Game.Entity["id"]) => void;
  };
  monster: {
    addAt: (monsterId: string, position: Game.Position) => void;
    deleteById: (entityId: Game.Entity["id"]) => void;
  };
  inventory: {
    panelMode: "view" | "storage" | "inspect" | "master" | null;
    openedEntityId?: Game.Entity["id"];
    sourceEntityId?: Game.Entity["id"];
    openPanel: (
      mode: "view" | "storage" | "inspect" | "master",
      entityId: Game.Entity["id"],
      sourceEntityId?: Game.Entity["id"]
    ) => void;
    closePanel: () => void;
    transfer: (
      fromEntityId: Game.Entity["id"],
      toEntityId: Game.Entity["id"],
      itemId: string,
      quantity?: number
    ) => void;
    grant: (targetEntityId: Game.Entity["id"], itemId: string, quantity?: number) => void;
    dropItem: (entityId: Game.Entity["id"], itemId: string, quantity?: number) => void;
    toggleEquip: (entityId: Game.Entity["id"], itemId: string) => void;
  };
  abilities: {
    useAt: (position: Game.Position) => void;
    getViable: (entityId: Game.Entity["id"], ability: Game.Ability) => Game.Position[];
  };
  sequence: {
    next: () => void;
    readonly isMaster: boolean;
    readonly canEnd: boolean;
    readonly canControl: boolean;
    readonly current: Game.Entity | undefined;
    readonly isOnMasterTurn: boolean;
  };
};

export const useGame = create<GameStore>((set, get) => ({
  instance: null,

  init: () => {
    const socket = useSocket.getState().socket;
    if (!socket) return;

    socket.on("game:state", (instance: Game.Instance) => {
      set({ instance });
    });

    socket.on("game:message", (data: MessageData) => {
      const variant = data.variant ?? "default";
      switch (variant) {
        case "default":
          toast.show(data.message);
          break;
        case "success":
          toast.success(data.message);
          break;
        case "error":
          toast.error(data.message);
          break;
        case "warning":
          toast.warning(data.message);
          break;
      }
    });

    socket.on("disconnect", () => {
      set({ instance: null });
    });
  },

  joinInstance: (instanceId: string) => {
    const userId = useUser.getState()?.id;
    const socket = useSocket.getState().socket;
    if (!socket || !userId) return;
    set({ instance: null });
    socket.emit("game:join", userId, instanceId);
  },

  leaveInstance: () => {
    const userId = useUser.getState()?.id;
    const socket = useSocket.getState().socket;
    if (!userId || !socket) return;
    socket.send("disconnect", userId);
    set({ instance: null });
  },

  send: (event: string, ...payload: any[]) => {
    const inst = get().instance;
    const userId = useUser.getState()?.id;
    const socket = useSocket.getState().socket;
    if (!socket || !userId || !inst) return;
    socket.emit(`game:${event}`, userId, inst.id, ...payload);
    console.log(`game:${event}`, userId, inst.id, ...payload);
  },

  mode: { type: "normal" } as GameMode,
  setMode: (mode: GameMode) => set({ mode }),

  isEntityActive: (entity: Game.Entity) => {
    const instance = get().instance;
    if (!instance) return false;
    return instance.data.sequence[instance.data.turn] === entity.id;
  },

  isUsersEntity: (entity: Game.Entity) => {
    const instance = get().instance;
    const userId = useUser.getState()?.id;
    if (!instance || !userId) return false;
    const isActive = instance.data.sequence[instance.data.turn] === entity.id;
    const isCharacterOwner = entity.type === "character" && entity.playable.ownerId === userId;
    const isMasterMonster = entity.type === "monster" && instance.masterId === userId;
    return isActive && (isCharacterOwner || isMasterMonster);
  },

  movement: {
    moveTo: (entityId: Game.Entity["id"], position: Game.Position) => {
      const instance = get().instance;
      const send = get().send;
      if (!instance || !instance.entities.find((e) => e.id === entityId)) return;
      console.log("character:move", entityId, position);
      send("character:move", entityId, position);
    },
    getViable: (entityId: Game.Entity["id"]) => {
      const instance = get().instance;
      if (!instance) return [];
      const positions = instance.entities.map((e) => e.position);
      const entity = instance.entities.find((e) => e.id === entityId);
      if (!entity || !entity.position) return [];
      if (entity.type === "chest") return [];
      const { stamina } = entity.playable;
      const possible: Game.Position[] = [];
      for (let dx = -stamina; dx <= stamina; dx++) {
        for (let dz = -stamina; dz <= stamina; dz++) {
          if (Math.abs(dx) + Math.abs(dz) > stamina) continue;
          const targetX = entity.position.x + dx;
          const targetZ = entity.position.z + dz;
          const isWall = instance.data.walls.some(({ x, z }) => x === targetX && z === targetZ);
          const isOccupied = positions.some((pos) => pos.x === targetX && pos.z === targetZ);
          if (!isWall && !isOccupied) possible.push({ x: targetX, z: targetZ });
        }
      }
      return possible;
    },
  },

  chest: {
    addAt: (position: Game.Position) => get().send("chest:add", position),
    moveTo: (entityId: Game.Entity["id"], position: Game.Position) =>
      get().send("chest:move", entityId, position),
    deleteById: (entityId: Game.Entity["id"]) => get().send("chest:delete", entityId),
  },

  monster: {
    addAt: (monsterId: string, position: Game.Position) =>
      get().send("monster:add", monsterId, position),
    deleteById: (entityId: Game.Entity["id"]) => get().send("monster:delete", entityId),
  },

  inventory: {
    panelMode: null,
    openedEntityId: undefined,
    sourceEntityId: undefined,
    openPanel: (panelMode, openedEntityId, sourceEntityId) =>
      set({ inventory: { ...get().inventory, panelMode, openedEntityId, sourceEntityId } }),
    closePanel: () =>
      set({
        inventory: {
          ...get().inventory,
          panelMode: null,
          openedEntityId: undefined,
          sourceEntityId: undefined,
        },
      }),
    transfer: (fromEntityId, toEntityId, itemId, quantity = 1) =>
      get().send("inventory:transfer", fromEntityId, toEntityId, itemId, quantity),
    grant: (targetEntityId, itemId, quantity = 1) =>
      get().send("inventory:grant", targetEntityId, itemId, quantity),
    dropItem: (entityId, itemId, quantity = 1) =>
      get().send("inventory:drop", entityId, itemId, quantity),
    toggleEquip: (entityId, itemId) => get().send("inventory:equip", entityId, itemId),
  },

  abilities: {
    useAt: (position: Game.Position) => {
      const instance = get().instance;
      const current = get().sequence.current;
      const mode = get().mode;
      const send = get().send;

      if (!instance || !current || mode.type !== "ability") return;
      const ability = mode.ability;

      if (current.type === "chest") return;
      const actions = current.actions ?? current.playable.maxActions ?? 0;
      if (actions < ability.cost) {
        toast.error("Not enough actions.");
        return;
      }

      const viable = get().abilities.getViable(current.id, ability);
      const canUse = viable.some((target) => target.x === position.x && target.z === position.z);
      if (!canUse) {
        toast.error("Target is out of range.");
        return;
      }

      send("ability:use", ability.name, position);
      set({ mode: { type: "normal" } });
    },
    getViable: (entityId: Game.Entity["id"], ability: Game.Ability) => {
      const instance = get().instance;
      if (!instance) return [];

      const entity = instance.entities.find((entry) => entry.id === entityId);
      if (!entity) return [];

      const maxRange = Math.max(0, ability.range);
      const possible: Game.Position[] = [];

      for (let dx = -maxRange; dx <= maxRange; dx++) {
        for (let dz = -maxRange; dz <= maxRange; dz++) {
          if (Math.abs(dx) + Math.abs(dz) > maxRange) continue;
          const target = { x: entity.position.x + dx, z: entity.position.z + dz };

          const impactTiles =
            ability.targeting <= 0
              ? [target]
              : Array.from({ length: ability.targeting * 2 + 1 }).flatMap((_, txIndex) => {
                  const tx = txIndex - ability.targeting;
                  return Array.from({ length: ability.targeting * 2 + 1 }).flatMap(
                    (__, tzIndex) => {
                      const tz = tzIndex - ability.targeting;
                      if (Math.abs(tx) + Math.abs(tz) > ability.targeting) return [];
                      return [{ x: target.x + tx, z: target.z + tz }];
                    }
                  );
                });

          const canHitEntity =
            ability.targeting < 0
              ? instance.entities.some((targetEntity) => {
                  const dist =
                    Math.abs(targetEntity.position.x - target.x) +
                    Math.abs(targetEntity.position.z - target.z);
                  return dist <= Math.abs(ability.targeting);
                })
              : instance.entities.some((targetEntity) =>
                  impactTiles.some(
                    (tile) =>
                      tile.x === targetEntity.position.x && tile.z === targetEntity.position.z
                  )
                );

          if (canHitEntity) possible.push(target);
        }
      }

      return possible;
    },
  },

  sequence: {
    get isMaster() {
      const userId = useUser.getState()?.id;
      const instance = get().instance;
      if (!userId || !instance) return false;
      return instance.masterId === userId;
    },
    get canEnd() {
      const userId = useUser.getState()?.id;
      const instance = get().instance;
      if (!userId || !instance) return false;
      if (instance.data.turn === -1) return userId === instance.masterId;
      const current = get().sequence.current;
      if (!current) return false;
      if (current.type === "character") return current.playable.ownerId === userId;
      if (current.type === "monster") return instance.masterId === userId;
      return false;
    },
    next: () => {
      const send = get().send;
      const canEnd = get().sequence.canEnd;
      if (canEnd) send("sequence:next");
      else toast.error("Cannot end turn.");
    },
    get canControl() {
      const userId = useUser.getState()?.id;
      const instance = get().instance;
      const current = get().sequence.current;
      if (!userId || !instance || !current) return false;
      if (current.type === "chest") return false;
      return (
        (current.type === "character" && current.playable.ownerId === userId) ||
        (current.type === "monster" && instance.masterId === userId)
      );
    },
    get current() {
      const instance = get().instance;
      if (!instance) return undefined;
      return instance.entities.find((e) => e.id === instance.data.sequence[instance.data.turn]);
    },
    get isOnMasterTurn() {
      const instance = get().instance;
      if (!instance) return false;
      return get().sequence.isMaster && instance.data.turn === -1;
    },
  },
}));
