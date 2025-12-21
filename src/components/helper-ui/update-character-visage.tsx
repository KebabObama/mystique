"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Helper } from "@/lib/helper";
import { cn } from "@/lib/utils";
import type { Game } from "@/types/game";
import { Shuffle } from "lucide-react";
import React from "react";
import { Border } from "../ui/border";
import { Slider } from "../ui/slider";

type Props = { initial: Game.Character; save(c: Game.Character): void; className?: string };

export const UpdateCharacterVisage = ({ initial, save, className }: Props) => {
  const [char, setChar] = React.useState(initial);
  return (
    <section className={cn("flex flex-col gap-6", className)}>
      <div className="flex gap-6">
        <Input
          autoFocus
          className="grow"
          onChange={(e) => setChar({ ...char, name: e.target.name })}
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
      <div className="relative aspect-3/2 w-full md:aspect-square lg:aspect-3/2 xl:aspect-7/4">
        <Border />
        <span>Variant: </span>
        <Slider />
      </div>
      <Button onClick={() => save(char)} disabled={char.name.length === 0}>
        Next
      </Button>
    </section>
  );
};
