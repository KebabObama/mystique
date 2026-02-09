"use client";

import { toast } from "@/components/layout/toast";
import { Lobby } from "@/lib/lobby";
import { create } from "zustand";
import { useSocket } from "./use-socket";
import { useUser } from "./use-user";

export type LobbyStore = {
  lobbies: Lobby[];
  init: () => void;
  createLobby: (name: string) => void;
  joinLobby: (lobbyId: string) => void;
  leaveLobby: (lobbyId: string) => void;
  sendMessage: (lobbyId: string, content: string) => void;
};

const userId = useUser.getState()?.id;
const socket = useSocket.getState().socket;

export const useLobby = create<LobbyStore>((set) => ({
  lobbies: [],

  init: () => {
    if (!socket || !userId) return;

    socket.emit("lobby:get", userId);

    socket.on("lobby:get", (lobbies: Lobby[]) => {
      set({ lobbies });
    });

    socket.on("lobby:create", (lobby: Lobby) => {
      set((s) => ({ lobbies: [...s.lobbies, lobby] }));
    });

    socket.on("lobby:leave", (lobbyId: string) => {
      set((s) => ({ lobbies: s.lobbies.filter((l) => l.id !== lobbyId) }));
    });

    socket.on("lobby:join", (updated: Lobby) => {
      set((s) => ({
        lobbies: s.lobbies.some((l) => l.id === updated.id)
          ? s.lobbies.map((l) => (l.id === updated.id ? updated : l))
          : [...s.lobbies, updated],
      }));
    });

    socket.on("lobby:send", (msg: Lobby["messages"][0]) => {
      set((s) => ({
        lobbies: s.lobbies.map((l) => {
          if (l.id !== msg.lobbyId) return l;
          const sender = l.members.find((m) => m.id === msg.senderId);
          const exists = l.messages.some((m) => m.id === msg.id);
          if (sender && sender.id !== userId)
            toast({ title: `New message from ${sender.name}`, message: msg.content });
          return exists ? l : { ...l, messages: [...l.messages, msg] };
        }),
      }));
    });
  },

  createLobby: (name) => {
    if (!socket || !userId) return;
    socket.emit("lobby:create", userId, name);
  },

  joinLobby: (lobbyId) => {
    if (!socket || !userId) return;
    socket.emit("lobby:join", userId, lobbyId);
  },

  leaveLobby: (lobbyId) => {
    if (!socket || !userId) return;
    socket.emit("lobby:leave", userId, lobbyId);
  },

  sendMessage: (lobbyId, content) => {
    if (!socket || !userId) return;
    socket.emit("lobby:send", userId, lobbyId, content);
  },
}));
