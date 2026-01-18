"use client";

import type { Game } from "@/lib/game";
import type React from "react";
import { Dialog } from "../ui/dialog";

type CharacterInventoryProps = {
  character: Game.Character;
  children: React.ReactNode;
  asChild?: boolean;
};

export const CharacterInventory = ({ character, children, asChild }: CharacterInventoryProps) => {
  return (
    <Dialog>
      <Dialog.Trigger asChild={asChild}>{children}</Dialog.Trigger>
      <Dialog.Content className="h-[90vh]">
        <Dialog.Title>{character.name}'s Inventory</Dialog.Title>
        <Dialog.Description>
          Weight: {character.weight} / {character.maxWeight}
        </Dialog.Description>
      </Dialog.Content>
    </Dialog>
  );
};

