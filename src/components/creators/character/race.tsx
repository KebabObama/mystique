import { Border } from "@/components/ui/border";
import { Character } from "@/types/game";
import { RACES } from "@/types/game/races.internal";
import Image from "next/image";

export const _Race = ({
  character,
  setCharacter,
  setCan,
}: {
  character: Character;
  setCharacter: (character: Character) => void;
  setCan: (b: boolean) => void;
}) => {
  return (
    <section className="flex flex-col gap-9 pt-1.5 md:px-4">
      <div className="flex w-full flex-row gap-2.5 md:gap-6">
        {(Object.keys(RACES) as (keyof typeof RACES)[]).map((e, i) => {
          const isSelected = character.race === e;
          return (
            <button
              type="button"
              onClick={() => setCharacter({ ...character, race: e })}
              key={e}
              className={`border-border/20 relative w-full aspect-9/16 overflow-visible border-2 p-2 transition-all duration-300 ${isSelected ? "text-foreground" : "text-muted-foreground hover:border-border hover:scale-105"}`}
            >
              {isSelected && <Border />}
              <Image
                preload
                src={`/classes/${e}.png`}
                alt={e}
                fill
                sizes="100%"
                fetchPriority="low"
                quality={38}
                unoptimized={false}
                draggable={false}
                className="object-contain transition-all duration-300"
              />
            </button>
          );
        })}
      </div>
      <div className="flex flex-col text-center">
        <span className="text-lg capitalize">{character.race}</span>
        <span className="text-muted-foreground min-h-12">
          {RACES[character.race].description}
        </span>
      </div>
    </section>
  );
};
