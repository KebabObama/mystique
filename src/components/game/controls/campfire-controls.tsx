"use client";

import { Border } from "@/components/ui/border";
import { Button } from "@/components/ui/button";
import { Context } from "@/components/ui/context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useGame } from "@/lib/hooks/use-game";
import { usePermissions } from "@/lib/hooks/use-permissions";
import { Flame } from "lucide-react";

export const CampfireControls = () => {
  const instance = useGame((state) => state.instance);
  const canManageCampfires = usePermissions((state) => state.isMasterOnTurn);
  const mode = useGame((state) => state.mode);
  const setMode = useGame((state) => state.setMode);
  const deleteById = useGame((state) => state.campfire.deleteById);

  if (!instance || !canManageCampfires) return null;

  const campfires = instance.campfires;
  const placeMode = mode.type === "campfire:place";
  const movingEntityId = mode.type === "campfire:move" ? mode.entityId : undefined;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm">
          <Flame /> {placeMode ? "Cancel" : movingEntityId ? "Moving..." : "Campfires"}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="absolute mx-auto mb-4 max-h-[50dvh] max-w-2xl px-1.5 pb-4"
      >
        <Border />
        <SheetHeader className="px-2 pb-2">
          <SheetTitle>Campfire Controls</SheetTitle>
        </SheetHeader>
        <div className="relative flex flex-col gap-4.5 px-2">
          {(placeMode || movingEntityId) && (
            <div className="text-muted rounded border px-3 py-2 text-center text-sm">
              Click a floor tile to {movingEntityId ? "move campfire" : "place campfire"}.
            </div>
          )}

          <Button
            size="sm"
            onClick={() => {
              if (placeMode) setMode({ type: "normal" });
              else setMode({ type: "campfire:place" });
            }}
          >
            {placeMode ? "Cancel add" : "Add campfire"}
          </Button>

          {campfires.length === 0 && (
            <div className="text-muted text-center text-sm">No campfires</div>
          )}
          {campfires.map((campfire) => (
            <Context key={campfire.id}>
              <Context.Trigger>
                <Button size="sm" variant={"outline"} className="w-full">
                  <span>{(campfire as any).name ?? "Campfire"}</span>
                  <span className="text-muted-foreground text-xs">
                    ({campfire.position.x},{campfire.position.z})
                  </span>
                </Button>
              </Context.Trigger>
              <Context.Content>
                <Context.Item
                  onClick={() => {
                    setMode({ type: "campfire:move", entityId: campfire.id });
                  }}
                >
                  Move campfire
                </Context.Item>
                <Context.Item
                  onClick={() => {
                    deleteById(campfire.id);
                    setMode({ type: "normal" });
                  }}
                >
                  Delete campfire
                </Context.Item>
              </Context.Content>
            </Context>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
