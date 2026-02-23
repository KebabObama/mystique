"use client";

import { toast } from "@/components/layout/toast";
import { useSocket } from "@/hooks/use-socket";
import { useUser } from "@/hooks/use-user";
import { Game } from "@/lib/game";
import { create } from "zustand";

export type GameStore = {
  instance: Game.Instance | null;
  init: () => void;
  joinInstance: (instanceId: string) => void;
  leaveInstance: () => void;
  send: (event: string, ...args: any[]) => void;
  movement: {
    moveTo: (entityId: Game.Entity["id"], position: Game.Position) => void;
    getViable: (entityId: Game.Entity["id"]) => Game.Position[];
  };
  sequence: {
    next: () => void;
    readonly canEnd: boolean;
    readonly current: Game.Entity | undefined;
    readonly isOnMasterTurn: boolean;
  };
  actions: {
    normalMode?: Game.Ability;
    masterMode: "wall:place" | "wall:destroy";
    moveMode: boolean;
    setNormalMode: (ability?: Game.Ability) => void;
    setMasterMode: (mode: "wall:place" | "wall:destroy") => void;
    setMoveMode: (mode: boolean) => void;
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

  actions: {
    normalMode: undefined,
    masterMode: "wall:place",
    moveMode: false,
    setNormalMode: (normalMode) => set({ actions: { ...get().actions, normalMode } }),
    setMasterMode: (masterMode) => set({ actions: { ...get().actions, masterMode } }),
    setMoveMode: (moveMode) => set({ actions: { ...get().actions, moveMode } }),
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

  sequence: {
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
    get current() {
      const instance = get().instance;
      if (!instance) return undefined;
      return instance.entities.find((e) => e.id === instance.data.sequence[instance.data.turn]);
    },
    get isOnMasterTurn() {
      const userId = useUser.getState()?.id;
      const instance = get().instance;
      if (!userId || !instance) return false;
      return instance.masterId === userId && instance.data.turn === -1;
    },
  },
}));
