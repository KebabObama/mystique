"use client";

import { Helper } from "@/lib/helper";
import { Game } from "@/types/game";
import React from "react";
import { Mounted } from "../layout/mounted";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { UpdateCharacterAttributes } from "./update-character-attributes";
import { UpdateCharacterRace } from "./update-character-race";
import { UpdateCharacterVisage } from "./update-character-visage";

export const CharacterCreator = () => {
  const [char, setChar] = React.useState(Helper.DEFAULT_CHARACTER);
  const [stage, setStage] = React.useState(-1);

  const save = (c: Game.Character) => {
    setStage((p) => p + 1);
    setChar(c);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setChar(Helper.DEFAULT_CHARACTER);
      setStage(0);
    } else setStage(-1);
  };

  const getStepTitle = () => {
    switch (stage) {
      case 0:
        return "Choose your origin";
      case 1:
        return "Define your skills";
      case 2:
        return "Finalize details";
      default:
        return "Create character";
    }
  };

  return (
    <Mounted>
      <Dialog.Root open={stage !== -1} onOpenChange={handleOpenChange} fullscreen>
        <Dialog.Trigger asChild>
          <Button>Create character</Button>
        </Dialog.Trigger>
        <Dialog.Content className="select-none">
          <Dialog.Title>{getStepTitle()}</Dialog.Title>
          <Dialog.Description>Step {stage + 1} of 3 — Who are you?</Dialog.Description>
          {stage === 0 && <UpdateCharacterRace initial={char} save={save} />}
          {stage === 1 && <UpdateCharacterAttributes initial={char} save={save} difference={3} />}
          {stage === 2 && <UpdateCharacterVisage initial={char} save={save} />}
        </Dialog.Content>
      </Dialog.Root>
    </Mounted>
  );
};
