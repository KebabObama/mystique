import { Border } from "@/components/ui/border";
import { useCharacterStore } from "@/hooks/use-create-character";
import { Character } from "@/types/game";
import { CLASSES } from "@/types/game/consts";
import {
  Axe,
  Book,
  Flame,
  Guitar,
  Heart,
  LucideIcon,
  PawPrint,
} from "lucide-react";

export const CLASS_INFO: Record<
  Character["class"],
  { icon: LucideIcon; description: string }
> = {
  barbarian: {
    icon: Axe,
    description:
      "A fierce warrior driven by raw strength, thriving in the heart of battle.",
  },
  bard: {
    icon: Guitar,
    description:
      "A charismatic performer whose magic flows through music, words, and inspiration.",
  },
  cleric: {
    icon: Heart,
    description:
      "A devoted healer and protector channeling divine power to guide and defend.",
  },
  ranger: {
    icon: PawPrint,
    description:
      "A skilled hunter and tracker who excels at ranged combat and survival in the wild.",
  },
  wizard: {
    icon: Book,
    description:
      "A master of arcane knowledge wielding powerful spells through study and intellect.",
  },
  warlock: {
    icon: Flame,
    description:
      "A spellcaster bound to a mysterious patron, drawing magic from forbidden pacts.",
  },
};

export const _Class = () => {
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
