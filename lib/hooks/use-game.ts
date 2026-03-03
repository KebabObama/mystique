"use client";

import { toast } from "@/components/layout/toast";
import { Game } from "@/lib/game";
import { useDialog } from "@/lib/hooks/use-dialog";
import { usePermissions } from "@/lib/hooks/use-permissions";
import { useSocket } from "@/lib/hooks/use-socket";
import { useUser } from "@/lib/hooks/use-user";
import { create } from "zustand";

export type GameMode =
  | { type: "normal" }
  | { type: "character:move" }
  | { type: "ability"; ability: Game.Ability; target?: Game.Position }
  | { type: "wall:place" }
  | { type: "wall:destroy" }
  | { type: "wall:place-area"; start?: Game.Position }
  | { type: "wall:destroy-area"; start?: Game.Position }
  | { type: "chest:place" }
  | { type: "chest:move"; entityId: Game.Entity["id"] }
  | { type: "campfire:place" }
  | { type: "campfire:move"; entityId: Game.Entity["id"] }
  | { type: "monster:place"; monsterId: string };

export type MessageData = {
  message: string;
  variant?: "default" | "success" | "error" | "warning";
};

export type TradeOffer = { items: Array<{ itemId: string; quantity: number }>; currency: number };

export type TradeSession = {
  id: string;
  lobbyId: string;
  entityAId: Game.Entity["id"];
  entityBId: Game.Entity["id"];
  offers: Record<string, TradeOffer>;
  confirmed: Record<string, boolean>;
  updatedAt: number;
};

