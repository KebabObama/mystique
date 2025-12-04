import Image from "next/image";
import { Border } from "@/components/ui/border";
import { type Character, RACES } from "@/types/game";

export const _Race = ({
  character,
  setCharacter,
}: {
  character: Character;
  setCharacter: (character: Character) => void;
  setCan: (b: boolean) => void;
}) => {
  return (
    <section className="flex flex-col gap-9 pt-1.5 md:px-4">
      <div className="flex w-full flex-row gap-2.5 md:gap-6">
        {(Object.keys(RACES) as (keyof typeof RACES)[]).map((e) => {
          const isSelected = character.race === e;
          return (
            <button
              className={`border-border/20 relative aspect-9/16 w-full overflow-visible border-2 p-2 transition-all duration-300 ${isSelected ? "text-foreground" : "text-muted-foreground hover:border-border hover:scale-105"}`}
              key={e}
              onClick={() => setCharacter({ ...character, race: e })}
              type="button">
              {isSelected && <Border />}
              <Image
                alt={e}
                className="h-full w-full bg-contain bg-center bg-no-repeat"
                fill
                preload
                src={`/classes/${e}.png`}
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
