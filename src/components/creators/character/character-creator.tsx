"use client";

import { toast } from "@/components/layout/toast";
import { Border } from "@/components/ui/border";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ResponsiveDialog from "@/components/ui/responsive-dialog";
import { useCharacterStore } from "@/hooks/use-create-character";
import type { Character } from "@/types/game";
import { ATTRIBUTES, CLASSES, RACES } from "@/types/game/consts";
import * as Lucide from "lucide-react";
import Image from "next/image";
import React from "react";

enum STEPS {
  "Who are you?",
  "Choose your path",
  "Assign attributes",
  "Name yourself",
  "Is this you?",
}

export const CharacterCreator = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [step, setStep] = React.useState<STEPS>(0);
  const store = useCharacterStore();

  const render = () => {
    switch (step) {
      case STEPS["Who are you?"]:
        return <_Race />;
      case STEPS["Choose your path"]:
        return <_Class />;
      case STEPS["Assign attributes"]:
        return <_Attributes />;
      case STEPS["Name yourself"]:
        return <_Name />;
      case STEPS["Is this you?"]:
        return <_Summary />;
    }
  };

  const next = () => {
    switch (step) {
      case STEPS["Assign attributes"] - 1:
      case STEPS["Name yourself"] - 1:
        store.setCan(false);
        break;
      case STEPS["Is this you?"]:
        toast.success("Character created successfully");
        console.log(store.character);
        setOpen(false);
        break;
    }
    setStep(step + 1);
  };

  return (
    <ResponsiveDialog
      trigger={children}
      title={STEPS[step]}
      description=""
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        setStep(0);
        store.reset();
      }}
      className="min-w-md md:min-w-3xl lg:min-w-4xl"
      footer={
        <Button onClick={next} size="sm" disabled={!store.can}>
          {step === STEPS["Is this you?"] ? "Finish" : "Next"}
        </Button>
      }
    >
      <div className="h-full max-h-140 overflow-auto px-2 py-4">{render()}</div>
    </ResponsiveDialog>
  );
};

const RACE_INFO: Record<Character["race"], { description: string }> = {
  dragonborn: {
    description:
      "Draconic ancestors grant these mighty beings a fearsome presence and breath weapons.",
  },
  dwarf: {
    description:
      "Sturdy and resilient, masters of stonecraft and renowned for their endurance in battle.",
  },
  elf: {
    description:
      "Graceful and long-lived, with keen senses and a deep connection to the natural world.",
  },
  human: {
    description:
      "Ambitious and versatile, humans adapt quickly and excel in any path they choose.",
  },
  orc: {
    description:
      "Powerful and fierce warriors with incredible strength and relentless determination.",
  },
  tiefling: {
    description:
      "Infernal heritage grants them cunning intellect and mysterious magical abilities.",
  },
};

const _Race = () => {
  const store = useCharacterStore();
  const selectedIndex = RACES.indexOf(store.character.race);

  return (
    <section className="flex flex-col gap-9 pt-1.5 md:px-4">
      <div className="flex w-full flex-row gap-2.5 md:gap-6">
        {RACES.map((e, i) => {
          const scale = 1.2 - Math.abs(i - selectedIndex) * 0.05;
          const isSelected = store.character.race === e;
          return (
            <button
              type="button"
              onClick={() => store.set("race", e)}
              key={e}
              style={{ transform: `scale(${scale})`, margin: `0% ${scale}%` }}
              className={`group border-border/20 relative aspect-9/16 basis-full overflow-visible border-2 transition-all duration-300 ${isSelected ? "" : "hover:border-border grayscale-100 hover:scale-105 hover:grayscale-50"}`}
            >
              {isSelected && <Border />}
              <Image
                src={`/classes/${e}.png`}
                alt={e}
                fill
                sizes="100%"
                loading="lazy"
                fetchPriority="low"
                draggable={false}
                className="object-contain transition-all duration-300"
              />
            </button>
          );
        })}
      </div>
      <div className="flex flex-col text-center">
        <span className="text-lg">
          {store.character.race.slice(0, 1).toUpperCase() +
            store.character.race.slice(1)}
        </span>
        <span className="text-muted-foreground min-h-12">
          {RACE_INFO[store.character.race].description}
        </span>
      </div>
    </section>
  );
};

const CLASS_INFO: Record<
  Character["class"],
  { icon: Lucide.LucideIcon; description: string }
