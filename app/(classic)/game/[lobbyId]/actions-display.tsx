"use client";

import { Card } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import { useUser } from "@/hooks/use-user";

export const ActionsDisplay = () => {
  const userId = useUser((s) => s?.id);
  const current = useGame((s) => s.sequence.current);
  const isOnMasterTurn = useGame((s) => s.sequence.isOnMasterTurn);
  const actions = current?.actions ?? current?.playable.maxActions ?? 0;

  const show =
    (current?.type === "character" && current.playable.ownerId === userId) ||
    (current?.type === "monster" && isOnMasterTurn) ||
    isOnMasterTurn;

  if (!show) return null;
  return <Card className="p-0.5 text-sm">Actions: {actions}</Card>;
};
