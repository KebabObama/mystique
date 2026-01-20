"use client";

import { item } from "@/db/schema";
import React from "react";
import { create } from "zustand";

export type Item = typeof item.$inferSelect;

type GameItems = {
  items: Item[];
  setItems: (items: Item[]) => void;
  getById: (id: string) => Item | undefined;
};

export const useItems = create<GameItems>()((set, get) => ({
  items: [],
  setItems: (items) => set({ items: items }),
  getById: (id) => get().items.find((item) => item.id === id),
}));

export const ItemsProvider = ({
  items,
  children,
}: {
  items: Item[];
  children: React.ReactNode;
}) => {
  const setItems = useItems((s) => s.setItems);
  React.useEffect(() => {
    setItems(items);
    console.log(items);
  }, [items]);
  return <>{children}</>;
};

