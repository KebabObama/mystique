"use client";

import { create } from "zustand";

export type GameStore = {
  instance: any;
  init: () => void;
  joinInstance: (lobbyId: string) => void;
  leaveInstance: () => void;
  sendAction: (message: any, data: any) => void;
};

export const useGame = create<GameStore>((set, get) => ({
  instance: null,
  init: () => {},
  joinInstance: () => {},
  leaveInstance: () => {},
  sendAction: () => {},
}));

