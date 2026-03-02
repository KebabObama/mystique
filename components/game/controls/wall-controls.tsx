"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/hooks/use-game";
import { useUser } from "@/lib/hooks/use-user";
import { BrickWall, Eraser, Grid2X2Plus, Grid2X2X } from "lucide-react";

export const WallControls = () => {
  const instance = useGame((state) => state.instance);
  const isOnMasterTurn = useGame((state) => state.sequence.isOnMasterTurn);
  const mode = useGame((state) => state.mode);
  const setMode = useGame((state) => state.setMode);
  const userId = useUser((state) => state?.id);

  if (!instance || !userId || instance.masterId !== userId || !isOnMasterTurn) return null;

  const placing = mode.type === "wall:place";
  const deleting = mode.type === "wall:destroy";
  const placingArea = mode.type === "wall:place-area";
  const deletingArea = mode.type === "wall:destroy-area";

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant={placing ? "default" : "outline"}
        onClick={() => setMode(placing ? { type: "normal" } : { type: "wall:place" })}
      >
        <BrickWall /> {placing ? "Cancel" : "Add wall"}
      </Button>
      <Button
        variant={deleting ? "default" : "outline"}
        onClick={() => setMode(deleting ? { type: "normal" } : { type: "wall:destroy" })}
      >
        <Eraser /> {deleting ? "Cancel" : "Delete wall"}
      </Button>
      <Button
        variant={placingArea ? "default" : "outline"}
        onClick={() => setMode(placingArea ? { type: "normal" } : { type: "wall:place-area" })}
      >
        <Grid2X2Plus /> {placingArea ? "Cancel" : "Add area"}
      </Button>
      <Button
        variant={deletingArea ? "default" : "outline"}
        onClick={() => setMode(deletingArea ? { type: "normal" } : { type: "wall:destroy-area" })}
      >
        <Grid2X2X /> {deletingArea ? "Cancel" : "Delete area"}
      </Button>
    </div>
  );
};
