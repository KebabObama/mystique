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

export const CharacterInfo = ({ character, children, asChild }: CharacterInfoProps) => {
  const [hoveredAttr, setHoveredAttr] = React.useState<Game.Attribute>("str");

  return (
    <Dialog>
      <Dialog.Trigger asChild={asChild}>{children}</Dialog.Trigger>
      <Dialog.Content className="text-lg">
        <Dialog.Title>Information</Dialog.Title>
        <Dialog.Description className="text-muted -mx-1.5 mb-1.5 flex flex-col border-b-2 border-dashed px-1.5 pb-1.5">
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
        </Dialog.Description>

        {Game.KEYS.ATTRIBUTES.map((attr) => {
          const current = character.attributes[attr];
          return (
            <div
              key={attr}
              className="group flex items-center justify-between"
              onMouseEnter={() => setHoveredAttr(attr)}
            >
              <span className="group-hover:text-foreground text-muted capitalize transition-colors">
                {Game.INFO.ATTRIBUTES[attr].name}
              </span>
              <span>{current}</span>
            </div>
          );
        })}
        <Card className="mt-3.5 min-h-28 text-center">
          <h3 className="font-black uppercase">{Game.INFO.ATTRIBUTES[hoveredAttr].name}</h3>
          <p className="text-base leading-tight font-medium opacity-70">
            {Game.INFO.ATTRIBUTES[hoveredAttr].description}
          </p>
        </Card>
        <Card className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 p-4">
          <div className="flex justify-between">
            <span className="opacity-60">Health</span>
            <span>
              {character.hp} / {character.maxHp}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">Actions</span>
            <span>
              {character.actions} / {character.maxActions}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">Stamina</span> <span>{character.stamina}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">Weight</span>
            <span>
              {character.weight} / {character.maxWeight} kg
            </span>
          </div>
        </Card>
      </Dialog.Content>
    </Dialog>
  );
};

