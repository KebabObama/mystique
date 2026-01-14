import type { User } from "better-auth";

// prettier-ignore
export namespace Game {
  export const KEYS = {
    RESISTANCES:  ["physical", "mystical"],
    ATTRIBUTES:   ["str", "dex", "con", "wis", "int"],
    RACES:        ["dragonborn", "dwarf", "elf", "human", "orc", "tiefling"],
    ITEM_TYPES:   ["one-hand", "two-hand", "shield", "helmet", "armor", "leggings", "consumable", "backpack", "misc"],
    RESOURCES:    ["health", "actions", "memories", "weight"],
    EFFECTS: [ 
      "corroding", "frostbite", "burning", "shocked", "bleeding", "toxin", "smitten", "hastened", "fortified", 
      "weakened", "regenerating", "energized", "shielded", "enraged", "focused", "confused", "fastened", "slowed", "stunned",
    ],
  } as const;

  export const INFO = {
    ATTRIBUTES: {
      str: { name: "strength", description: "Physical might and raw power. Determines how much heavy gear and loot you can carry before becoming encumbered." },
      dex: { name: "dexterity", description: "Agility, reflexes, and balance. A higher score allows you to traverse the battlefield with greater speed." },
      con: { name: "constitution", description: "Endurance and vital force. Governs your physical resilience and total health pool." },
      int: { name: "intelligence", description: "Cognitive capacity and mental storage. Grants 'Memories' — mental tokens required to prepare and manifest spells." },
      wis: { name: "wisdom",description: "Intuition and mental clarity. Provides additional actions during your turn, allowing for more complex tactical maneuvers." },
    } satisfies Record<Attribute, { description: string; name: string }>,

    RACES: {
      dragonborn: {
        description: "Descendants of ancient drakes. They possess a natural physical dominance and a fierce elemental heritage, making them formidable front-line warriors.",
        starting: { str: 7, dex: 3, con: 7, wis: 4, int: 4 },
      },
      dwarf: {
        description: "Stout, resilient, and unyielding. Their dense physiology grants them supernatural endurance and the strength to carry the heaviest of mountain-forged armor.",
        starting: { str: 6, dex: 5, con: 6, wis: 4, int: 4 },
      },
      elf: {
        description: "Graceful beings with sharpened senses. They move with an elegance that defies natural speed and possess minds naturally attuned to the flow of ancient memories.",
        starting: { str: 3, dex: 6, con: 4, wis: 6, int: 6 },
      },
      human: {
        description: "Versatile and ambitious. Humans lack the specialized traits of other races but make up for it with a balanced adaptability that allows them to excel in any discipline.",
        starting: { str: 5, dex: 5, con: 5, wis: 5, int: 5 },
      },
      tiefling: {
        description: "Cunning survivors touched by infernal planes. They possess an uncanny intuition for battlefield dynamics and the quick reflexes needed to exploit any opening.",
        starting: { str: 3, dex: 6, con: 3, wis: 7, int: 6 },
      },
      orc: {
        description: "Bound by blood and iron. Orcs are driven by an unstoppable physical momentum, possessing the raw power to shatter defenses and the stamina to endure grueling conflicts.",
        starting: { str: 8, dex: 4, con: 8, wis: 2, int: 3 },
      },
    } satisfies Record<Race, { description: string; starting: Record<Attribute, number> }>,
  } as const;

  export type Attribute   = (typeof KEYS.ATTRIBUTES   )[number];
  export type Race        = (typeof KEYS.RACES        )[number];
  export type Resource    = (typeof KEYS.RESOURCES    )[number];
  export type ItemType    = (typeof KEYS.ITEM_TYPES   )[number];
  export type Resistance  = (typeof KEYS.RESISTANCES  )[number];
  export type Effect      = (typeof KEYS.EFFECTS      )[number];

  export type Values      = { current: number; max : number };
  export type Dice        = 4 | 6 | 8 | 10 | 12 | 20;

  export type Ability = {
    name:     string;
    cost:     number;
    type:     Resistance | "healing";
    amount:   Dice[];
    range:    number;
    size:     number;
    effects:  Record<Effect, number>;
  };

  export type Node = {
    name:       string;
    required:   string[];
    ability:    Ability[];
    attributes: Partial<Record<Attribute, number>>;
  };

  export type Item = {
    name:         string;
    type:         ItemType;
    resistance?:  Record<Resistance, number>;
    abilities:    Ability[];
    weight:       number;
    value:        number;
  };
  
  export type Stack = {
    equipped: boolean;
    amount:   number;
  } & Item;

  export type Character = {
    name:       string;
    race:       Race;
    level:      number;
    xp:         number;
    stamina:    number;
    effects:    Record<Effect, number>;
    attributes: Record<Attribute, number>;
    inventory:  Stack[];
    resistance: Record<Resistance,number>;
    abilities: {
      memorized:  (Ability & { learned: number                   })[]
      equipment:  (Ability & { source : string; cooldown: number })[]
    };
  } & Record<Resource, Values>;

  export type NPC = {
    name:       string;
    level:      number;
    stamina:    number;
    inventory:  Stack[];
    effects:    Record<Effect, number>;
    attributes: Record<Attribute, number>;
    resistance: Record<Resistance,number>;
    abilities: {
      memorized:  (Ability & { learned: number                   })[]
      equipment:  (Ability & { source : string; cooldown: number })[]
    };
  } & Record<Resource, Values>;

  export type Playable = {
    id:     string;
    owner:  number;
    object: Character | NPC;
  };

  export type Lobby = {
    id: string;
    users: User[];
    dm: string;
    playables: Playable[];
    order: (Playable["id"] | "dm")[]
    sequence: number;
  };
}
