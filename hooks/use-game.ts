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
};

export const useGame = create<GameStore>((set, get) => ({
  instance: null,

  init: () => {
    const userId = useUser.getState()?.id;
    const socket = useSocket.getState().socket;
    if (!socket) return;

    socket.on("game:state", (instance: Game.Instance) => {
      set({ instance });
    });

    socket.on("game:sequence:next", (turn: number) => {
      const inst = get().instance;
      if (!inst || !userId) return;
      set({ instance: { ...inst, data: { ...inst.data, turn: turn } } });
      const canEnd = get().sequence.canEnd;
      if (canEnd) toast.show(`It's your turn`);
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
    const inst = get().instance;
    const userId = useUser.getState()?.id;
    const send = get().send;
    if (!userId || !inst) return;
    send("leave");
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

  movement: {
    moveTo: (entityId: Game.Entity["id"], position: Game.Position) => {
      const instance = get().instance;
      const send = get().send;
      if (!instance) return;
      const entity = instance.entities.find((e) => e.id === entityId);
      if (!entity || (entity.position.x === position.x && entity.position.z === position.z)) return;
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
