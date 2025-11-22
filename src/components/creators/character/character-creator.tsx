"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { mod } from "@/lib/utils";
import { Attribute, Attributes, ATTRIBUTES, Character, CLASSES, RACES } from "@/types/game";
import React from "react";
import { _Attributes } from "./attributes";
import { _Class } from "./class";
import { _Name } from "./name";
import { _Race } from "./race";
import { _Summary } from "./summary";

const def: Character = {
  name: "",
  level: 1,
  class: "wizard",
  race: "human",
  effects: {
    corroding: 0,
    frostbite: 0,
    burning: 0,
    shocked: 0,
    bleeding: 0,
    toxin: 0,
    smitten: 0,
    hastened: 0,
    fortified: 0,
    weakened: 0,
    regenerating: 0,
    energized: 0,
    shielded: 0,
    enraged: 0,
    focused: 0,
    confused: 0,
    fastened: 0,
    slowed: 0,
    stunned: 0,
  },
  attributes: { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 },
  health: [6, 6],
  stamina: [10, 10],
  actions: [1, 1],
  resource: [3, 3],
  resistances: { acid: 0, cold: 0, fire: 0, lightning: 0, physical: 0, poison: 0, radiant: 0 },
  inventory: [],
  abilities: [],
  weight: [0, 0],
  equipment: {},
};

enum STEPS {
  "hidden",
  "Who are you?",
  "Choose your path",
  "Assign attributes",
  "Name yourself",
  "Is this you?",
}

export const calculateAttributes = (base: Attributes, bonuses: Attributes, extra = 0) => {
  const keys = Object.keys(ATTRIBUTES) as Attribute[];
  return Object.fromEntries(keys.map((key) => [key, base[key] + bonuses[key] + extra])) as Attributes;
};

export const CharacterCreator = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = React.useState<STEPS>(0);
  const [can, setCan] = React.useState<boolean>(true);
  const [character, setCharacter] = React.useState<Character>(def);

  const SCREENS: Record<STEPS, React.ReactNode | null> = {
    [STEPS["hidden"]]: null,
    [STEPS["Who are you?"]]: <_Race character={character} setCharacter={setCharacter} setCan={setCan} />,
    [STEPS["Choose your path"]]: <_Class character={character} setCharacter={setCharacter} setCan={setCan} />,
    [STEPS["Assign attributes"]]: <_Attributes character={character} setCharacter={setCharacter} setCan={setCan} />,
    [STEPS["Name yourself"]]: <_Name character={character} setCharacter={setCharacter} setCan={setCan} />,
    [STEPS["Is this you?"]]: <_Summary character={character} setCharacter={setCharacter} setCan={setCan} />,
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
      case STEPS["Name yourself"]:
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
      trigger={<Button onClick={() => setStep(1)}>{children}</Button>}
      title={STEPS[step]}
      description=""
      open={step !== 0}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setStep(0);
          setCharacter(def);
          setCan(true);
        }
      }}
      className="min-w-md md:min-w-3xl lg:min-w-4xl"
      footer={
        <Button onClick={next} size="sm" disabled={!can}>
          {step === STEPS["Is this you?"] ? "Finish" : "Next"}
        </Button>
      }
    >
      <div className="h-full max-h-140 overflow-auto px-2 py-4">{SCREENS[step]}</div>
    </ResponsiveDialog>
  );
};