export type GameStore = {
  instance: Game.Instance | null;
  init: () => void;
  joinInstance: (instanceId: string) => void;
  leaveInstance: () => void;
  send: (event: string, ...args: any[]) => void;
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  movement: {
    moveTo: (entityId: Game.Entity["id"], position: Game.Position) => void;
    getViable: (entityId: Game.Entity["id"]) => Game.Position[];
  };
  chest: {
    addAt: (position: Game.Position) => void;
    moveTo: (entityId: Game.Entity["id"], position: Game.Position) => void;
    deleteById: (entityId: Game.Entity["id"]) => void;
  };
  campfire: {
    addAt: (position: Game.Position) => void;
    moveTo: (entityId: Game.Entity["id"], position: Game.Position) => void;
    deleteById: (entityId: Game.Entity["id"]) => void;
  };
  monster: {
    addAt: (monsterId: string, position: Game.Position) => void;
    deleteById: (entityId: Game.Entity["id"]) => void;
  };
  wall: {
    addAt: (position: Game.Position) => void;
    deleteAt: (position: Game.Position) => void;
    addArea: (start: Game.Position, end: Game.Position) => void;
    deleteArea: (start: Game.Position, end: Game.Position) => void;
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
  trading: {
    startTrade: (
      toEntityId: Game.Entity["id"],
      items: Array<{ itemId: string; quantity: number }>,
      currency: number
    ) => void;
    updateOffer: (sessionId: string, actorEntityId: Game.Entity["id"], offer: TradeOffer) => void;
    setConfirmed: (sessionId: string, actorEntityId: Game.Entity["id"], ready: boolean) => void;
    cancelTrade: (sessionId: string) => void;
  };
  leveling: {
    levelUp: (characterId: string, attributePoints: Record<Game.Attribute, number>) => void;
  };
  abilities: {
    useAt: (position: Game.Position) => void;
    getViable: (entityId: Game.Entity["id"], ability: Game.Ability) => Game.Position[];
  };
  sequence: { next: () => void; readonly current: Game.Entity | undefined };
};

export const useGame = create<GameStore>((set, get) => ({
  instance: null,

  init: () => {
    const socket = useSocket.getState().socket;
    if (!socket) return;

    socket.on("game:state", (instance: Game.Instance) => {
      set({ instance });
      usePermissions.getState().update(instance);
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
      useDialog.getState().reset();
      usePermissions.getState().update(null);
    });

    socket.on("game:trade:session", (session: TradeSession) => {
      const selectedCharacterId = useDialog.getState().trading.selectedCharacterId;
      if (
        selectedCharacterId &&
        session.entityAId !== selectedCharacterId &&
        session.entityBId !== selectedCharacterId
      ) {
        return;
      }

      useDialog.getState().trading.setActiveSession(session);
    });

    socket.on("game:trade:session:closed", ({ sessionId }: { sessionId: string }) => {
      const current = useDialog.getState().trading.activeSession;
      if (!current || current.id !== sessionId) return;

      useDialog.getState().trading.clearActiveSession(sessionId);
    });
  },

  joinInstance: (instanceId: string) => {
    const userId = useUser.getState()?.id;
    const socket = useSocket.getState().socket;
    if (!socket || !userId) return;
    set({ instance: null });
    usePermissions.getState().update(null);
    socket.emit("game:join", userId, instanceId);
  },

  leaveInstance: () => {
    const userId = useUser.getState()?.id;
    const socket = useSocket.getState().socket;
    const instance = get().instance;
    if (!userId || !socket || !instance) return;
    socket.emit("game:leave", userId, instance.id);
    set({ instance: null });
    usePermissions.getState().update(null);
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

  movement: {
    moveTo: (entityId: Game.Entity["id"], position: Game.Position) => {
      const instance = get().instance;
      const send = get().send;
      if (!instance || !Game.getEntityById(instance, entityId)) return;
      console.log("character:move", entityId, position);
      send("character:move", entityId, position);
    },
    getViable: (entityId: Game.Entity["id"]) => {
      const instance = get().instance;
      if (!instance) return [];

      const entity = Game.getEntityById(instance, entityId);
      if (!entity || !entity.position) return [];
      if (entity.type === "chest" || entity.type === "campfire") return [];

      const { stamina } = entity.playable;
      if (stamina <= 0) return [];

      const wallSet = new Set(instance.data.walls.map(({ x, z }) => `${x}:${z}`));
      const allEntities = Game.getEntities(instance);
      const occupiedSet = new Set(
        allEntities
          .filter((entry) => entry.id !== entityId)
          .map((entry) => `${entry.position.x}:${entry.position.z}`)
      );

      const start = entity.position;
      const startKey = `${start.x}:${start.z}`;
      const queue: Array<{ pos: Game.Position; dist: number }> = [{ pos: start, dist: 0 }];
      const visited = new Set<string>([startKey]);
      const possible: Game.Position[] = [];

      while (queue.length > 0) {
        const current = queue.shift();
        if (!current) continue;

        if (current.dist >= stamina) continue;

        const neighbors: Game.Position[] = [
          { x: current.pos.x + 1, z: current.pos.z },
          { x: current.pos.x - 1, z: current.pos.z },
          { x: current.pos.x, z: current.pos.z + 1 },
          { x: current.pos.x, z: current.pos.z - 1 },
        ];

        for (const next of neighbors) {
          const key = `${next.x}:${next.z}`;
          if (visited.has(key)) continue;
          if (wallSet.has(key)) continue;
          if (occupiedSet.has(key)) continue;

          visited.add(key);
          possible.push(next);
          queue.push({ pos: next, dist: current.dist + 1 });
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

  campfire: {
    addAt: (position: Game.Position) => get().send("campfire:add", position),
    moveTo: (entityId: Game.Entity["id"], position: Game.Position) =>
      get().send("campfire:move", entityId, position),
    deleteById: (entityId: Game.Entity["id"]) => get().send("campfire:delete", entityId),
  },

  monster: {
    addAt: (monsterId: string, position: Game.Position) =>
      get().send("monster:add", monsterId, position),
    deleteById: (entityId: Game.Entity["id"]) => get().send("monster:delete", entityId),
  },

  wall: {
    addAt: (position: Game.Position) => get().send("wall:add", position),
    deleteAt: (position: Game.Position) => get().send("wall:delete", position),
    addArea: (start: Game.Position, end: Game.Position) => get().send("wall:add-area", start, end),
    deleteArea: (start: Game.Position, end: Game.Position) =>
      get().send("wall:delete-area", start, end),
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

  trading: {
    startTrade: (toEntityId, items, currency) => {
      const fromEntityId = useDialog.getState().trading.selectedCharacterId;
      if (!fromEntityId) return;
      get().send("trade:request", fromEntityId, toEntityId, { items, currency });
    },
    updateOffer: (sessionId, actorEntityId, offer) =>
      get().send("trade:update", sessionId, actorEntityId, offer),
    setConfirmed: (sessionId, actorEntityId, ready) =>
      get().send("trade:confirm", sessionId, actorEntityId, ready),
    cancelTrade: (sessionId) => get().send("trade:cancel", sessionId),
  },

  leveling: {
    levelUp: (characterId, attributePoints) =>
      get().send("character:levelup", characterId, attributePoints),
  },

  abilities: {
    useAt: (position: Game.Position) => {
      const instance = get().instance;
      const current = get().sequence.current;
      const mode = get().mode;
      const send = get().send;

      if (!instance || !current || mode.type !== "ability") return;
      const ability = mode.ability;

      if (current.type === "chest" || current.type === "campfire") return;
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

      const entity = Game.getEntityById(instance, entityId);
      if (!entity) return [];

      return Game.getAbilityViableTargets(entity, ability, Game.getEntities(instance));
    },
  },

  sequence: {
    next: () => {
      const send = get().send;
      const canEnd = usePermissions.getState().canEndTurn;
      if (canEnd) send("sequence:next");
      else toast.error("Cannot end turn.");
    },
    get current() {
      const instance = get().instance;
      if (!instance) return undefined;
      return Game.getEntityById(instance, instance.data.sequence[instance.data.turn]);
    },
  },
}));
