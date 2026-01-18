"use client";

import { useUser } from "@/hooks/use-user";
import { createCharacter } from "@/lib/character-actions";
import { Game } from "@/lib/game";
import { Dices, Minus, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { toast } from "../layout/toast";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const CharacterCreator = () => {
  const ownerId = useUser((s) => s.id);
  const [char, setChar] = React.useState<Game.Character>(() =>
    Game.completeCharacter({
      id: "",
      ownerId,
      name: "",
      race: "human",
      level: 1,
      xp: 0,
      hp: 10,
      attributes: { ...Game.INFO.RACES.human.starting },
      inventory: [],
    })
  );

  const handleCreate = async () => {
    const { error, success } = await createCharacter(ownerId, char);
    if (!success) {
      toast.error(error || "Failed to create character");
      return;
    }
    toast.success("Character forged!");
    setOpen(false);
    redirect("/dashboard");
  };

  const [attrPoints, setAttrPoints] = React.useState<number>(7);
  const [hoveredAttr, setHoveredAttr] = React.useState<Game.Attribute>("str");
  const [open, setOpen] = React.useState(false);

  const syncChar = (updatedFields: Partial<Game.PartialCharacter>) => {
    setChar(Game.completeCharacter({ ...char, ...updatedFields }));
  };

  const handleRaceChange = (race: Game.Race) => {
    const newBase = Game.INFO.RACES[race].starting;
    setAttrPoints(7);
    syncChar({ race, attributes: { ...newBase } });
  };

  const modifyAttribute = (attr: Game.Attribute, amount: number) => {
    const baseValue = Game.INFO.RACES[char.race].starting[attr];
    const currentValue = char.attributes[attr];

    if (amount > 0 && (attrPoints <= 0 || currentValue >= baseValue + 3)) return;
    if (amount < 0 && currentValue <= baseValue) return;

    setAttrPoints((prev) => prev - amount);
    syncChar({ attributes: { ...char.attributes, [attr]: currentValue + amount } });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setAttrPoints(7);
        setChar(
          Game.completeCharacter({
            id: "",
            ownerId,
            name: "",
            race: "human",
            level: 1,
            xp: 0,
            hp: 10,
            attributes: { ...Game.INFO.RACES.human.starting },
            inventory: [],
          })
        );
        setOpen(e);
      }}
    >
      <Dialog.Trigger asChild>
        <Button variant="outline">
          <Plus /> Create Character
        </Button>
      </Dialog.Trigger>

      <Dialog.Content className="flex flex-col gap-6">
        <Dialog.Title>Forge Your Hero</Dialog.Title>
        <Dialog.Description className="-mt-6">
          Allocate 7 points (max +3 per attribute).
        </Dialog.Description>

        <div className="-mt-6 flex flex-col gap-4">
          <div className="flex gap-4">
            <Input
              className="grow"
              value={char.name}
              onChange={(e) => setChar({ ...char, name: e.target.value })}
              placeholder="CHARACTER NAME"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setChar({ ...char, name: Game.generateRandomName(char) })}
            >
              <Dices className="h-4 w-4" />
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

        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-xl">Attributes</span>
          <span className="text-muted-foreground text-sm">Points remaining: {attrPoints}</span>
        </div>

        {Game.KEYS.ATTRIBUTES.map((attr) => {
          const base = Game.INFO.RACES[char.race].starting[attr];
          const current = char.attributes[attr];
          return (
            <div
              key={attr}
              className="group flex items-center justify-between"
              onMouseEnter={() => setHoveredAttr(attr)}
            >
              <span className="group-hover:text-foreground text-muted text-lg font-black capitalize transition-colors">
                {Game.INFO.ATTRIBUTES[attr].name}
              </span>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={current <= base}
                  onClick={() => modifyAttribute(attr, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-6 text-center text-xl">{current}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={attrPoints === 0 || current >= base + 3}
                  onClick={() => modifyAttribute(attr, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}

        <Dialog.Footer className="flex flex-col gap-4 sm:flex-col">
          <Card className="mt-3 min-h-28 text-center">
            <h3 className="text-lg font-black uppercase">
              {Game.INFO.ATTRIBUTES[hoveredAttr].name}
            </h3>
            <p className="leading-tight font-medium opacity-70">
              {Game.INFO.ATTRIBUTES[hoveredAttr].description}
            </p>
          </Card>

          <Card className="grid grid-cols-2 gap-x-6 gap-y-2 p-4 text-lg">
            <div className="flex justify-between">
              <span className="opacity-60">Health</span> <span>{char.maxHp}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">Actions</span> <span>{char.maxActions}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">Stamina</span> <span>{char.stamina}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">Carry Cap.</span> <span>{char.maxWeight} kg</span>
            </div>
          </Card>

          <Button
            disabled={char.name.length === 0 || attrPoints !== 0}
            className="w-full py-6 text-lg"
            onClick={handleCreate}
          >
            {attrPoints > 0
              ? `${attrPoints} Points Left`
              : char.name.length === 0
                ? "Enter Name"
                : "Begin Quest"}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
