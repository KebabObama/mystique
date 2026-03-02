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

  export const EMPTY_EFFECTS: Record<Effect, number> = {
    corroding: 0,
    frostbite: 0,
    burning: 0,
    shocked: 0,
  } as const;

  export const withEffects = (
    effects: Partial<Record<Effect, number>> = {}
  ): Record<Effect, number> => ({ ...EMPTY_EFFECTS, ...effects });

  export type Character = typeof schema.character.$inferSelect & {
    inventory: (Omit<typeof schema.inventory.$inferSelect, "itemId" | "characterId"> & {
      item: typeof schema.item.$inferSelect;
    })[];
  };

  export type Monster = typeof schema.monster.$inferSelect;
  export type Chest = typeof schema.chest.$inferSelect & {
    inventory: (Omit<typeof schema.chestInventory.$inferSelect, "itemId" | "chestId"> & {
      item: typeof schema.item.$inferSelect;
    })[];
  };
  export type Entity = Omit<
    typeof schema.lobbyEntity.$inferSelect,
    "characterId" | "monsterId" | "chestId" | "lobbyId"
  > &
    (
      | { type: "character"; playable: Character }
      | { type: "monster"; playable: Monster }
      | { type: "chest"; playable: Chest }
    );

  export type Instance = typeof schema.lobby.$inferSelect & {
    members: (typeof schema.user.$inferSelect)[];
    entities: Entity[];
  };

  export const getEntityAbilities = (entity: Entity): Ability[] => {
    if (entity.type === "monster") return entity.playable.abilities;
    if (entity.type === "chest") return [];

    return entity.playable.inventory
      .filter((entry) => entry.equipped && entry.item.type === "weapon")
      .flatMap((entry) => entry.item.abilities);
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

  export type CombatEntity = Extract<Game.Entity, { type: "character" | "monster" }>;

  export const getAbilityImpactTiles = (target: Position, targeting: number): Position[] => {
    if (targeting <= 0) return [{ x: target.x, z: target.z }];

    return Array.from({ length: targeting * 2 + 1 }).flatMap((_, dxIndex) => {
      const dx = dxIndex - targeting;
      return Array.from({ length: targeting * 2 + 1 }).flatMap((__, dzIndex) => {
        const dz = dzIndex - targeting;
        if (Math.abs(dx) + Math.abs(dz) > targeting) return [];
        return [{ x: target.x + dx, z: target.z + dz }];
      });
    });
  };

  export const getAbilityVictims = (
    entities: Entity[],
    ability: Ability,
    target: Position
  ): CombatEntity[] => {
    const combatEntities = entities.filter(
      (entity): entity is CombatEntity => entity.type === "character" || entity.type === "monster"
    );

    if (ability.targeting < 0) {
      return combatEntities
        .map((entity) => ({
          entity,
          distance: Math.abs(entity.position.x - target.x) + Math.abs(entity.position.z - target.z),
        }))
        .filter((entry) => entry.distance <= Math.abs(ability.targeting))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, Math.abs(ability.targeting))
        .map((entry) => entry.entity);
    }

    const selectedTiles = getAbilityImpactTiles(target, ability.targeting);
    return combatEntities.filter((entity) =>
      selectedTiles.some((tile) => tile.x === entity.position.x && tile.z === entity.position.z)
    );
  };

  export const getAbilityViableTargets = (
    caster: Entity,
    ability: Ability,
    entities: Entity[]
  ): Position[] => {
    const maxRange = Math.max(0, ability.range);
    const possible: Position[] = [];

    for (let dx = -maxRange; dx <= maxRange; dx++) {
      for (let dz = -maxRange; dz <= maxRange; dz++) {
        if (Math.abs(dx) + Math.abs(dz) > maxRange) continue;
        const target = { x: caster.position.x + dx, z: caster.position.z + dz };
        const victims = getAbilityVictims(entities, ability, target);
        if (victims.length > 0) possible.push(target);
      }
    }

    return possible;
  };

  export const canEquipItem = (character: Character, itemType: ItemType): boolean => {
    // Misc items cannot be equipped
    if (itemType === "misc") return false;

    // Count equipped items of this type
    const equippedOfType = character.inventory.filter(
      (inv) => inv.equipped && inv.item.type === itemType
    ).length;

    // Enforce slot limits: 2 for rings, 1 for everything else
    const maxSlots = itemType === "ring" ? 2 : 1;
    return equippedOfType < maxSlots;
  };
}
