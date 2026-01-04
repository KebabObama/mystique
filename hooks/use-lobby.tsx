"use client";

import { toast } from "@/components/layout/toast";
import { Lobby } from "@/lib/lobby";
import React from "react";
import { io, type Socket } from "socket.io-client";
import { create } from "zustand";
import { useUser } from "./use-user";

export type LobbyStore = {
  socket: Socket | null;
  lobbies: Lobby.Type[];
  activeLobbyId: string | null;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (lobbyId: string, content: string) => void;
  joinLobby: (lobbyId: string) => void;
  createLobby: (name: string) => void;
  setActiveLobby: (lobbyId: string) => void;
};

export const useLobby = create<LobbyStore>((set, get) => ({
  socket: null,
  lobbies: [],
  activeLobbyId: null,

  connect: () => {
    const userId = useUser.getState().id;
    if (!userId || get().socket?.connected) return;

    const socket = io();

    socket.on("connect", () => {
      socket.emit("lobby:get", userId);
    });

    socket.on("lobby:get", (lobbies: Lobby.Type[]) => {
      set({ lobbies });
    });

    socket.on("lobby:create", (newLobby: Lobby.Type) => {
      set((state) => ({ lobbies: [...state.lobbies, newLobby] }));
    });

    socket.on("lobby:join", (updatedLobby: Lobby.Type) => {
      set((state) => ({
        lobbies: state.lobbies.some((l) => l.id === updatedLobby.id)
          ? state.lobbies.map((l) => (l.id === updatedLobby.id ? updatedLobby : l))
          : [...state.lobbies, updatedLobby],
      }));
    });

    socket.on("lobby:send", (msg: Lobby.Type["messages"][0]) => {
      const currentUserId = useUser.getState().id;
      set((state) => ({
        lobbies: state.lobbies.map((l) => {
          if (l.id === msg.lobbyId) {
            const sender = l.members.find((g) => msg.senderId === g.id);
            if (currentUserId !== sender?.id)
              toast({ title: `New message from ${sender?.name}`, message: msg.content });
            const exists = l.messages.some((m) => m.id === msg.id);
            return { ...l, messages: exists ? l.messages : [...l.messages, msg] };
          }
          return l;
        }),
      }));
    });

    set({ socket });
  },

  setActiveLobby: (lobbyId: string) => set({ activeLobbyId: lobbyId }),

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, lobbies: [], activeLobbyId: null });
    }
  },

  createLobby: (name) => {
    const userId = useUser.getState().id;
    get().socket?.emit("lobby:create", userId, name);
  },

  joinLobby: (lobbyId) => {
    const userId = useUser.getState().id;
    get().socket?.emit("lobby:join", userId, lobbyId);
  },

  sendMessage: (lobbyId, content) => {
    const userId = useUser.getState().id;
    get().socket?.emit("lobby:send", userId, lobbyId, content);
  },
}));

export const LobbyProvider = ({ children }: { children: React.ReactNode }) => {
  const connect = useLobby((s) => s.connect);
  const disconnect = useLobby((s) => s.disconnect);
  const userId = useUser((s) => s.id);
  React.useEffect(() => {
    if (userId.length === 0) return;
    const initSocket = async () => {
      await fetch("/api/sockets/lobby");
      connect();
    };
    initSocket();
    return () => disconnect();
  }, [userId, connect, disconnect]);
  return <>{children}</>;
};
