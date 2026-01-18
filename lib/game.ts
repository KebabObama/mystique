import * as schema from "@/db/schema";

// prettier-ignore
export namespace Game {
  export const KEYS = {
    RESISTANCES:  ["physical", "mystical"],
    ATTRIBUTES:   ["str", "dex", "con", "int"],
    RACES:        ["dwarf", "elf", "human", "orc",],
    ITEM_TYPES:   ["weapon", "armor", "misc"],
    RESOURCES:    ["health", "actions", "memories", "weight"],
    EFFECTS:      ["corroding", "frostbite", "burning", "shocked", "bleeding", "toxin", "stunned"],
  } as const;

  export const INFO = {
    ATTRIBUTES: {
      str: { name: "strength", description: "Physical might and raw power. Determines how much heavy gear and loot you can carry before becoming encumbered." },
      dex: { name: "dexterity", description: "Agility, reflexes, and balance. A higher score allows you to traverse the battlefield with greater speed." },
      con: { name: "constitution", description: "Endurance and vital force. Governs your physical resilience and total health pool." },
      int: { name: "intelligence", description: "Cognitive capacity and mental storage. Grants 'Memories' — mental tokens required to prepare and manifest spells." },
    } satisfies Record<Attribute, { description: string; name: string }>,

    RACES: {
      dwarf: {
        description: "Stout, resilient, and unyielding. Their dense physiology grants them supernatural endurance and the strength to carry the heaviest of mountain-forged armor.",
        starting: { str: 6, dex: 5, con: 6, int: 4 },
      },
      elf: {
        description: "Graceful beings with sharpened senses. They move with an elegance that defies natural speed and possess minds naturally attuned to the flow of ancient memories.",
        starting: { str: 3, dex: 6, con: 4, int: 6 },
      },
      human: {
        description: "Versatile and ambitious. Humans lack the specialized traits of other races but make up for it with a balanced adaptability that allows them to excel in any discipline.",
        starting: { str: 5, dex: 5, con: 5, int: 5 },
      },
      orc: {
        description: "Bound by blood and iron. Orcs are driven by an unstoppable physical momentum, possessing the raw power to shatter defenses and the stamina to endure grueling conflicts.",
        starting: { str: 8, dex: 4, con: 8, int: 3 },
      },
    } satisfies Record<Race, { description: string; starting: Record<Attribute, number> }>,
  } as const;

  export type Attribute   = (typeof KEYS.ATTRIBUTES   )[number];
  export type Race        = (typeof KEYS.RACES        )[number];
  export type ItemType    = (typeof KEYS.ITEM_TYPES   )[number];
  export type Effect      = (typeof KEYS.EFFECTS      )[number];

  export type PartialCharacter = typeof schema.character.$inferSelect & {
    inventory: (Omit<typeof schema.inventory.$inferSelect, "itemId" | "characterId"> & {
      item: typeof schema.item.$inferSelect;
    })[];
  };

  export type Character = typeof schema.character.$inferSelect & {
    maxHp: number;
    actions: number;
    maxActions: number;
    stamina: number;
    weight: number;
    maxWeight: number;
    inventory: (Omit<typeof schema.inventory.$inferSelect, "itemId" | "characterId"> & {
      item: typeof schema.item.$inferSelect;
    })[];
  };

  export const completeCharacter = (c: PartialCharacter): Character => {
    const maxHp       = Math.floor(c.attributes.con + c.attributes.str / 2 + 5);
    const actions     = Math.floor(c.level / 4 + c.attributes.dex / 8 + c.attributes.int / 8);
    const maxWeight   = Math.floor(10 + c.attributes.str + c.attributes.con / 2);
    const stamina     = Math.floor(c.attributes.dex / 2 + 5);
    const weight      = c.inventory.reduce((acc, e) => acc + e.item.weight, 0);
    return {
      ...c, maxHp, maxWeight, stamina, weight, actions, maxActions: actions,
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
