"use client";

import { useSocket } from "@/hooks/use-socket";
import { useUser } from "@/hooks/use-user";
import { Instance } from "@/pages/api/socket";
import { create } from "zustand";

export type GameStore = {
  instance: Instance | null;
  init: () => void;
  joinInstance: (instanceId: string) => void;
  leaveInstance: () => void;
  send: (event: string, ...args: any[]) => void;
};

export const useGame = create<GameStore>((set, get) => ({
  instance: null,

  init: () => {
    const socket = useSocket.getState().socket;
    if (!socket) return;

    socket.on("game:state", (instance: Instance) => {
      set({ instance });
    });

    socket.on("disconnect", () => {
      set({ instance: null });
    });
  },

  joinInstance: (instanceId: string) => {
    const socket = useSocket.getState().socket;
    const userId = useUser.getState().id;
    if (!socket || !userId) return;
    set({ instance: null });
    socket.emit("game:join", userId, instanceId);
  },

  leaveInstance: () => {
    const socket = useSocket.getState().socket;
    const userId = useUser.getState().id;
    const inst = get().instance;
    if (!socket || !userId || !inst) return;
    socket.emit("game:leave", userId, inst.id);
    set({ instance: null });
  },

  send: (event: string, ...payload: any[]) => {
    const socket = useSocket.getState().socket;
    const userId = useUser.getState().id;
    const inst = get().instance;
    if (!socket || !userId || !inst) return;
    socket.emit(`game:${event}`, userId, inst.id, ...payload);
  },
}));

