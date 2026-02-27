"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Game } from "@/lib/game";
import { useGame } from "@/lib/hooks/use-game";

type AddCharacterProps = { characters: Partial<Game.Character>[]; children?: React.ReactNode };

export const AddCharacter = ({ characters, children }: AddCharacterProps) => {
  const send = useGame((s) => s.send);
  const entities = useGame((s) => s.instance?.entities);

  if (!entities) return;

  const onAdd = (characterId: string) => {
    send("character:add", characterId);
  };

  const chars = characters.filter(
    (c) => !entities.some((d) => d.type === "character" && d.playable.id === c.id)
  );

  return (
    <Dialog>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Select a Character</Dialog.Title>
        <Dialog.Description></Dialog.Description>

        <div className="flex flex-col gap-2">
          {!chars.length ? (
            <>You do not have any characters. Return to dashboard in order to create one.</>
          ) : (
            chars.map((c) => (
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
