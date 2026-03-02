"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/hooks/use-game";
import { Flame } from "lucide-react";

export const CampfireControls = () => {
  const mode = useGame((s) => s.mode);
  const setMode = useGame((s) => s.setMode);
  const campfire = useGame((s) => s.campfire);

  const isCampfireMode = mode.type === "campfire:place";

  return (
    <Button
      onClick={() => setMode(isCampfireMode ? { type: "normal" } : { type: "campfire:place" })}
      variant={isCampfireMode ? "default" : "outline"}
      size="sm"
      className="w-full"
    >
      <Flame className="mr-2 size-4" />
      {isCampfireMode ? "Cancel" : "Place Campfire"}
    </Button>
  );
};
