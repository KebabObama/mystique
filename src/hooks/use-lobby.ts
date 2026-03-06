"use client";

import { toast } from "@/components/layout/toast";
import { Lobby } from "@/types";
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
  markAsRead: (lobbyId: string) => void;
};

export const useLobby = create<LobbyStore>((set) => ({
  lobbies: [],

  init: () => {
    const userId = useUser.getState()?.id;
    const socket = useSocket.getState().socket;
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

    socket.on(
      "lobby:markRead",
      (payload: { lobbyId: string; userId: string; lastReadAt: string | Date }) => {
        const { lobbyId, userId: targetUserId, lastReadAt } = payload;
        set((s) => ({
          lobbies: s.lobbies.map((lobby) => {
            if (lobby.id !== lobbyId) return lobby;
            return {
              ...lobby,
              members: lobby.members.map((member) =>
                member.id === targetUserId
                  ? { ...member, lastReadAt: new Date(lastReadAt) }
                  : member
              ),
            };
          }),
        }));
      }
    );
  },

  createLobby: (name) => {
    const userId = useUser.getState()?.id;
    const socket = useSocket.getState().socket;
    if (!socket || !userId) return;
    socket.emit("lobby:create", userId, name);
  },

  joinLobby: (lobbyId) => {
    const userId = useUser.getState()?.id;
    const socket = useSocket.getState().socket;
    if (!socket || !userId) return;
    socket.emit("lobby:join", userId, lobbyId);
  },

  leaveLobby: (lobbyId) => {
    const userId = useUser.getState()?.id;
    const socket = useSocket.getState().socket;
    if (!socket || !userId) return;
    socket.emit("lobby:leave", userId, lobbyId);
  },

  sendMessage: (lobbyId, content) => {
    const userId = useUser.getState()?.id;
    const socket = useSocket.getState().socket;
    if (!socket || !userId) return;
    socket.emit("lobby:send", userId, lobbyId, content);
  },

  markAsRead: (lobbyId) => {
    const userId = useUser.getState()?.id;
    const socket = useSocket.getState().socket;
    if (!socket || !userId) return;
    socket.emit("lobby:markRead", userId, lobbyId);
  },
}));
