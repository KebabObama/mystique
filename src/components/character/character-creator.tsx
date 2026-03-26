"use client";

import { toast } from "@/components/layout/toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/hooks/use-user";
import { createCharacter, getAllItems } from "@/lib/character-actions";
import { Game } from "@/lib/game";
import { InGameHelpers } from "@/lib/ingame-helpers";
import { Coins, Dices, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import React from "react";

/** Renders the character creator component. */
export const CharacterCreator = () => {
  const ownerId = useUser((s) => s?.id) as string;
  const createInitialChar = () => {
    const attributes = { ...Game.STARTING_RACES.human };
    const stats = InGameHelpers.calculateCharacterStats({ attributes, level: 1, memory: 0 });
    return {
      id: "",
      ownerId,
      coins: 100,
      name: "",
      memory: 0,
      race: "human" as const,
      level: 1,
      xp: 0,
      hp: stats.maxHp,
      attributes,
      inventory: [],
      ...stats,
    } as unknown as Game.Character;
  };
  const [char, setChar] = React.useState<Game.Character>(createInitialChar);

  const handleCreate = async () => {
    const { error, success } = await createCharacter(ownerId, char);
    if (!success) {
      toast.error(error || "Failed to create character");
      return;
    }
    toast.success("Character forged!");
    setOpen(false);
  };

  const [attrPoints, setAttrPoints] = React.useState<number>(7);
  const [hoveredAttr, setHoveredAttr] = React.useState<Game.Attribute>("strength");
  const [open, setOpen] = React.useState(false);
  const [allItems, setAllItems] = React.useState<any[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<Map<string, number>>(new Map());
  const [coins, setCoins] = React.useState(100);

  const fetchItems = async () => {
    try {
      const result = await getAllItems();
      if (result.success) {
        setAllItems(result.items);
      }
    } catch {
      toast.error("Failed to load items");
    }
  };

  React.useEffect(() => {
    if (open) {
      fetchItems();
    }
  }, [open]);

  const buyItem = (itemId: string, itemCost: number) => {
    if (coins >= itemCost) {
      setCoins(coins - itemCost);
      setSelectedItems((prev) => {
        const newMap = new Map(prev);
        const current = newMap.get(itemId) || 0;
        newMap.set(itemId, current + 1);
        return newMap;
      });
    } else {
      toast.error("Not enough coins!");
    }
  };

  const removeBoughtItem = (itemId: string, itemCost: number) => {
    const quantity = selectedItems.get(itemId) || 0;
    if (quantity > 0) {
      setCoins(coins + itemCost);
      const newMap = new Map(selectedItems);
      if (quantity === 1) {
        newMap.delete(itemId);
      } else {
        newMap.set(itemId, quantity - 1);
      }
      setSelectedItems(newMap);
    }
  };

  const syncChar = (updatedFields: Partial<Game.Character>) => {
    const updated = { ...char, ...updatedFields } as Game.Character;
    const stats = InGameHelpers.calculateCharacterStats(updated, { weight: 0, armor: 0 });
    setChar({ ...updated, ...stats });
  };

  const handleRaceChange = (race: Game.Race) => {
    const newBase = Game.STARTING_RACES[race];
    setAttrPoints(7);
    syncChar({ race, attributes: { ...newBase } });
  };

  const modifyAttribute = (attr: Game.Attribute, amount: number) => {
    const baseValue = Game.STARTING_RACES[char.race][attr];
    const currentValue = char.attributes[attr];

    if (amount > 0 && (attrPoints <= 0 || currentValue >= baseValue + 3)) return;
    if (amount < 0 && currentValue <= baseValue) return;

    setAttrPoints((prev) => prev - amount);
    syncChar({ attributes: { ...char.attributes, [attr]: currentValue + amount } });
  };

  return (
    <Dialog
      fullscreen={true}
      open={open}
      onOpenChange={(e) => {
        setAttrPoints(7);
        setChar(createInitialChar());
        setSelectedItems(new Map());
        setCoins(100);
        setOpen(e);
      }}
    >
      <Dialog.Trigger asChild>
        <Button variant="outline" className="w-full">
          <Plus /> Character
        </Button>
      </Dialog.Trigger>

      <Dialog.Content className="flex flex-col gap-0 p-0">
        <div className="grid flex-1 grid-cols-2 gap-0 overflow-hidden">
          <div className="flex flex-col gap-6 overflow-x-hidden overflow-y-auto border-r-6 p-6">
            <div>
              <Dialog.Title>Forge Your Hero</Dialog.Title>
              <Dialog.Description className="mt-2">
                Allocate 7 points (max +3 per attribute).
              </Dialog.Description>
            </div>

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
                onClick={() => setChar({ ...char, name: InGameHelpers.generateRandomName(char) })}
              >
                <Dices className="h-4 w-4" />
              </Button>
            </div>

            <Select value={char.race} onValueChange={handleRaceChange}>
              <SelectTrigger>
                <SelectValue placeholder="CHOOSE RACE" />
              </SelectTrigger>
              <SelectContent>
                {Game.RACES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xl">Attributes</span>
              <span className="text-muted-foreground text-sm">Points remaining: {attrPoints}</span>
            </div>

            {Game.ATTRIBUTES.map((attr) => {
              const base = Game.STARTING_RACES[char.race][attr];
              const current = char.attributes[attr];
              return (
                <div
                  key={attr}
                  className="group flex items-center justify-between"
                  onMouseEnter={() => setHoveredAttr(attr)}
                >
                  <span className="group-hover:text-foreground text-muted text-lg font-black capitalize transition-colors">
                    {attr}
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

            <Card className="mt-3 min-h-28 text-center">
              <h3 className="text-lg font-black uppercase">{hoveredAttr}</h3>
              <p className="leading-tight font-medium opacity-70">
                {Game.ATTRIBUTE_DESCRIPTION[hoveredAttr]}
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
              className="mt-auto w-full py-6 text-lg"
              onClick={handleCreate}
            >
              {attrPoints > 0
                ? `${attrPoints} Points Left`
                : char.name.length === 0
                  ? "Enter Name"
                  : "Begin Quest"}
            </Button>
          </div>

          <div className="flex flex-col gap-4 overflow-x-hidden overflow-y-auto">
            <div className="bg-card sticky top-0 z-5 px-6 py-3">
              <h2 className="text-2xl font-black">Starting Store</h2>
              <p className="text-muted-foreground text-sm">Coins: {coins}</p>
            </div>

            <div className="flex-1 space-y-6 px-6 py-3">
              {allItems.map((item: any) => {
                const boughtQty = selectedItems.get(item.id) || 0;
                return (
                  <Card key={item.id} className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-muted-foreground text-sm">{item.type}</p>
                        <p className="mt-1 flex gap-1.5 text-lg font-black text-yellow-500">
                          {item.value} <Coins />
                        </p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Button
                          size="sm"
                          variant="default"
                          disabled={coins < item.value}
                          onClick={() => buyItem(item.id, item.value)}
                          className="whitespace-nowrap"
                        >
                          <ShoppingCart className="mr-1 h-3 w-3" />
                          Buy
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => removeBoughtItem(item.id, item.value)}
                          hidden={boughtQty === 0}
                        >
                          <Trash2 />
                          <span className="font-bold">{boughtQty}x</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};
