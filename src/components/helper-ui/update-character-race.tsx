"use client";

import { Helper } from "@/lib/helper";
import { Game } from "@/types/game";
import Image from "next/image";
import React from "react";
import { Border } from "../ui/border";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";

type Props = { initial: Game.Character; save(c: Game.Character): void };

export const UpdateCharacterRace = ({ initial, save }: Props) => {
  const [char, setChar] = React.useState(initial);
  const [hovered, setHovered] = React.useState<Game.Race>(initial.race);
  return (
    <>
      <div className="mx-auto grid max-h-2/3 w-full grid-cols-2 gap-6 overflow-y-auto p-6 sm:grid-cols-3 md:mt-[20%] md:flex">
        {Game.KEYS.RACES.map((race) => (
          <button
            key={race}
            className="relative aspect-9/14 w-full"
            onClick={() => setChar({ ...char, race })}
            onMouseOver={() => setHovered(race)}
          >
            <Image
              src={`/classes/${race}.png`}
              alt={race}
              fill
              draggable={false}
              preload
              priority={false}
              sizes="100%"
              className={`zoom-in transition-transform duration-200 ${race === char.race ? "scale-110" : "hover:scale-110"}`}
            />
            {char.race === race && <Border />}
          </button>
        ))}
      </div>
      <Dialog.Footer className="flex flex-col gap-6">
        {Game.KEYS.RACES.map((e) => (
          <div
            key={e}
            className={`fade-in pointer-events-none absolute bottom-0 mb-30 flex max-h-fit min-h-32 flex-col overflow-y-auto p-6 text-center transition-all duration-200 md:mb-20 ${hovered === e ? "opacity-100" : "opacity-0"}`}
          >
            <h1 className="text-2xl font-bold capitalize">{e}</h1>
            <p className="text-muted leading-relaxed">{Game.INFO.RACES[e].description}</p>
            <div className="mt-3 grid grid-flow-col grid-rows-2 gap-y-1">
              {Game.KEYS.ATTRIBUTES.map((a) => (
                <React.Fragment key={a}>
                  <span className="row-start-1 font-semibold capitalize">{a}</span>
                  <span className="text-muted row-start-2">{Game.INFO.RACES[e].starting[a]}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
        <Button onClick={() => save(Helper.updateByRace(char))}>Confirm Race</Button>
      </Dialog.Footer>
    </>
  );
};
