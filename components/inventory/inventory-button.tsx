"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/use-game";
import { useUser } from "@/hooks/use-user";
import { Backpack } from "lucide-react";

export const InventoryButton = () => {
  const instance = useGame((s) => s.instance);
  const openPanel = useGame((s) => s.inventory.openPanel);
  const current = useGame((s) => s.sequence.current);
  const userId = useUser((s) => s?.id);

  if (!instance || !current || current.type !== "character" || current.playable.ownerId !== userId)
    return null;

  return (
    <Button onClick={() => openPanel("view", current.id)}>
      <Backpack />
      Inventory
    </Button>
  );
};
