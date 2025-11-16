import { Border } from "@/components/ui/border";
import { useCharacterStore } from "@/hooks/use-create-character";
import { Character } from "@/types/game";
import { RACES } from "@/types/game/consts";
import Image from "next/image";

export const RACE_INFO: Record<Character["race"], { description: string }> = {
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

export const _Race = () => {
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
