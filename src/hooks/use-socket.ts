"use client";

import { useGame } from "@/hooks/use-game";
import { useLobby } from "@/hooks/use-lobby";
import { io, type Socket } from "socket.io-client";
import { create } from "zustand";
import { useUser } from "./use-user";

type SocketStore = {
  socket: Socket | null;
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
};

/** Provides the Zustand store for socket. */
export const useSocket = create<SocketStore>((set, get) => ({
  socket: null,
  connected: false,

  connect: () => {
    const userId = useUser.getState()?.id;
    if (!userId) return;
    if (get().socket) return;

    const socket = io();

    socket.on("connect", () => {
      set({ connected: true });
      useLobby.getState().init();
      useGame.getState().init();
    });

    socket.on("disconnect", () => {
      set({ connected: false });
    });

    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (!socket) return;
    socket.disconnect();
    set({ socket: null, connected: false });
  },
}));
