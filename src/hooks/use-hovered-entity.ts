"use client";

import { Game } from "@/lib/types";
import { create } from "zustand";

type HoveredEntityStore = {
  hoveredEntityId?: Game.Entity["id"];
  setHoveredEntity: (entityId: Game.Entity["id"]) => void;
  clearHoveredEntity: (entityId?: Game.Entity["id"]) => void;
};

export const useHoveredEntity = create<HoveredEntityStore>((set, get) => ({
  hoveredEntityId: undefined,
  setHoveredEntity: (hoveredEntityId) => set({ hoveredEntityId }),
  clearHoveredEntity: (entityId) => {
    if (entityId && get().hoveredEntityId !== entityId) return;
    set({ hoveredEntityId: undefined });
  },
}));
