import { schema } from "@/lib/db";
import { BicepsFlexed, Bone, Brain, LucideIcon, Rabbit } from "lucide-react";

export namespace Game {
  // prettier-ignore
  export const ATTRIBUTE_DESCRIPTION: Record<Game.Attribute, string>  = {
    strength:     "Physical might and raw power. Determines how much heavy gear and loot you can carry before becoming encumbered.",
    dexterity:    "Agility, reflexes, and balance. A higher score allows you to traverse the battlefield with greater speed.",
    constitution: "Endurance and vital force. Governs your physical resilience and total health pool.",
    intelligence: "Cognitive capacity and mental storage. Grants 'Memories' — mental tokens required to prepare and manifest spells.",
  } as const;

  export const ATTRIBUTE_ICON: Record<Game.Attribute, LucideIcon> = {
    strength: BicepsFlexed,
    dexterity: Rabbit,
    constitution: Bone,
    intelligence: Brain,
  } as const;

  export const STARTING_RACES: Record<Game.Race, Record<Game.Attribute, number>> = {
    dwarf: { strength: 6, dexterity: 4, constitution: 6, intelligence: 4 },
    elf: { strength: 3, dexterity: 5, constitution: 4, intelligence: 7 },
    human: { strength: 4, dexterity: 7, constitution: 4, intelligence: 5 },
    orc: { strength: 7, dexterity: 4, constitution: 6, intelligence: 3 },
  } as const;

  export const ATTRIBUTES = ["strength", "dexterity", "constitution", "intelligence"] as const;
  export const RACES = ["dwarf", "elf", "human", "orc"] as const;
  export const ITEM_TYPES = ["weapon", "helmet", "armor", "leggings", "ring", "misc"] as const;
  export const EFFECTS = ["corroding", "frostbite", "burning", "shocked"] as const;

  export type Race = (typeof Game.RACES)[number];
  export type Attribute = (typeof Game.ATTRIBUTES)[number];
  export type ItemType = (typeof Game.ITEM_TYPES)[number];
  export type Effect = (typeof Game.EFFECTS)[number];

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
  };

  export type Character = typeof schema.character.$inferSelect & {
    inventory: (Omit<typeof schema.inventory.$inferSelect, "itemId" | "characterId"> & {
      item: typeof schema.item.$inferSelect;
    })[];
  };

  export type Monster = typeof schema.monster.$inferSelect;
  export type Entity = Omit<
    typeof schema.lobbyEntity.$inferSelect,
    "characterId" | "monsterId" | "lobbyId"
  > &
    ({ type: "character"; playable: Character } | { type: "monster"; playable: Monster });

  export type Instance = typeof schema.lobby.$inferSelect & {
    members: (typeof schema.user.$inferSelect)[];
    entities: Entity[];
  };

  export const calculateCharacterStats = (
    c: { attributes: Record<Attribute, number>; level: number; memory: number },
    inventory: { weight: number; armor: number } = { weight: 0, armor: 0 }
  ) => {
    const maxHp = Math.floor(c.attributes.constitution + c.attributes.strength / 2 + 5);
    const maxActions = Math.floor(
      c.level / 4 + c.attributes.dexterity / 8 + c.attributes.intelligence / 8
    );
    const maxWeight = Math.floor(10 + c.attributes.strength + c.attributes.constitution / 2);
    const maxMemory = Math.floor(c.attributes.intelligence / 2 + c.level + 1);
    const stamina = Math.floor(
      (c.attributes.dexterity / 2 + 5) / (maxWeight < inventory.weight ? 2 : 1)
    );
    return {
      maxHp,
      maxActions,
      stamina,
      weight: inventory.weight,
      maxWeight,
      maxMemory,
      armor: inventory.armor,
    };
  };

  export const generateRandomName = (c: { race: Race }) => {
    const NAME_PREFIXES: Record<Game.Race, string[]> = {
      dwarf: ["Thor", "Brom", "Gim", "Dwa", "Bal", "Krag", "Dum", "Thrain"],
      elf: ["Gala", "Lego", "Ara", "Cele", "Thran", "Elro", "Fea", "Luth"],
      human: ["Ara", "Bran", "Cath", "Dun", "Eri", "Finn", "Gwen", "Hal"],
      orc: ["Grom", "Thrak", "Durg", "Mog", "Grak", "Urg", "Brok", "Skar"],
    };

    const NAME_SUFFIXES: Record<Game.Race, string[]> = {
      dwarf: ["in", "li", "dur", "nar", "rim", "dan", "bur", "rik"],
      elf: ["driel", "las", "wen", "born", "duil", "ion", "nor", "ien"],
      human: ["gorn", "wen", "ric", "ley", "ton", "wyn", "dor", "ian"],
      orc: ["ash", "nak", "ush", "gul", "lok", "tar", "gar", "dak"],
    };
    const prefixes = NAME_PREFIXES[c.race];
    const suffixes = NAME_SUFFIXES[c.race];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return prefix + suffix;
  };

  export type Position = { x: number; z: number };

  export type Data = { walls: Position[]; sequence: string[]; turn: number };
}
