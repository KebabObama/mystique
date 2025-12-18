import { Button } from "@/components/ui/button";
import { ATTRIBUTES, type Attribute, type Character } from "@/types/game";
import { Slot } from "@radix-ui/react-slot";
import React from "react";

export const _Attributes = ({
  character,
  setCharacter,
  points = 12,
  setCan,
}: {
  character: Character;
  setCharacter: (ch: Character) => void;
  points?: number;
  setCan: (b: boolean) => void;
}) => {
  const [current, setCurrent] = React.useState<number>(0);
  const [hovered, setHovered] = React.useState<Attribute>("str");
  const base = React.useRef(character).current.attributes;

  const updateAttribute = (key: Attribute, delta: number) => {
    const newVal = character.attributes[key] + delta;
    if (newVal < base[key] || newVal > base[key] + 8) return;
    setCharacter({
      ...character,
      attributes: { ...character.attributes, [key]: newVal },
    });
    const newCurrent = current + delta;
    setCurrent(newCurrent);
    setCan(newCurrent === points);
  };

  return (
    <section className="flex flex-col gap-6 p-4 text-center text-xl">
      Allocate all points: ({current}/{points})
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {(Object.keys(ATTRIBUTES) as Attribute[]).map((key) => {
          const attr = character.attributes[key];
          return (
            <Slot
              className="flex flex-row items-center justify-between px-9 py-6 text-lg capitalize"
              key={key}
              onMouseOver={() => setHovered(key)}
            >
              {key}
              <div className="flex gap-3">
                <Button
                  disabled={character.attributes[key] <= base[key]}
                  onClick={() => updateAttribute(key, -1)}
                  size="icon"
                  variant="outline"
                >
                  -
                </Button>
                {attr}
                <Button
                  disabled={character.attributes[key] >= base[key] + 8 || current === points}
                  onClick={() => updateAttribute(key, 1)}
                  size="icon"
                  variant="outline"
                >
                  +
                </Button>
              </div>
            </Slot>
          );
        })}
      </div>
      <div className="flex flex-col text-center">
        <div className="relative text-lg">
          {(Object.keys(ATTRIBUTES) as (keyof typeof ATTRIBUTES)[]).map((attr) => (
            <span
              className={`inset-0 transition-opacity duration-300 ${hovered === attr ? "opacity-100" : "absolute opacity-0"}`}
              key={attr}
            >
              {ATTRIBUTES[attr].name}
            </span>
          ))}
        </div>
        <div className="text-muted-foreground relative min-h-12 text-base">
          {(Object.keys(ATTRIBUTES) as (keyof typeof ATTRIBUTES)[]).map((attr) => (
            <span
              className={`absolute inset-0 transition-opacity duration-300 ${hovered === attr ? "opacity-100" : "opacity-0"}`}
              key={attr}
            >
              {ATTRIBUTES[attr].description}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
