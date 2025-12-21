"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { mod } from "@/lib/utils";
import {
  ATTRIBUTES,
  CLASSES,
  RACES,
  type Attribute,
  type Attributes,
  type Character,
} from "@/types/game";
import React from "react";
import { _Attributes } from "./attributes";
import { _Class } from "./class";
import { _Name } from "./name";
import { _Race } from "./race";
import { _Summary } from "./summary";

enum STEPS {
  hidden,
  "Who are you?",
  "Choose your path",
  "Assign attributes",
  "Name yourself",
  "Is this you?",
}

export const calculateAttributes = (base: Attributes, bonuses: Attributes, extra = 0) => {
  const keys = Object.keys(ATTRIBUTES) as Attribute[];
  return Object.fromEntries(
    keys.map((key) => [key, base[key] + bonuses[key] + extra])
  ) as Attributes;
};

export const CharacterCreator = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = React.useState<STEPS>(0);
  const [can, setCan] = React.useState<boolean>(true);
  const [character, setCharacter] = React.useState<Character>(def);

  const SCREENS: Record<STEPS, React.ReactNode | null> = {
    [STEPS.hidden]: null,
    [STEPS["Who are you?"]]: (
      <_Race character={character} setCan={setCan} setCharacter={setCharacter} />
    ),
    [STEPS["Choose your path"]]: (
      <_Class character={character} setCan={setCan} setCharacter={setCharacter} />
    ),
    [STEPS["Assign attributes"]]: (
      <_Attributes character={character} setCan={setCan} setCharacter={setCharacter} />
    ),
    [STEPS["Name yourself"]]: (
      <_Name character={character} setCan={setCan} setCharacter={setCharacter} />
    ),
    [STEPS["Is this you?"]]: (
      <_Summary character={character} setCan={setCan} setCharacter={setCharacter} />
    ),
  };

  const next = () => {
    switch (step) {
      case STEPS["Choose your path"]:
      case STEPS["Assign attributes"]:
        setCharacter({
          ...character,
          attributes: calculateAttributes(character.attributes, RACES[character.race].bonuses),
        });
        setCan(false);
        break;
      case STEPS["Name yourself"]: {
        const health = CLASSES[character.class].hp + mod(character.attributes.con);
        const stamina = RACES[character.race].stamina + mod(character.attributes.dex);
        const resource = CLASSES[character.class].resource.first;

        setCharacter({
          ...character,
          health: [health, health],
          stamina: [stamina, stamina],
          actions: [1, 1],
          resource: [resource, resource],
        });

        break;
      }
      case STEPS["Is this you?"]:
        console.log(character);
        setStep(0);
        return;
    }
    setStep(step + 1);
  };

  return (
    <ResponsiveDialog
      asChild
      className="min-w-md md:min-w-3xl lg:min-w-4xl"
      description=""
      footer={
        <Button disabled={!can} onClick={next} size="sm">
          {step === STEPS["Is this you?"] ? "Finish" : "Next"}
        </Button>
      }
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setStep(0);
          setCharacter(def);
          setCan(true);
        }
      }}
      open={step !== 0}
      title={STEPS[step]}
      trigger={<Button onClick={() => setStep(1)}>{children}</Button>}
    >
      <div className="h-full max-h-140 overflow-auto px-2 py-4">{SCREENS[step]}</div>
    </ResponsiveDialog>
  );
};
