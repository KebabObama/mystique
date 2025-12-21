"use client";

import { Button } from "@/components/ui/button";
import { Helper } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { Game } from "@/types/game";
import Image from "next/image";
import React from "react";
import { Border } from "../ui/border";

type Props = { initial: Game.Character; save(c: Game.Character): void; className?: string };

export const UpdateCharacterRace = ({ initial, save, className }: Props) => {
  const [char, setChar] = React.useState(initial);
  return (
    <section className={cn("flex flex-col gap-6", className)}>
      <div className="mx-auto flex w-full gap-6 lg:w-3/4" id="race">
        {Game.KEYS.RACES.map((race) => (
          <button
            key={race}
            className="relative aspect-9/14 w-full scale-100"
            onClick={() => setChar({ ...char, race })}
          >
            <Image
              src={`/classes/${race}.png`}
              alt={race}
              fill
              draggable={false}
              preload
              priority={false}
            />
            {char.race === race && <Border />}
          </button>
        ))}
      </div>
      <div className="mx-auto flex flex-col text-center capitalize lg:w-3/4">
        <h1 className="text-xl">{char.race}</h1>
        <span className="">{Game.INFO.RACES[char.race].description}</span>
      </div>
      <Button onClick={() => save(Helper.updateByRace(char))}>Next</Button>
    </section>
  );
};
