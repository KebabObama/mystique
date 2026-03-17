"use client";

import { toast } from "@/components/layout/toast";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteCharacter } from "@/lib/character-actions";
import { Game } from "@/lib/game";
import React from "react";

type CharacaterDeleteProps = {
  character: Game.Character;
  children: React.ReactNode;
  asChild?: boolean;
};

/** Renders the character delete component. */
export const CharacterDelete = ({ character, children, asChild }: CharacaterDeleteProps) => {
  const [confirm, setConfirm] = React.useState("");
  const handle = async () => {
    const { error } = await deleteCharacter(character.id);
    if (!error) toast.success("Character successfully deleted.");
    else toast.error(error);
  };
  return (
    <Dialog>
      <Dialog.Trigger asChild={asChild}>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Delete character</Dialog.Title>
        <Dialog.Description>
          In order to delete character write "{character.name}".
        </Dialog.Description>
        <Input type="text" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <Dialog.Footer>
          <Button
            disabled={confirm.length === 0 && confirm === character.name}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handle();
              }
            }}
            onClick={handle}
          >
            DELETE
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
