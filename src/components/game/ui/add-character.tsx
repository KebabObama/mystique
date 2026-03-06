"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useGame } from "@/hooks/use-game";

type AddCharacterProps = {
  characters: { id: string; name: string; race: string; level: number; lobbyId: string | null }[];
  children?: React.ReactNode;
};

export const AddCharacter = ({ characters, children }: AddCharacterProps) => {
  const send = useGame((s) => s.send);
  const entities = useGame((s) => s.instance?.characters);

  if (!entities) return;

  const onAdd = (characterId: string) => {
    send("character:add", characterId);
  };

  // Filter out characters already in lobbies or already in this game
  const availableChars = characters.filter(
    (c) => !c.lobbyId && !entities.some((entry) => entry.id === c.id)
  );

  return (
    <Dialog>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Select a Character</Dialog.Title>
        <Dialog.Description>Only characters not in other lobbies can be added.</Dialog.Description>

        <div className="flex flex-col gap-2">
          {!availableChars.length ? (
            <p className="text-muted text-sm">
              You do not have any available characters. Characters in other lobbies cannot be added.
              Return to dashboard to create a new one.
            </p>
          ) : (
            availableChars.map((c) => (
              <Button
                key={c.id}
                variant="outline"
                className="justify-between"
                onClick={() => onAdd(c.id!)}
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
