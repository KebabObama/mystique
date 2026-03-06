"use client";

import { Game } from "@/types";
import { create } from "zustand";

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

type DialogStore = {
  campfire: {
    restDialogOpen: boolean;
    tradeDialogOpen: boolean;
    shopDialogOpen: boolean;
    selectedCampfireId?: Game.Entity["id"];
    selectedCharacterId?: Game.Entity["id"];
    openRest: (campfireEntityId: Game.Entity["id"], characterEntityId: Game.Entity["id"]) => void;
    closeRest: () => void;
    openTrade: (campfireEntityId: Game.Entity["id"], characterEntityId: Game.Entity["id"]) => void;
    closeTrade: () => void;
    openShop: (campfireEntityId: Game.Entity["id"], characterEntityId: Game.Entity["id"]) => void;
    closeShop: () => void;
  };
  entityContextMenu: {
    open: boolean;
    entityId?: Game.Entity["id"];
    x: number;
    y: number;
    openAt: (entityId: Game.Entity["id"], x: number, y: number) => void;
    close: () => void;
  };
  trading: {
    dialogOpen: boolean;
    selectedCharacterId?: Game.Entity["id"];
    activeSession: TradeSession | null;
    openDialog: (fromEntityId: Game.Entity["id"]) => void;
    closeDialog: () => void;
    setActiveSession: (session: TradeSession) => void;
    clearActiveSession: (sessionId?: string) => void;
  };
  leveling: {
    dialogOpen: boolean;
    selectedCharacterId?: string;
    openDialog: (characterId: string) => void;
    closeDialog: () => void;
  };
  reset: () => void;
};

export const useDialog = create<DialogStore>((set, get) => ({
  campfire: {
    restDialogOpen: false,
    tradeDialogOpen: false,
    shopDialogOpen: false,
    selectedCampfireId: undefined,
    selectedCharacterId: undefined,
    openRest: (campfireEntityId, characterEntityId) =>
      set({
        campfire: {
          ...get().campfire,
          restDialogOpen: true,
          selectedCampfireId: campfireEntityId,
          selectedCharacterId: characterEntityId,
        },
      }),
    closeRest: () =>
      set({
        campfire: {
          ...get().campfire,
          restDialogOpen: false,
          selectedCampfireId: undefined,
          selectedCharacterId: undefined,
        },
      }),
    openTrade: (campfireEntityId, characterEntityId) =>
      set({
        campfire: {
          ...get().campfire,
          tradeDialogOpen: true,
          selectedCampfireId: campfireEntityId,
          selectedCharacterId: characterEntityId,
        },
        trading: {
          ...get().trading,
          dialogOpen: true,
          selectedCharacterId: characterEntityId,
          activeSession: null,
        },
      }),
    closeTrade: () =>
      set({
        campfire: {
          ...get().campfire,
          tradeDialogOpen: false,
          selectedCampfireId: undefined,
          selectedCharacterId: undefined,
        },
        trading: {
          ...get().trading,
          dialogOpen: false,
          selectedCharacterId: undefined,
          activeSession: null,
        },
      }),
    openShop: (campfireEntityId, characterEntityId) =>
      set({
        campfire: {
          ...get().campfire,
          shopDialogOpen: true,
          selectedCampfireId: campfireEntityId,
          selectedCharacterId: characterEntityId,
        },
      }),
    closeShop: () =>
      set({
        campfire: {
          ...get().campfire,
          shopDialogOpen: false,
          selectedCampfireId: undefined,
          selectedCharacterId: undefined,
        },
      }),
  },

  entityContextMenu: {
    open: false,
    entityId: undefined,
    x: 0,
    y: 0,
    openAt: (entityId, x, y) =>
      set({ entityContextMenu: { ...get().entityContextMenu, open: true, entityId, x, y } }),
    close: () =>
      set({ entityContextMenu: { ...get().entityContextMenu, open: false, entityId: undefined } }),
  },

  trading: {
    dialogOpen: false,
    selectedCharacterId: undefined,
    activeSession: null,
    openDialog: (fromEntityId) =>
      set({
        trading: {
          ...get().trading,
          dialogOpen: true,
          selectedCharacterId: fromEntityId,
          activeSession: null,
        },
      }),
    closeDialog: () =>
      set({
        trading: {
          ...get().trading,
          dialogOpen: false,
          selectedCharacterId: undefined,
          activeSession: null,
        },
      }),
    setActiveSession: (session) =>
      set({ trading: { ...get().trading, activeSession: session, dialogOpen: true } }),
    clearActiveSession: (sessionId) => {
      const current = get().trading.activeSession;
      if (sessionId && current && current.id !== sessionId) return;
      set({ trading: { ...get().trading, activeSession: null } });
    },
  },

  leveling: {
    dialogOpen: false,
    selectedCharacterId: undefined,
    openDialog: (characterId) =>
      set({ leveling: { ...get().leveling, dialogOpen: true, selectedCharacterId: characterId } }),
    closeDialog: () =>
      set({ leveling: { ...get().leveling, dialogOpen: false, selectedCharacterId: undefined } }),
  },

  reset: () =>
    set({
      campfire: {
        ...get().campfire,
        restDialogOpen: false,
        tradeDialogOpen: false,
        shopDialogOpen: false,
        selectedCampfireId: undefined,
        selectedCharacterId: undefined,
      },
      entityContextMenu: { ...get().entityContextMenu, open: false, entityId: undefined },
      trading: {
        ...get().trading,
        dialogOpen: false,
        selectedCharacterId: undefined,
        activeSession: null,
      },
      leveling: { ...get().leveling, dialogOpen: false, selectedCharacterId: undefined },
    }),
}));
