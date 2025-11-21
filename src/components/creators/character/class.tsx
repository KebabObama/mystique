import { Border } from "@/components/ui/border";
import { Character } from "@/types/game";
import { CLASSES } from "@/types/game/classes.internal";

export const _Class = ({
  character,
  setCharacter,
  setCan,
}: {
  character: Character;
  setCharacter: (character: Character) => void;
  setCan: (b: boolean) => void;
}) => {
  return (
    <section className="flex flex-col gap-9 p-4">
      <div className="grid w-full grid-cols-6 justify-between overflow-visible md:gap-6">
        {(Object.keys(CLASSES) as (keyof typeof CLASSES)[]).map((e) => {
          const temp = CLASSES[e];
          const isSelected = character.class === e;
          return (
            <button
              type="button"
              onClick={() => setCharacter({ ...character, class: e })}
              key={e}
              className={`border-border/20 relative w-full overflow-visible border-2 p-2 transition-all duration-300 ${isSelected ? "text-foreground" : "text-muted-foreground hover:border-border hover:scale-105"}`}
            >
              {isSelected && <Border />}
              <temp.icon key={e} className="size-full" />
            </button>
          );
        })}
      </div>
      <div className="flex flex-col text-center">
        <span className="text-lg capitalize">{character.class}</span>
        <span className="text-muted-foreground min-h-12">{CLASSES[character.class].description}</span>
      </div>
    </section>
  );
};
