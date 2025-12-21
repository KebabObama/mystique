import { ATTRIBUTES, CLASSES, RACES, type Attribute, type Character } from "@/types/game";
import Image from "next/image";

export const _Summary = ({
  character,
}: {
  character: Character;
  setCharacter: (character: Character) => void;
  setCan: (b: boolean) => void;
}) => {
  return (
    <section className="flex flex-col gap-9 p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="relative w-full scale-50 overflow-hidden md:aspect-9/16">
          <Image
            alt={character.race}
            className="object-contain"
            fill
            src={`/classes/${character.race}.png`}
          />
        </div>

        <div className="col-span-3 flex flex-col items-center gap-4 p-4 text-center">
          <h2 className="text-2xl font-bold tracking-wide">{character.name || "Nameless"}</h2>

          <p className="pixel-font text-lg font-semibold capitalize">{character.class}</p>
          <p className="text-muted-foreground text-sm leading-snug">
            {CLASSES[character.class].description}
          </p>

          <p className="pixel-font text-lg font-semibold capitalize">{character.race}</p>
          <p className="text-muted-foreground text-sm leading-snug">
            {RACES[character.race].description}
          </p>

          <h3 className="pixel-font mt-2 text-xl font-semibold">Attributes</h3>
          <div className="grid h-full grid-cols-2 gap-4 md:grid-cols-3">
            {(Object.keys(ATTRIBUTES) as Attribute[]).map((attr) => (
              <div className="aspect-square h-full border p-1" key={attr}>
                <p className="text-muted-foreground pixel-font mb-1 text-xs uppercase">{attr}</p>
                <p className="pixel-font text-2xl font-bold">{character.attributes[attr]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
