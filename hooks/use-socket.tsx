"use client";

import { useGame } from "@/hooks/use-game";
import { useLobby } from "@/hooks/use-lobby";
import React from "react";
import { io, type Socket } from "socket.io-client";
import { create } from "zustand";
import { useUser } from "./use-user";

type SocketStore = {
  socket: Socket | null;
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
};

export const useSocket = create<SocketStore>((set, get) => ({
  socket: null,
  connected: false,

  connect: () => {
    const userId = useUser.getState().id;
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

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const connect = useSocket((s) => s.connect);
  const disconnect = useSocket((s) => s.disconnect);
  const userId = useUser((s) => s.id);
  React.useEffect(() => {
    if (!userId) return;
    (async () => {
      await fetch("/api/socket");
      connect();
    })();
    return () => disconnect();
  }, [userId, connect, disconnect]);
  return <>{children}</>;
};
