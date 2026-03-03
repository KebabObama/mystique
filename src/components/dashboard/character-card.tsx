"use client";

import { CharacterDashboard } from "@/components/character/character-dashboard";
import { CharacterDelete } from "@/components/character/character-delete";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Game } from "@/lib/game";
import { Info, Trash } from "lucide-react";

type CharacterWithLobby = Game.Character & {
  lobby: { id: string; name: string; memberCount: number; members: string[] } | null;
};

type CharacterCardProps = { character: CharacterWithLobby };

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

      {character.lobby && (
        <div className="mt-2 border-t-2 pt-2">
          <p className="text-muted text-sm">
            Active Lobby: <span className="text-foreground">{character.lobby.name}</span>
          </p>
          <p className="text-muted text-sm">
            Members: <span className="text-foreground">{character.lobby.memberCount}</span>
          </p>
          <p className="text-muted truncate text-xs" title={character.lobby.members.join(", ")}>
            {character.lobby.members.join(", ")}
          </p>
        </div>
      )}

      {!character.lobby && (
        <div className="mt-2 border-t-2 pt-2">
          <p className="text-muted/50 text-sm italic">Not in any lobby</p>
        </div>
      )}

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
