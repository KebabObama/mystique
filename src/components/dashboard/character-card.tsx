"use client";

import { CharacterDashboard } from "@/components/character/character-dashboard";
import { CharacterDelete } from "@/components/character/character-delete";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CharacterWithLobby } from "@/lib/dashboard";
import { Info, Trash } from "lucide-react";

type CharacterCardProps = { character: CharacterWithLobby };

/** Renders the character card component. */
export const CharacterCard = ({ character }: CharacterCardProps) => {
  return (
    <Card className="flex h-full flex-col">
      <h1 className="text-lg">{character.name}</h1>
      <div className="flex flex-row justify-between">
        <p className="text-muted">
          Race: <span className="text-foreground capitalize">{character.race}</span>
        </p>
        <p className="text-muted">
          Level: <span className="text-foreground">{character.level}</span>
        </p>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-6 p-1.5 pt-4.5">
        <CharacterDelete character={character} asChild>
          <Button className="w-full" size={"sm"} variant={"destructive"}>
            <Trash />
          </Button>
        </CharacterDelete>
        <CharacterDashboard character={character} asChild>
          <Button className="w-full" size={"sm"}>
            <Info />
          </Button>
        </CharacterDashboard>
      </div>
    </Card>
  );
};
