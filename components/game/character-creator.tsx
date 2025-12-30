"use client";

import { CharacterHelper } from "@/lib/character-helper";
import { Game } from "@/types/game";
import { Dices, Minus, Plus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const CharacterCreator = () => {
  const [char, setChar] = React.useState<Game.Character>(CharacterHelper.defaultCharacter());
  const [attrPoints, setAttrPoints] = React.useState<number>(7);
  const [hoveredAttr, setHoveredAttr] = React.useState<Game.Attribute>("str");

  const syncChar = (updatedChar: Game.Character) => {
    setChar(CharacterHelper.updateByAttributes(updatedChar));
  };

  const handleRaceChange = (value: string) => {
    const race = value as Game.Race;
    const newBase = Game.INFO.RACES[race].starting;
    setAttrPoints(7);
    syncChar({ ...char, race, attributes: { ...newBase } });
  };

  const modifyAttribute = (attr: Game.Attribute, amount: number) => {
    const baseValue = Game.INFO.RACES[char.race].starting[attr];
    const currentValue = char.attributes[attr];
    if (amount > 0 && (attrPoints <= 0 || currentValue >= baseValue + 3)) return;
    if (amount < 0 && currentValue <= baseValue) return;
    setAttrPoints((prev) => prev - amount);
    syncChar({ ...char, attributes: { ...char.attributes, [attr]: currentValue + amount } });
  };

  return (
    <Dialog fullscreen>
      <Dialog.Trigger asChild>
        <Button variant="outline">Create Character</Button>
      </Dialog.Trigger>

      <Dialog.Content className="flex flex-col gap-6 font-bold tracking-tighter">
        <div className="space-y-1">
          <Dialog.Title className="text-3xl">Forge Your Hero</Dialog.Title>
          <Dialog.Description className="text-xs opacity-70">
            Allocate 7 points (max 3 per attribute).
          </Dialog.Description>
        </div>

        <div className="flex flex-col gap-7">
          <div className="flex gap-6">
            <Input
              className="grow"
              value={char.name}
              onChange={(e) => setChar({ ...char, name: e.target.value })}
              placeholder="CHARACTER NAME"
            />

            <Button
              type="button"
              variant={"outline"}
              size={"icon"}
              onClick={() => setChar({ ...char, name: CharacterHelper.generateRandomName(char) })}
            >
              <Dices />
            </Button>
          </div>

          <Select value={char.race} onValueChange={handleRaceChange}>
            <SelectTrigger>
              <SelectValue placeholder="CHOOSE RACE" />
            </SelectTrigger>
            <SelectContent>
              {Game.KEYS.RACES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col items-center justify-between border-b-6 pb-2 md:flex-row">
          <span className="text-xl">Attributes</span>
          <span className="text-muted">Points remaining: {attrPoints}</span>
        </div>

        {Game.KEYS.ATTRIBUTES.map((attr) => {
          const base = Game.INFO.RACES[char.race].starting[attr];
          const current = char.attributes[attr];
          return (
            <div
              key={attr}
              className="group text-muted hover:text-foreground flex items-center justify-between transition-colors"
              onMouseEnter={() => setHoveredAttr(attr)}
            >
              <span className="text-lg font-black capitalize">
                {Game.INFO.ATTRIBUTES[attr].name}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={current <= base}
                  onClick={() => modifyAttribute(attr, -1)}
                >
                  <Minus />
                </Button>

                <span className="w-8 text-center text-2xl">{current}</span>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={attrPoints === 0 || current >= base + 3}
                  onClick={() => modifyAttribute(attr, 1)}
                >
                  <Plus />
                </Button>
              </div>
            </div>
          );
        })}

        <Dialog.Footer className="flex flex-col! gap-6">
          <Card className="flex min-h-20 flex-col items-center justify-center text-center">
            <h1 className="text-lg">{Game.INFO.ATTRIBUTES[hoveredAttr].name}</h1>
            <span className="text-muted">{Game.INFO.ATTRIBUTES[hoveredAttr].description}</span>
          </Card>

          <Card className="grid grid-cols-2 gap-3 p-3 md:grid-cols-3">
            <div className="flex justify-between">
              <span className="opacity-60">Health</span> <span>{char.health.max}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">Actions</span> <span>{char.actions.max}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">Memories</span> <span>{char.memories.max}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">Carry</span> <span>{char.weight.max}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">Stamina</span> <span>{char.stamina}</span>
            </div>
          </Card>
          <Button
            disabled={char.name.length === 0 || attrPoints !== 0}
            className="w-full"
            onClick={() => console.log("Final Character:", char)}
          >
            {attrPoints > 0
              ? `${attrPoints} Points Left`
              : char.name.length === 0
                ? "Name Character"
                : "Begin Quest"}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

