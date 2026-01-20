import { schema } from "@/lib/schema";

// prettier-ignore
export namespace Game {
  export const KEYS = {
    ATTRIBUTES:   ["strength", "dexterity", "constitution", "intelligence"],
    RACES:        ["dwarf", "elf", "human", "orc",],
    ITEM_TYPES:   ["weapon", "helmet", "armor", "leggings", "ring", "misc"],
    EFFECTS:      ["corroding", "frostbite", "burning", "shocked"],
  } as const;

  export const INFO = {
    ATTRIBUT_DESCRIPTION: {
      strength:     "Physical might and raw power. Determines how much heavy gear and loot you can carry before becoming encumbered.",
      dexterity:    "Agility, reflexes, and balance. A higher score allows you to traverse the battlefield with greater speed.",
      constitution: "Endurance and vital force. Governs your physical resilience and total health pool.",
      intelligence: "Cognitive capacity and mental storage. Grants 'Memories' — mental tokens required to prepare and manifest spells.",
    } satisfies Record<Attribute, string>,

    STARTING_RACES: {
      dwarf:  { strength: 6, dexterity: 4, constitution: 6, intelligence: 4 },
      elf:    { strength: 3, dexterity: 5, constitution: 4, intelligence: 7 },
      human:  { strength: 4, dexterity: 7, constitution: 4, intelligence: 5 },
      orc:    { strength: 7, dexterity: 4, constitution: 6, intelligence: 3 },
    } satisfies Record<Race, Record<Attribute, number>>,
  } as const;

  export type Attribute   = (typeof KEYS.ATTRIBUTES   )[number];
  export type Race        = (typeof KEYS.RACES        )[number];
  export type ItemType    = (typeof KEYS.ITEM_TYPES   )[number];
  export type Effect      = (typeof KEYS.EFFECTS      )[number];


  export type Ability = {
    name: string;
    cost: number;
    // Amount of tiles that ability can be used for, zero stands for self
    range: number;
    // Negative amount makes multiple projectiles and positive creates AoE
    targeting: number;
    // Negative amount is healing and positive is damage 
    amount: [number, number];
    effects: Record<Effect, number>;
  }

  export type PartialCharacter = typeof schema.character.$inferSelect & {
    inventory: (Omit<typeof schema.inventory.$inferSelect, "itemId" | "characterId"> & typeof schema.item.$inferSelect)[];
  };

  export type Character = PartialCharacter & {
    maxHp: number;
    actions: number;
    maxActions: number;
    stamina: number;
    weight: number;
    maxWeight: number;
    maxMemory: number;
    armor: number;
  };

  export const completeCharacter = (c: PartialCharacter): Character => {
    const maxHp       = Math.floor(c.attributes.constitution + c.attributes.strength / 2 + 5);
    const actions     = Math.floor(c.level / 4 + c.attributes.dexterity / 8 + c.attributes.intelligence / 8);
    const maxWeight   = Math.floor(10 + c.attributes.strength + c.attributes.constitution / 2);
    const maxMemory   = Math.floor(c.attributes.intelligence / 2 + c.level + 1);
    const weight      = c.inventory.reduce((acc, e) => acc + e.weight, 0);
    const armor       = c.inventory.reduce((acc, e) => acc + (e.equipped? (e.armor || 0): 0), 0);
    const stamina     = Math.floor((c.attributes.dexterity / 2 + 5) / (maxWeight < weight ? 2 : 1));
    return {
      ...c, maxMemory, armor, maxHp, maxWeight, stamina, weight, actions, maxActions: actions, memory: Math.min(c.memory, maxMemory)
    } satisfies Character;
  };

  export const generateRandomName = (c: Character) => {
    const NAME_PREFIXES: Record<Race, string[]> = {
      dwarf:      ["Thor", "Brom", "Gim", "Dwa", "Bal", "Krag", "Dum", "Thrain"],
      elf:        ["Gala", "Lego", "Ara", "Cele", "Thran", "Elro", "Fea", "Luth"],
      human:      ["Ara", "Bran", "Cath", "Dun", "Eri", "Finn", "Gwen", "Hal"],
      orc:        ["Grom", "Thrak", "Durg", "Mog", "Grak", "Urg", "Brok", "Skar"],
    };

    const NAME_SUFFIXES: Record<Race, string[]> = {
      dwarf:      ["in", "li", "dur", "nar", "rim", "dan", "bur", "rik"],
      elf:        ["driel", "las", "wen", "born", "duil", "ion", "nor", "ien"],
      human:      ["gorn", "wen", "ric", "ley", "ton", "wyn", "dor", "ian"],
      orc:        ["ash", "nak", "ush", "gul", "lok", "tar", "gar", "dak"],
    };
    const prefixes = NAME_PREFIXES[c.race];
    const suffixes = NAME_SUFFIXES[c.race];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return prefix + suffix;
  };
}
