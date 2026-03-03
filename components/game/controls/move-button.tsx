"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "@/lib/hooks/use-game";
import { usePermissions } from "@/lib/hooks/use-permissions";
import { Move } from "lucide-react";

export const MoveButton = () => {
  const current = useGame((s) => s.sequence.current);
  const setMode = useGame((s) => s.setMode);
  const canControlCurrent = usePermissions((s) => s.canControlCurrent);
  const canHaveActions = current?.type === "character" || current?.type === "monster";
  const actions = current?.actions ?? (canHaveActions ? current.playable.maxActions : 0) ?? 0;

  if (
    !canControlCurrent ||
    !current ||
    (current.type !== "character" && current.type !== "monster")
  )
    return null;
  return (
    <Button size="sm" disabled={actions <= 0} onClick={() => setMode({ type: "character:move" })}>
      <Move /> Move
    </Button>
  );
};
