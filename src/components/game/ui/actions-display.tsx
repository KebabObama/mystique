"use client";

import { Card } from "@/components/ui/card";
import { useGame } from "@/hooks/use-game";
import { usePermissions } from "@/hooks/use-permissions";

/** Renders the actions display component. */
export const ActionsDisplay = () => {
  const current = useGame((s) => s.sequence.current);
  const canControl = usePermissions((s) => s.canControlCurrent);
  return (
    canControl && (
      <Card className="px-2 py-1.5 text-sm font-semibold">
        Remaining actions: {current?.actions ?? 0}
      </Card>
    )
  );
};