> = {
  barbarian: {
    icon: Lucide.Axe,
    description:
      "A fierce warrior driven by raw strength, thriving in the heart of battle.",
  },
  bard: {
    icon: Lucide.Guitar,
    description:
      "A charismatic performer whose magic flows through music, words, and inspiration.",
  },
  cleric: {
    icon: Lucide.Heart,
    description:
      "A devoted healer and protector channeling divine power to guide and defend.",
  },
  ranger: {
    icon: Lucide.PawPrint,
    description:
      "A skilled hunter and tracker who excels at ranged combat and survival in the wild.",
  },
  wizard: {
    icon: Lucide.Book,
    description:
      "A master of arcane knowledge wielding powerful spells through study and intellect.",
  },
  warlock: {
    icon: Lucide.Flame,
    description:
      "A spellcaster bound to a mysterious patron, drawing magic from forbidden pacts.",
  },
};

const _Class = () => {
  const store = useCharacterStore();

  return (
    <section className="flex flex-col gap-9 p-4">
      <div className="grid w-full grid-cols-2 justify-between gap-6 overflow-visible md:grid-cols-6">
        {CLASSES.map((e) => {
          const temp = CLASS_INFO[e];
          const isSelected = store.character.class === e;
          return (
            <button
              type="button"
              onClick={() => store.set("class", e)}
              key={e}
              className={`group border-border/20 relative w-full overflow-visible border-2 p-2 transition-all duration-300 ${isSelected ? "text-foreground" : "text-muted-foreground hover:border-border hover:scale-105"}`}
            >
              {isSelected && <Border />}
              <temp.icon key={e} className="size-full" />
            </button>
          );
        })}
      </div>
      <div className="flex flex-col text-center">
        <span className="text-lg">
          {store.character.class.slice(0, 1).toUpperCase() +
            store.character.class.slice(1)}
        </span>
        <span className="text-muted-foreground min-h-12">
          {CLASS_INFO[store.character.class].description}
        </span>
      </div>
    </section>
  );
};

const ATTRIBUTE_INFO: Record<
  keyof Character["attributes"],
  { name: string; description: string }
> = {
  str: {
    name: "Strength",
    description:
      "Physical power and athletic prowess. Affects melee attacks and carrying capacity.",
  },
  dex: {
    name: "Dexterity",
    description:
      "Agility, reflexes, and balance. Influences armor class, initiative, and ranged attacks.",
  },
  con: {
    name: "Constitution",
    description:
      "Endurance and stamina. Determines hit points and resistance to physical hardship.",
  },
  int: {
    name: "Intelligence",
    description:
      "Reasoning and memory. Governs arcane spellcasting and knowledge skills.",
  },
  wis: {
    name: "Wisdom",
    description:
      "Awareness and insight. Powers divine magic and perception abilities.",
  },
  cha: {
    name: "Charisma",
    description:
      "Force of personality and leadership. Affects social interactions and certain spells.",
  },
};

