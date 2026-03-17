"use client";

import { Border } from "@/components/ui/border";
import { Button } from "@/components/ui/button";
import { Context } from "@/components/ui/context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useGame } from "@/hooks/use-game";
import { usePermissions } from "@/hooks/use-permissions";
import { Box } from "lucide-react";

/** Renders the chest controls component. */
export const ChestControls = () => {
  const instance = useGame((state) => state.instance);
  const canManageChests = usePermissions((state) => state.isMasterOnTurn);
  const mode = useGame((state) => state.mode);
  const setMode = useGame((state) => state.setMode);
  const deleteById = useGame((state) => state.chest.deleteById);
  const openPanel = useGame((state) => state.inventory.openPanel);

  if (!instance || !canManageChests) return null;

  const chests = instance.chests;
  const placeMode = mode.type === "chest:place";
  const movingEntityId = mode.type === "chest:move" ? mode.entityId : undefined;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm">
          <Box /> {placeMode ? "Cancel" : movingEntityId ? "Moving..." : "Chests"}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="absolute mx-auto mb-4 max-h-[50dvh] max-w-2xl px-1.5 pb-4"
      >
        <Border />
        <SheetHeader className="px-2 pb-2">
          <SheetTitle>Chest Controls</SheetTitle>
        </SheetHeader>
        <div className="relative flex flex-col gap-4.5 px-2">
          {(placeMode || movingEntityId) && (
            <div className="text-muted rounded border px-3 py-2 text-center text-sm">
              Click a floor tile to {movingEntityId ? "move chest" : "place chest"}.
            </div>
          )}

          <Button
            size="sm"
            onClick={() => {
              if (placeMode) setMode({ type: "normal" });
              else setMode({ type: "chest:place" });
            }}
          >
            {placeMode ? "Cancel add" : "Add chest"}
          </Button>

          {chests.length === 0 && <div className="text-muted text-center text-sm">No chests</div>}
          {chests.map((chest) => (
            <Context key={chest.id}>
              <Context.Trigger>
                <Button size="sm" variant={"outline"} className="w-full">
                  <span>{chest.name}</span>
                  <span className="text-muted-foreground text-xs">
                    ({chest.position.x},{chest.position.z})
                  </span>
                </Button>
              </Context.Trigger>
              <Context.Content>
                <Context.Item onClick={() => openPanel("master", chest.id)}>
                  Open inventory
                </Context.Item>
                <Context.Item
                  onClick={() => {
                    setMode({ type: "chest:move", entityId: chest.id });
                  }}
                >
                  Move chest
                </Context.Item>
                <Context.Item
                  onClick={() => {
                    deleteById(chest.id);
                    setMode({ type: "normal" });
                  }}
                >
                  Delete chest
                </Context.Item>
              </Context.Content>
            </Context>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
