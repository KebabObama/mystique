"use client";

import { Border } from "@/components/ui/border";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Context } from "@/components/ui/context";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useGame } from "@/hooks/use-game";
import { usePermissions } from "@/hooks/use-permissions";
import { Game } from "@/lib/game";
import { cn } from "@/lib/utils";
import { Brain, Footprints, Heart, Search, Shield, Skull, Swords, Zap } from "lucide-react";
import React from "react";

type MonsterDef = Game.Monster;

/** Renders the monster controls component. */
export const MonsterControls = ({ monsters }: { monsters: MonsterDef[] }) => {
  const instance = useGame((state) => state.instance);
  const canManageMonsters = usePermissions((state) => state.isMasterOnTurn);
  const mode = useGame((state) => state.mode);
  const setMode = useGame((state) => state.setMode);
  const deleteById = useGame((state) => state.monster.deleteById);
  const openPanel = useGame((state) => state.inventory.openPanel);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [selectedMonster, setSelectedMonster] = React.useState<MonsterDef | null>(null);

  if (!instance || !canManageMonsters) return null;

  const placedMonsters = instance.monsters;
  const placingMode = mode.type === "monster:place";

  const filtered = monsters.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  const startPlacing = () => {
    if (!selectedMonster) return;
    setMode({ type: "monster:place", monsterId: selectedMonster.id });
    setDialogOpen(false);
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button size="sm">
            <Skull /> {placingMode ? "Cancel" : "Monsters"}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="absolute mx-auto mb-4 max-h-[50dvh] max-w-2xl px-1.5 pb-4"
        >
          <Border />
          <SheetHeader className="px-2 pb-2">
            <SheetTitle>Monster Controls</SheetTitle>
          </SheetHeader>
          <div className="relative flex flex-col gap-4.5 px-2">
            {placingMode && (
              <div className="text-muted rounded border px-3 py-2 text-center text-sm">
                Click a floor tile to place monster.
              </div>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen} fullscreen>
              <Dialog.Trigger asChild>
                <Button size="sm">
                  <Skull /> Add Monster
                </Button>
              </Dialog.Trigger>

              <Dialog.Content>
                <Dialog.Title>Add Monster</Dialog.Title>
                <Dialog.Description>
                  Select a monster to place on the battlefield
                </Dialog.Description>

                <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
                  <div className="flex min-h-0 w-1/2 flex-col gap-3">
                    <div className="relative overflow-visible px-1.5 pt-1.5">
                      <Search className="text-muted absolute top-1/2 left-3 ml-3 size-4 -translate-y-1/2" />
                      <Input
                        placeholder="Search monsters..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-1">
                      {filtered.length === 0 && (
                        <div className="text-muted py-8 text-center text-sm">No monsters found</div>
                      )}
                      {filtered.map((monster) => (
                        <button
                          key={monster.id}
                          onClick={() => setSelectedMonster(monster)}
                          className={cn(
                            "hover:bg-accent mr-3 flex items-center gap-3 rounded-none px-3 py-2 text-left transition-colors",
                            selectedMonster?.id === monster.id && "bg-accent border-3"
                          )}
                        >
                          <Skull className="text-destructive size-4 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{monster.name}</div>
                            <div className="text-muted text-xs">Level {monster.level}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex min-h-0 w-1/2 flex-col">
                    {!selectedMonster ? (
                      <div className="text-muted flex flex-1 items-center justify-center text-sm">
                        Select a monster to see details
                      </div>
                    ) : (
                      <Card className="m-4 flex min-h-0 flex-1 flex-col gap-4">
                        <div>
                          <h3 className="text-lg font-bold">{selectedMonster.name}</h3>
                          <span className="text-muted text-sm">Level {selectedMonster.level}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <StatRow
                            icon={Heart}
                            label="HP"
                            value={`${selectedMonster.hp} / ${selectedMonster.maxHp}`}
                            color="text-red-400"
                          />
                          <StatRow
                            icon={Shield}
                            label="Armor"
                            value={selectedMonster.armor}
                            color="text-blue-400"
                          />
                          <StatRow
                            icon={Footprints}
                            label="Stamina"
                            value={selectedMonster.stamina}
                            color="text-green-400"
                          />
                          <StatRow
                            icon={Zap}
                            label="Actions"
                            value={selectedMonster.maxActions}
                            color="text-yellow-400"
                          />
                          <StatRow
                            icon={Brain}
                            label="Memory"
                            value={selectedMonster.memory}
                            color="text-purple-400"
                          />
                        </div>

                        {selectedMonster.abilities.length > 0 && (
                          <div>
                            <h4 className="mb-2 text-sm font-semibold">Abilities</h4>
                            <div className="flex flex-col gap-2">
                              {selectedMonster.abilities.map((ability, i) => (
                                <div
                                  key={i}
                                  className="bg-card flex items-center gap-2 rounded border px-3 py-2"
                                >
                                  <Swords className="text-destructive size-4 shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <span className="text-sm font-medium">{ability.name}</span>
                                    <span className="text-muted ml-2 text-xs">
                                      Cost: {ability.cost} · Range: {ability.range} · Dmg:{" "}
                                      {ability.amount[0]}-{ability.amount[1]}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-auto flex justify-end pt-4">
                          <Button size="sm" onClick={startPlacing} disabled={!selectedMonster}>
                            <Skull /> Place Monster
                          </Button>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              </Dialog.Content>
            </Dialog>

            {placedMonsters.length > 0 && (
              <div className="flex flex-col gap-1">
                {placedMonsters.map((monster) => (
                  <Context key={monster.id}>
                    <Context.Trigger>
                      <Button size="sm" variant="outline" className="w-full text-xs">
                        <Skull className="size-3" />
                        <span className="truncate">{monster.name}</span>
                        <span className="text-muted-foreground text-[10px]">
                          ({monster.position.x},{monster.position.z})
                        </span>
                      </Button>
                    </Context.Trigger>
                    <Context.Content>
                      <Context.Item onClick={() => openPanel("master", monster.id)}>
                        Open inventory
                      </Context.Item>
                      <Context.Item
                        onClick={() => {
                          deleteById(monster.id);
                          setMode({ type: "normal" });
                        }}
                      >
                        Delete monster
                      </Context.Item>
                    </Context.Content>
                  </Context>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

const StatRow = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
}) => (
  <div className="flex items-center gap-2">
    <Icon className={cn("size-4", color)} />
    <span className="text-muted text-xs">{label}</span>
    <span className="ml-auto text-sm font-medium">{value}</span>
  </div>
);
