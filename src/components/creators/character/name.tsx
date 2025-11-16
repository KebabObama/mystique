import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCharacterStore } from "@/hooks/use-create-character";
import { Character } from "@/types/game";
import { Shuffle } from "lucide-react";

export const _Name = () => {
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
          <Shuffle className="size-4" />
        </Button>
      </div>
    </section>
  );
};
