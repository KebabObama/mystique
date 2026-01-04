import { Game } from "@/types/game";

export namespace CharacterHelper {
  export const updateByAttributes = (c: Game.Character): Game.Character => {
    const health = 4 + c.attributes.con;
    const actions = Math.max(2, Math.floor(c.attributes.wis / 8)) + Math.floor(c.level / 4);
    const memories = Math.floor(c.attributes.int / 4) + 3;
    const stamina = 4 + Math.floor(c.attributes.dex / 4);
    const weight = 5 + c.attributes.str;
    return {
      ...c,
      stamina,
      actions: { current: actions, max: actions },
      health: { current: health, max: health },
      memories: { current: memories, max: memories },
      weight: { current: weight, max: weight },
    };
  };

  // prettier-ignore
  export const defaultCharacter = (): Game.Character => {
    let temp = {
      name:       "",
      race:       "human",
      level:      0,
      xp:         0,
      stamina:    5,
      effects:    Object.fromEntries(Game.KEYS.EFFECTS.map((key) => [key, 0]))    as Record<Game.Effect,number>,
      attributes: Game.INFO.RACES.human.starting,
      health:     { current: 8, max: 10 },
      actions:    { current: 2, max: 2 },
      memories:   { current: 0, max: 0 },
      weight:     { current: 0, max: 10 },
      abilities:  { memorized: [], consumable: [], equipment: [] },
      inventory:  [],
    } as Game.Character;
    temp = updateByAttributes(temp);
    return temp;
  }

  export const generateRandomName = (c: Game.Character) => {
    const NAME_PREFIXES: Record<Game.Character["race"], string[]> = {
      dragonborn: ["Drak", "Shar", "Kava", "Zor", "Mera", "Thar", "Bala", "Nyx"],
      dwarf: ["Thor", "Brom", "Gim", "Dwa", "Bal", "Krag", "Dum", "Thrain"],
      elf: ["Gala", "Lego", "Ara", "Cele", "Thran", "Elro", "Fea", "Luth"],
      human: ["Ara", "Bran", "Cath", "Dun", "Eri", "Finn", "Gwen", "Hal"],
      orc: ["Grom", "Thrak", "Durg", "Mog", "Grak", "Urg", "Brok", "Skar"],
      tiefling: ["Zar", "Mor", "Kael", "Dae", "Raz", "Vel", "Nyx", "Ash"],
    };

    const NAME_SUFFIXES: Record<Game.Character["race"], string[]> = {
      dragonborn: ["oth", "ash", "nar", "ix", "ath", "orn", "yx", "ion"],
      dwarf: ["in", "li", "dur", "nar", "rim", "dan", "bur", "rik"],
      elf: ["driel", "las", "wen", "born", "duil", "ion", "nor", "ien"],
      human: ["gorn", "wen", "ric", "ley", "ton", "wyn", "dor", "ian"],
      orc: ["ash", "nak", "ush", "gul", "lok", "tar", "gar", "dak"],
      tiefling: ["iel", "oth", "ax", "mon", "ius", "eth", "ara", "lyn"],
    };
    const prefixes = NAME_PREFIXES[c.race];
    const suffixes = NAME_SUFFIXES[c.race];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return prefix + suffix;
  };
}
