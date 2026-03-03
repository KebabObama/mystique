"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/hooks/use-game";
import { usePermissions } from "@/lib/hooks/use-permissions";
import { Backpack } from "lucide-react";

export const InventoryButton = () => {
  const openPanel = useGame((s) => s.inventory.openPanel);
  const current = useGame((s) => s.sequence.current);
  const canControlCurrent = usePermissions((s) => s.canControlCurrent);

  if (!current || current.type !== "character" || !canControlCurrent) return null;

  return (
    <Button size="sm" onClick={() => openPanel("view", current.id)}>
      <Backpack />
      Inventory
    </Button>
  );
};
