"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useGame } from "@/hooks/use-game";
import { Game } from "@/lib/game";
import { Plus } from "lucide-react";

type AddCharacterProps = { characters: Omit<Game.Character, "inventory">[] };

/** Renders the add character component. */
export const AddCharacter = ({ characters }: AddCharacterProps) => {
  const send = useGame((s) => s.send);
  const entities = useGame((s) => s.instance?.characters);
  if (!entities) return;

  const availableChars = characters.filter(
    (c) => !entities.some((entry) => entry.characterId === c.id)
  );

  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button size="sm" className="h-8">
          <Plus /> Add
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Select a Character</Dialog.Title>
        <Dialog.Description>
          Add any of your characters that are not already in this lobby.
        </Dialog.Description>

        <div className="flex flex-col gap-2">
          {!availableChars.length ? (
            <p className="text-muted text-sm">
              All of your characters are already in this lobby. Return to dashboard to create a new
              one.
            </p>
          ) : (
            availableChars.map((c) => (
              <Button
                key={c.id}
                variant="outline"
                className="justify-between"
                onClick={() => send("character:add", c.id)}
              >
                <span>{c.name}</span>
                <span className="text-xs opacity-60">
                  {c.race} · Lv {c.level}
                </span>
              </Button>
            ))
          )}
        </div>
      </Dialog.Content>
    </Dialog>
  );
};
