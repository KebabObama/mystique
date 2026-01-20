"use client";

import { toast } from "@/components/layout/toast";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteCharacter } from "@/lib/character-actions";
import type { Game } from "@/lib/game";
import { redirect } from "next/navigation";
import React from "react";

type CharacaterDeleteProps = {
  character: Game.Character;
  children: React.ReactNode;
  asChild?: boolean;
};

export const CharacterDelete = ({ character, children, asChild }: CharacaterDeleteProps) => {
  const [confirm, setConfirm] = React.useState("");
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
            onClick={async () => {
              const { success, error } = await deleteCharacter(character.id);
              if (success && !error) redirect("/dashboard");
              else toast.error(error || "Error...");
            }}
          >
            DELETE
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
