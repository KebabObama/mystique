"use client";

import { Game } from "@/lib/game";
import { create } from "zustand";

type HoveredEntityStore = {
  hoveredEntityId?: Game.Entity["id"];
  setHoveredEntity: (entityId: Game.Entity["id"]) => void;
  clearHoveredEntity: (entityId?: Game.Entity["id"]) => void;
};

/** Provides the Zustand store for hovered entity. */
export const useHoveredEntity = create<HoveredEntityStore>((set, get) => ({
  hoveredEntityId: undefined,
  setHoveredEntity: (hoveredEntityId) => set({ hoveredEntityId }),
  clearHoveredEntity: (entityId) => {
    if (entityId && get().hoveredEntityId !== entityId) return;
    set({ hoveredEntityId: undefined });
  },
}));
