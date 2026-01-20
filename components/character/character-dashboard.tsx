"use client";

import { Dialog } from "@/components/ui/dialog";
import { ItemCard } from "@/components/ui/item-card";
import { Game } from "@/lib/game";
import React from "react";

type CharacterInfoProps = {
  character: Game.Character;
  children: React.ReactNode;
  asChild?: boolean;
};

export const CharacterDashboard = ({ character, children, asChild }: CharacterInfoProps) => {
  return (
    <Dialog fullscreen>
      <Dialog.Trigger asChild={asChild}>{children}</Dialog.Trigger>
      <Dialog.Content className="text-lg select-none" onContextMenu={(e) => e.preventDefault()}>
        <Dialog.Title>Information</Dialog.Title>
        <div className="gapbash-6 mt-3 grid h-full grid-cols-3">
          <section className="flex h-full flex-col justify-between gap-6">
            <Dialog.Description className="text-muted -mx-1.5 mb-1.5 flex h-full flex-col px-1.5">
              <span className="flex w-full flex-row justify-between">
                Name: <span className="text-foreground capitalize">{character.name}</span>
              </span>
              <span className="flex w-full flex-row justify-between">
                Race: <span className="text-foreground capitalize">{character.race}</span>
              </span>
              <span className="flex w-full flex-row justify-between">
                Level: <span className="text-foreground">{character.level}</span>
              </span>
              <span className="flex w-full flex-row justify-between">
                XP:
                <span className="text-foreground">
                  {character.xp} / {character.level * 10}
                </span>
              </span>
              <span className="flex w-full flex-row justify-between">
                Weight:
                <span className="text-foreground">
                  {character.weight} / {character.maxWeight}
                </span>
              </span>
              <span className="flex w-full flex-row justify-between">
                Actions:
                <span className="text-foreground">
                  {character.actions} / {character.maxActions}
                </span>
              </span>
              <span className="flex w-full flex-row justify-between">
                Armor:
                <span className="text-foreground">{character.armor}</span>
              </span>
              <span className="flex w-full flex-row justify-between">
                Memories:
                <span className="text-foreground">
                  {character.memory} / {character.maxMemory}
                </span>
              </span>
              <span className="flex w-full flex-row justify-between">
                Coins:
                <span className="text-foreground">{character.coins}</span>
              </span>
              {Game.KEYS.ATTRIBUTES.map((e) => (
                <span className="flex w-full flex-row justify-between" key={e}>
                  {e}:<span className="text-foreground">{character.attributes[e]}</span>
                </span>
              ))}
              <span className="flex w-full flex-row justify-between">
                Items in inventory:
                <span className="text-foreground">
                  {character.inventory.reduce((acc, e) => acc + e.quantity, 0)}
                </span>
              </span>
              <span className="flex w-full flex-row justify-between">
                Equipped items:
                <span className="text-foreground">
                  {character.inventory.reduce((acc, e) => (e.equipped ? acc + 1 : acc), 0)}
                </span>
              </span>
              <span className="flex w-full flex-row justify-between">
                Abilities:
                <span className="text-foreground">
                  {character.inventory.reduce(
                    (acc, e) => acc + (e.equipped ? e.abilities.length : 0),
                    0
                  )}
                </span>
              </span>
              <span className="flex w-full flex-row justify-between">
                Castable abilities:
                <span className="text-foreground">
                  {
                    // prettier-ignore
                    character.inventory.reduce(
                    (acc, item) => acc + (item.equipped && item.abilities.reduce(
                        (bcc, ability) => bcc + (ability.cost <= character.memory && character.actions > 0 ? ability.cost : 0), 0)
                        ? item.abilities.length : 0), 0)
                  }
                </span>
              </span>
            </Dialog.Description>
          </section>
          <section className="col-span-2 flex flex-col gap-6">
            {character.inventory.map((item) => (
              <ItemCard item={item} key={item.id} />
            ))}
          </section>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};
