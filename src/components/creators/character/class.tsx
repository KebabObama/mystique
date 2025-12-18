import { Border } from "@/components/ui/border";
import { CLASSES, type Character, type Class } from "@/types/game";

export const _Class = ({
  character,
  setCharacter,
}: {
  character: Character;
  setCharacter: (character: Character) => void;
  setCan: (b: boolean) => void;
}) => {
  return (
    <section className="flex flex-col gap-9 p-4">
      <div className="grid w-full grid-cols-6 justify-between overflow-visible md:gap-6">
        {(Object.keys(CLASSES) as Class[]).map((e) => {
          const temp = CLASSES[e];
          const isSelected = character.class === e;
          return (
            <button
              className={`border-border/20 relative w-full overflow-visible border-2 p-2 transition-all duration-300 ${isSelected ? "text-foreground" : "text-muted-foreground hover:border-border hover:scale-105"}`}
              key={e}
              onClick={() => setCharacter({ ...character, class: e })}
              type="button"
            >
              {isSelected && <Border />}
              <temp.icon className="size-full" key={e} />
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
