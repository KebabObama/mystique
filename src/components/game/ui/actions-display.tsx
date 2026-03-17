"use client";

import { Card } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import { usePermissions } from "@/hooks/use-permissions";

/** Renders the actions display component. */
export const ActionsDisplay = () => {
  const current = useGame((s) => s.sequence.current);
  const canControl = usePermissions((s) => s.canControlCurrent);

  const actions =
    current && "actions" in current && typeof current.actions === "number"
      ? current.actions
      : current && "maxActions" in current && typeof current.maxActions === "number"
        ? current.maxActions
        : 0;
  return (
    canControl && (
      <Card className="px-2 py-1.5 text-sm font-semibold">Remaining actions: {actions}</Card>
    )
  );
};
