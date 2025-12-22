"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Helper } from "@/lib/helper";
import type { Game } from "@/types/game";
import { Shuffle } from "lucide-react";
import React from "react";
import { Border } from "../ui/border";
import { Dialog } from "../ui/dialog";
import { Slider } from "../ui/slider";

type Props = { initial: Game.Character; save(c: Game.Character): void };

export const UpdateCharacterVisage = ({ initial, save }: Props) => {
  const [char, setChar] = React.useState(initial);
  return (
    <>
      <div className="mb-6 flex gap-6">
        <Input
          autoFocus
          className="grow"
          onChange={(e) => setChar({ ...char, name: e.target.value })}
          placeholder="Enter character name..."
          type="text"
          value={char.name}
        />
        <Button
          onClick={() => setChar({ ...char, name: Helper.generateRandomName(char) })}
          size="icon"
          type="button"
        >
          <Shuffle className="size-4" />
        </Button>
      </div>
      <div className="relative h-full w-full p-3">
        <Border />
        <div className="flex gap-3 font-semibold">
          Variant:
          <Slider
            max={4}
            min={0}
            step={1}
            value={[char.mesh]}
            className="md:w-1/4"
            onValueChange={(e) => setChar({ ...char, mesh: e[0] })}
          />
        </div>
      </div>
      <Dialog.Footer>
        <Button onClick={() => save(char)} disabled={char.name.length === 0}>
          Next
        </Button>
      </Dialog.Footer>
    </>
  );
};
