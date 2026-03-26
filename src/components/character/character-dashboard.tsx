"use client";

import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { ItemCard } from "@/components/ui/item-card";
import { Game } from "@/lib/game";
import { ATTRIBUTE_ICON } from "@/lib/game-ui";
import { BookA, Coins, Heart, SearchCode, Section, Shield, Weight } from "lucide-react";
import React from "react";

type CharacterInfoProps = {
  character: Game.Character;
  children: React.ReactNode;
  asChild?: boolean;
};

/** Renders the character dashboard component. */
export const CharacterDashboard = ({ character, children, asChild }: CharacterInfoProps) => {
  return (
    <Dialog fullscreen>
      <Dialog.Trigger asChild={asChild}>{children}</Dialog.Trigger>
      <Dialog.Content className="p-0 text-lg select-none">
        <div className="grid h-full grid-cols-3 gap-3">
          <section className="flex h-full flex-col gap-6 border-r-6 p-6">
            <Dialog.Title>{character.name}</Dialog.Title>
            <Dialog.Description className="-mt-6 mb-0 flex flex-row justify-between capitalize">
              <span>{character.race}</span>
              <span>
                level: <span>{character.level}</span>
              </span>
            </Dialog.Description>
            <Card className="bg-background text-muted mt-auto">
              <button className="hover:text-muted/50 flex w-full flex-row justify-between">
                Health:
                <span className="text-foreground flex items-center gap-2">
                  {character.hp} / {character.maxHp}
                  <Heart className="text-muted size-4" />
                </span>
              </button>
              <button className="hover:text-muted/50 mt-auto flex w-full flex-row justify-between">
                Weight:
                <span className="text-foreground flex items-center gap-2">
                  {character.weight} / {character.maxWeight}
                  <Weight className="text-muted size-4" />
                </span>
              </button>
              <button className="hover:text-muted/50 flex w-full flex-row justify-between">
                Actions per turn:
                <span className="text-foreground flex items-center gap-2">
                  {character.maxActions}
                  <Section className="text-muted size-4" />
                </span>
              </button>
              <span className="mt-auto flex w-full flex-row justify-between">
                XP:
                <span className="text-foreground flex items-center gap-2">
                  {character.xp} / {character.level * 10}
                  <SearchCode className="text-muted size-4" />
                </span>
              </span>
              <button className="hover:text-muted/50 flex w-full flex-row justify-between">
                Memories:
                <span className="text-foreground flex items-center gap-2">
                  {character.memory} / {character.maxMemory} <BookA className="text-muted size-4" />
                </span>
              </button>
              <button className="hover:text-muted/50 flex w-full flex-row justify-between">
                Armor:
                <span className="text-foreground flex items-center gap-2">
                  {character.armor}
                  <Shield className="text-muted size-4" />
                </span>
              </button>
              <button className="hover:text-muted/50 flex w-full flex-row justify-between">
                Coins:
                <span className="text-foreground flex items-center gap-2">
                  {character.coins}
                  <Coins className="text-muted size-4" />
                </span>
              </button>
            </Card>
            <Card className="text-muted bg-background py-1">
              <span className="-mx-3 mb-1.5 flex items-center justify-between border-b-6 px-3 pb-1.5 text-center">
                {(() => {
                  let availablePoints = character.xp;
                  let currentLevel = character.level;
                  let levelsGained = 0;
                  let costToNext = currentLevel * 10;
                  while (availablePoints >= costToNext) {
                    availablePoints -= costToNext;
                    levelsGained++;
                    costToNext = (currentLevel + levelsGained) * 10;
                  }
                  return `Available to level up ${levelsGained} times`;
                })()}
              </span>
              {Game.ATTRIBUTES.map((e) => (
                <div
                  className="hover:text-muted/50 flex w-full flex-row justify-between capitalize"
                  key={e}
                >
                  {e}:
                  <span className="text-foreground flex items-center gap-2">
                    {character.attributes[e]}
                    {React.createElement(ATTRIBUTE_ICON[e], { className: "size-4 text-muted" })}
                  </span>
                </div>
              ))}
            </Card>
          </section>
          <section
            className={`col-span-2 mt-12 mr-3 flex max-h-[85dvh] flex-col items-center gap-6 overflow-y-auto p-3 ${!character.inventory.length && "justify-center"}`}
          >
            {character.inventory.length > 0 ? (
              character.inventory.map((item) => <ItemCard item={item} key={item.id} />)
            ) : (
              <div>No items in inventory</div>
            )}
          </section>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};