const _Attributes = ({ points = 18 }: { points?: number }) => {
  const store = useCharacterStore();
  const [current, setCurrent] = React.useState<number>(0);
  const [hovered, setHovered] =
    React.useState<keyof Character["attributes"]>("str");

  return (
    <section className="flex flex-col gap-6 p-4 text-center text-xl">
      Allocate all points: ({current}/{points})
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {ATTRIBUTES.map((e) => {
          const attr = store.character.attributes[e];
          return (
            <div
              key={e}
              className="flex flex-row items-center justify-between px-9 py-6 text-lg capitalize"
              onMouseOver={() => setHovered(e)}
            >
              {e}
              <div className="flex gap-3">
                <Button
                  size="icon"
                  variant={"outline"}
                  disabled={attr <= 8}
                  className="scale-80"
                  onClick={() => {
                    store.setCan(false);
                    store.setAttribute(e, attr - 1);
                    setCurrent((p) => p - 1);
                  }}
                >
                  -
                </Button>
                <p>{attr}</p>
                <Button
                  size="icon"
                  variant={"outline"}
                  disabled={attr >= 20 || points === current}
                  className="scale-80"
                  onClick={() => {
                    if (current + 1 === points) store.setCan(true);
                    store.setAttribute(e, attr + 1);
                    setCurrent((p) => p + 1);
                  }}
                >
                  +
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col text-center">
        <div className="relative text-lg">
          {ATTRIBUTES.map((attr) => (
            <span
              key={attr}
              className={`inset-0 transition-opacity duration-300 ${hovered === attr ? "opacity-100" : "absolute opacity-0"}`}
            >
              {ATTRIBUTE_INFO[attr].name}
            </span>
          ))}
        </div>
        <div className="text-muted-foreground relative min-h-12 text-base">
          {ATTRIBUTES.map((attr) => (
            <span
              key={attr}
              className={`absolute inset-0 transition-opacity duration-300 ${hovered === attr ? "opacity-100" : "opacity-0"}`}
            >
              {ATTRIBUTE_INFO[attr].description}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

const _Name = () => {
  const store = useCharacterStore();

  const NAME_PREFIXES: Record<Character["race"], string[]> = {
    dragonborn: ["Drak", "Shar", "Kava", "Zor", "Mera", "Thar", "Bala", "Nyx"],
    dwarf: ["Thor", "Brom", "Gim", "Dwa", "Bal", "Krag", "Dum", "Thrain"],
    elf: ["Gala", "Lego", "Ara", "Cele", "Thran", "Elro", "Fea", "Luth"],
    human: ["Ara", "Bran", "Cath", "Dun", "Eri", "Finn", "Gwen", "Hal"],
    orc: ["Grom", "Thrak", "Durg", "Mog", "Grak", "Urg", "Brok", "Skar"],
    tiefling: ["Zar", "Mor", "Kael", "Dae", "Raz", "Vel", "Nyx", "Ash"],
  };

  const NAME_SUFFIXES: Record<Character["race"], string[]> = {
    dragonborn: ["oth", "ash", "nar", "ix", "ath", "orn", "yx", "ion"],
    dwarf: ["in", "li", "dur", "nar", "rim", "dan", "bur", "rik"],
    elf: ["driel", "las", "wen", "born", "duil", "ion", "nor", "ien"],
    human: ["gorn", "wen", "ric", "ley", "ton", "wyn", "dor", "ian"],
    orc: ["ash", "nak", "ush", "gul", "lok", "tar", "gar", "dak"],
    tiefling: ["iel", "oth", "ax", "mon", "ius", "eth", "ara", "lyn"],
  };

  const generateRandomName = () => {
    const prefixes = NAME_PREFIXES[store.character.race];
    const suffixes = NAME_SUFFIXES[store.character.race];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    store.set("name", prefix + suffix);
    store.setCan(true);
  };

  return (
    <section className="flex flex-col gap-9 p-4">
      <div className="flex gap-6">
        <Input
          type="text"
          placeholder="Enter character name..."
          value={store.character.name}
          onChange={(e) => {
            store.set("name", e.target.value);
            store.setCan(true);
          }}
          className="grow"
          autoFocus
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={generateRandomName}
          title="Generate random name"
        >
          <Lucide.Shuffle className="size-4" />
        </Button>
      </div>
    </section>
  );
};

const _Summary = () => {
  const character = useCharacterStore().character;

  return (
    <section className="flex flex-col gap-9 p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="relative w-full scale-50 overflow-hidden md:aspect-9/16">
          <Image
            src={`/classes/${character.race}.png`}
            alt={character.race}
            fill
            className="object-contain"
          />
        </div>

        <div className="col-span-3 flex flex-col items-center gap-4 p-4 text-center">
          <h2 className="text-2xl font-bold tracking-wide">
            {character.name || "Nameless"}
          </h2>

          <p className="pixel-font text-lg font-semibold capitalize">
            {character.class}
          </p>
          <p className="text-muted-foreground text-sm leading-snug">
            {CLASS_INFO[character.class].description}
          </p>

          <p className="pixel-font text-lg font-semibold capitalize">
            {character.race}
          </p>
          <p className="text-muted-foreground text-sm leading-snug">
            {RACE_INFO[character.race].description}
          </p>

          <h3 className="pixel-font mt-2 text-xl font-semibold">Attributes</h3>
          <div className="grid h-full grid-cols-2 gap-4 md:grid-cols-3">
            {ATTRIBUTES.map((attr) => (
              <div key={attr} className="aspect-square h-full border p-1">
                <p className="text-muted-foreground pixel-font mb-1 text-xs uppercase">
                  {attr}
                </p>
                <p className="pixel-font text-2xl font-bold">
                  {character.attributes[attr]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
