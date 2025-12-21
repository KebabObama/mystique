import { Game } from "@/types/game";

export namespace Helper {
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

  export const updateByRace = (c: Game.Character): Game.Character => ({
    ...c,
    attributes: Game.INFO.RACES[c.race].starting,
  });

  export const DEFAULT_CHARACTER: Game.Character = {
    name: "",
    race: "dragonborn",
    mesh: 0,
    level: 1,
    points: 7,
    attributes: { str: 0, dex: 0, con: 0, wis: 0, int: 0 },
    effects: {
      corroding: 0,
      frostbite: 0,
      burning: 0,
      shocked: 0,
      bleeding: 0,
      toxin: 0,
      smitten: 0,
      hastened: 0,
      fortified: 0,
      weakened: 0,
      regenerating: 0,
      energized: 0,
      shielded: 0,
      enraged: 0,
      focused: 0,
      confused: 0,
      fastened: 0,
      slowed: 0,
      stunned: 0,
    },
    inventory: [],
    stamina: 0,
    abilities: { consumables: [], equipment: [], memorized: [] },
    health: { current: 0, max: 0 },
    actions: { current: 0, max: 0 },
    memories: { current: 0, max: 0 },
    weight: { current: 0, max: 0 },
  };

  export const generateRandomName = (c: Game.Character) => {
    const NAME_PREFIXES: Record<Game.Race, string[]> = {
      dragonborn: ["Drak", "Shar", "Kava", "Zor", "Mera", "Thar", "Bala", "Nyx"],
      dwarf: ["Thor", "Brom", "Gim", "Dwa", "Bal", "Krag", "Dum", "Thrain"],
      elf: ["Gala", "Lego", "Ara", "Cele", "Thran", "Elro", "Fea", "Luth"],
      human: ["Ara", "Bran", "Cath", "Dun", "Eri", "Finn", "Gwen", "Hal"],
    };
    const NAME_SUFFIXES: Record<Game.Race, string[]> = {
      dragonborn: ["oth", "ash", "nar", "ix", "ath", "orn", "yx", "ion"],
      dwarf: ["in", "li", "dur", "nar", "rim", "dan", "bur", "rik"],
      elf: ["driel", "las", "wen", "born", "duil", "ion", "nor", "ien"],
      human: ["gorn", "wen", "ric", "ley", "ton", "wyn", "dor", "ian"],
    };
    const prefixes = NAME_PREFIXES[c.race];
    const suffixes = NAME_SUFFIXES[c.race];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return prefix + suffix;
  };
}
