"use client";

import { Helper } from "@/lib/helper";
import { Game } from "@/types/game";
import React from "react";
import { Button } from "../ui/button";
import { ResponsiveDialog } from "../ui/responsive-dialog";
import { UpdateCharacterAttributes } from "./update-character-attributes";
import { UpdateCharacterVisage } from "./update-character-name";
import { UpdateCharacterRace } from "./update-character-race";

export const CharacterCreator = () => {
  const [char, setChar] = React.useState(Helper.DEFAULT_CHARACTER);
  const [stage, setStage] = React.useState(-1);
  const save = (c: Game.Character) => {
    setStage((p) => p + 1);
    setChar(c);
  };

  return (
    <ResponsiveDialog
      trigger={<Button>Create character</Button>}
      asChild
      title="Create character"
      description="Who are you?"
      className="select-none"
      open={stage !== -1}
      onOpenChange={(e) => {
        if (e) {
          setChar(Helper.DEFAULT_CHARACTER);
          setStage(0);
        } else {
          setStage(-1);
        }
      }}
    >
      {stage === 0 && <UpdateCharacterRace initial={char} save={save} />}
      {stage === 1 && <UpdateCharacterAttributes initial={char} save={save} difference={3} />}
      {stage === 2 && <UpdateCharacterVisage initial={char} save={save} />}
    </ResponsiveDialog>
  );
};
