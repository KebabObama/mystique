"use client";

import { Helper } from "@/lib/helper";
import { Game } from "@/types/game";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";

type Props = {
  initial: Game.Character;
  save(c: Game.Character): void;
  difference?: number;
  className?: string;
};

export const UpdateCharacterAttributes = ({ initial, save, className, difference }: Props) => {
  const [char, setChar] = useState<Game.Character>(initial);

  const change = (attr: Game.Attribute, amount: number) => {
    if (char.points === 0 && amount > 0) return;
    setChar((p) => ({
      ...p,
      points: p.points - amount,
      attributes: { ...p.attributes, [attr]: p.attributes[attr] + amount },
    }));
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {Game.KEYS.ATTRIBUTES.map((key) => (
          <div className="grid grid-cols-[1fr_1rem_8rem] items-center justify-center" key={key}>
            <span className="text-xl font-bold capitalize">{Game.INFO.ATTRIBUTES[key].name}:</span>
            <span className="text-xl font-bold">{char.attributes[key]}</span>
            <div className="flex flex-row justify-end gap-6">
              <Button
                onClick={() => change(key, -1)}
                size="icon"
                disabled={initial.attributes[key] >= char.attributes[key]}
              >
                <Minus />
              </Button>
              <Button
                onClick={() => change(key, +1)}
                size="icon"
                disabled={
                  initial.attributes[key] + (difference ?? Infinity) <= char.attributes[key] ||
                  !char.points
                }
              >
                <Plus />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog.Footer>
        <Button
          className="w-full"
          onClick={() => save(Helper.updateByAttributes(char))}
          disabled={char.points != 0}
        >
          {char.points ? `Points remaining: ${char.points}` : "Next"}
        </Button>
      </Dialog.Footer>
    </>
  );
};
