import { Button } from "@/components/ui/button";
import { useCharacterStore } from "@/hooks/use-create-character";
import { Character } from "@/types/game";
import { ATTRIBUTES } from "@/types/game/consts";
import React from "react";

export const ATTRIBUTE_INFO: Record<
  keyof Character["attributes"],
  { name: string; description: string }
> = {
  str: {
    name: "Strength",
    description:
      "Physical power and athletic prowess. Affects melee attacks and carrying capacity.",
  },
  dex: {
    name: "Dexterity",
    description:
      "Agility, reflexes, and balance. Influences armor class, initiative, and ranged attacks.",
  },
  con: {
    name: "Constitution",
    description:
      "Endurance and stamina. Determines hit points and resistance to physical hardship.",
  },
  int: {
    name: "Intelligence",
    description:
      "Reasoning and memory. Governs arcane spellcasting and knowledge skills.",
  },
  wis: {
    name: "Wisdom",
    description:
      "Awareness and insight. Powers divine magic and perception abilities.",
  },
  cha: {
    name: "Charisma",
    description:
      "Force of personality and leadership. Affects social interactions and certain spells.",
  },
};

export const _Attributes = ({ points = 18 }: { points?: number }) => {
  const store = useCharacterStore();
  const [current, setCurrent] = React.useState<number>(0);
  const [hovered, setHovered] =
    React.useState<keyof Character["attributes"]>("str");

  return (
    <section className="flex flex-col gap-6 p-4 text-center text-xl">
      Allocate all points: ({current}/{points})
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {ATTRIBUTES.map((e) => {
          const attr = store.character.attributes[e];
          return (
            <div
              key={e}
              className="flex flex-row items-center justify-between px-9 py-6 text-lg capitalize"
              onMouseOver={() => setHovered(e)}
            >
              {e}
              <div className="flex gap-3">
                <Button
                  size="icon"
                  variant={"outline"}
                  disabled={attr <= 8}
                  className="scale-80"
                  onClick={() => {
                    store.setCan(false);
                    store.setAttribute(e, attr - 1);
                    setCurrent((p) => p - 1);
                  }}
                >
                  -
                </Button>
                <p>{attr}</p>
                <Button
                  size="icon"
                  variant={"outline"}
                  disabled={attr >= 20 || points === current}
                  className="scale-80"
                  onClick={() => {
                    if (current + 1 === points) store.setCan(true);
                    store.setAttribute(e, attr + 1);
                    setCurrent((p) => p + 1);
                  }}
                >
                  +
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col text-center">
        <div className="relative text-lg">
          {ATTRIBUTES.map((attr) => (
            <span
              key={attr}
              className={`inset-0 transition-opacity duration-300 ${hovered === attr ? "opacity-100" : "absolute opacity-0"}`}
            >
              {ATTRIBUTE_INFO[attr].name}
            </span>
          ))}
        </div>
        <div className="text-muted-foreground relative min-h-12 text-base">
          {ATTRIBUTES.map((attr) => (
            <span
              key={attr}
              className={`absolute inset-0 transition-opacity duration-300 ${hovered === attr ? "opacity-100" : "opacity-0"}`}
            >
              {ATTRIBUTE_INFO[attr].description}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
