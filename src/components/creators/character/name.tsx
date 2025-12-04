import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Character } from "@/types/game";

export const _Name = ({
  character,
  setCharacter,
  setCan,
}: {
  character: Character;
  setCharacter: (character: Character) => void;
  setCan: (b: boolean) => void;
}) => {
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
    const prefixes = NAME_PREFIXES[character.race];
    const suffixes = NAME_SUFFIXES[character.race];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    setCharacter({ ...character, name: prefix + suffix });
    setCan(true);
  };

  return (
    <section className="flex flex-col gap-9 p-4">
      <div className="flex gap-6">
        <Input
          autoFocus
          className="grow"
          onChange={(e) => {
            setCharacter({ ...character, name: e.target.value });
            setCan(true);
          }}
          placeholder="Enter character name..."
          type="text"
          value={character.name}
        />
        <Button
          onClick={generateRandomName}
          size="icon"
          title="Generate random name"
          type="button"
          variant="outline">
          <Shuffle className="size-4" />
        </Button>
      </div>
    </section>
  );
};
