"use client";

import { Button } from "@/components/ui/button";
import { Context } from "@/components/ui/context";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Game } from "@/lib/game";
import { useGame } from "@/lib/hooks/use-game";
import { useUser } from "@/lib/hooks/use-user";
import { cn } from "@/lib/utils";
import { Brain, Footprints, Heart, Search, Shield, Skull, Swords, Zap } from "lucide-react";
import React from "react";

type MonsterDef = Game.Monster;

export const MonsterControls = ({ monsters }: { monsters: MonsterDef[] }) => {
  const instance = useGame((state) => state.instance);
  const isOnMasterTurn = useGame((state) => state.sequence.isOnMasterTurn);
  const mode = useGame((state) => state.mode);
  const setMode = useGame((state) => state.setMode);
  const deleteById = useGame((state) => state.monster.deleteById);
  const openPanel = useGame((state) => state.inventory.openPanel);
  const userId = useUser((state) => state?.id);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [selectedMonster, setSelectedMonster] = React.useState<MonsterDef | null>(null);

  if (!instance || !userId || instance.masterId !== userId || !isOnMasterTurn) return null;

  const placedMonsters = instance.entities.filter((entity) => entity.type === "monster");
  const placingMode = mode.type === "monster:place";

  const filtered = monsters.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  const startPlacing = () => {
    if (!selectedMonster) return;
    setMode({ type: "monster:place", monsterId: selectedMonster.id });
    setDialogOpen(false);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} fullscreen>
        <Dialog.Trigger asChild>
          <Button>
            <Skull /> {placingMode ? "Placing..." : "Monsters"}
          </Button>
        </Dialog.Trigger>

        <Dialog.Content>
          <Dialog.Title>Import Monster</Dialog.Title>
          <Dialog.Description>Select a monster to place on the battlefield</Dialog.Description>

          <div className="flex min-h-0 flex-1 gap-4">
            {/* Left: searchable list */}
            <div className="flex w-1/2 flex-col gap-3">
              <div className="relative">
                <Search className="text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  placeholder="Search monsters..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1 overflow-y-auto pr-1">
                {filtered.length === 0 && (
                  <div className="text-muted py-8 text-center text-sm">No monsters found</div>
                )}
                {filtered.map((monster) => (
                  <button
                    key={monster.id}
                    onClick={() => setSelectedMonster(monster)}
                    className={cn(
                      "hover:bg-accent flex items-center gap-3 rounded px-3 py-2 text-left transition-colors",
                      selectedMonster?.id === monster.id && "bg-accent ring-ring ring-1"
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

            {/* Right: selected monster info */}
            <div className="bg-muted/30 flex w-1/2 flex-col rounded-lg border p-4">
              {!selectedMonster ? (
                <div className="text-muted flex flex-1 items-center justify-center text-sm">
                  Select a monster to see details
                </div>
              ) : (
                <div className="flex flex-1 flex-col gap-4">
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
                    <Button onClick={startPlacing} disabled={!selectedMonster}>
                      <Skull /> Place Monster
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog>

      {/* Placed monsters list — similar to chest controls */}
      {placedMonsters.length > 0 && (
        <div className="flex flex-col gap-1">
          {placedMonsters.map((monster) => (
            <Context key={monster.id}>
              <Context.Trigger>
                <Button variant="outline" className="w-full text-xs">
                  <Skull className="size-3" />
                  <span className="truncate">{monster.playable.name}</span>
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
