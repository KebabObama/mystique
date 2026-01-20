"use client";

import { Game } from "@/lib/game";
import React from "react";
import { Card } from "../ui/card";
import { Dialog } from "../ui/dialog";

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
        <div className="mt-3 grid h-full grid-cols-3 gap-6">
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
                  {character.xp} / {character.level * 5}
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
                Abilitites:
                <span className="text-foreground">
                  {character.inventory.reduce(
                    (acc, e) => acc + (e.equipped ? e.abilities.length : 0),
                    0
                  )}
                </span>
              </span>
              <span className="flex w-full flex-row justify-between">
                Castable abilitites:
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
            {character.inventory.map((e) => (
              <Card
                key={e.id}
                className={`grid w-full grid-cols-3 p-0 text-xs ${e.equipped ? "bg-background/80" : ""} shadow-sm`}
              >
                <div className="col-span-2 flex w-full flex-col justify-between px-1.5 py-1">
                  <div className="flex items-center justify-between">
                    <h1 className="text-foreground w-full text-base font-semibold capitalize">
                      {e.quantity}x - {e.name}
                    </h1>
                    <span className="text-muted text-end">{e.type}</span>
                  </div>
                  <table className="w-full pb-2 text-left text-xs">
                    <thead>
                      <tr className="sticky text-center font-semibold">
                        <td className="text-start">Name</td>
                        <td>Range</td>
                        <td>AoE / Hits</td>
                        <td>Cost</td>
                        <td>Damage / Heal</td>
                        <td className="text-end">Effects</td>
                      </tr>
                    </thead>
                    <tbody className="text-muted text-center">
                      {e.abilities.map((f) => (
                        <tr key={f.name}>
                          <td className="text-foreground text-start font-medium">{f.name}</td>
                          <td>{f.range}</td>
                          <td>
                            {f.targeting < 0 ? "A" : "H"}-{Math.abs(f.targeting)}
                          </td>
                          <td>{f.cost}</td>
                          <td>
                            <span>
                              {f.amount[0] < 0 ? "H" : "D"}: {f.amount[0]} - {f.amount[1]}
                            </span>
                          </td>
                          <td className="text-end uppercase">
                            {Game.KEYS.EFFECTS.reduce(
                              (acc, g) => `${acc}${g[0]}${f.effects[g] ?? 0} `,
                              ""
                            ).trim()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-muted flex h-full flex-col justify-center border-l-6 px-2 py-1">
                  <StatLabel label="Value" value={e.value} />
                  <StatLabel label="Weight" value={e.weight} />
                  {e.armor && <StatLabel label="Armor" value={e.armor} />}
                  <StatLabel
                    label="require"
                    value={Game.KEYS.ATTRIBUTES.map((attr) => e.regiments[attr] ?? 0).join("-")}
                  />
                </div>
              </Card>
            ))}
          </section>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

const StatLabel = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <p className="flex flex-row justify-between">
    <span className="text-muted capitalize">{label}</span>
    <span className="text-foreground">{value}</span>
  </p>
);

