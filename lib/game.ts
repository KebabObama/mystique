import type {
  GameAbility,
  GameAttribute,
  GameCampfire,
  GameCampfireEntity,
  GameCharacter,
  GameCharacterEntity,
  GameChest,
  GameChestEntity,
  GameCombatEntity,
  GameData,
  GameEffect,
  GameEntity,
  GameInstance,
  GameItemType,
  GameMonster,
  GameMonsterEntity,
  GamePosition,
  GameRace,
} from "@/lib/types/game";
import { BicepsFlexed, Bone, Brain, LucideIcon, Rabbit } from "lucide-react";

export namespace Game {
  // Re-export types
  export type Race = GameRace;
  export type Attribute = GameAttribute;
  export type ItemType = GameItemType;
  export type Effect = GameEffect;
  export type Ability = GameAbility;
  export type Character = GameCharacter;
  export type Monster = GameMonster;
  export type Chest = GameChest;
  export type Campfire = GameCampfire;
  export type Entity = GameEntity;
  export type CharacterEntity = GameCharacterEntity;
  export type MonsterEntity = GameMonsterEntity;
  export type ChestEntity = GameChestEntity;
  export type CampfireEntity = GameCampfireEntity;
  export type Instance = GameInstance;
  export type Position = GamePosition;
  export type Data = GameData;
  export type CombatEntity = GameCombatEntity;
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

  export const EMPTY_EFFECTS: Record<Game.Effect, number> = {
    corroding: 0,
    frostbite: 0,
    burning: 0,
    shocked: 0,
  } as const;

  export const withEffects = (
    effects: Partial<Record<Game.Effect, number>> = {}
  ): Record<Game.Effect, number> => ({ ...EMPTY_EFFECTS, ...effects });

  export const getEntities = (instance: Game.Instance): Array<Game.Entity> => [
    ...instance.characters,
    ...instance.monsters,
    ...instance.chests,
    ...instance.campfires,
  ];

  export const getEntityById = (
    instance: Game.Instance,
    entityId: Game.Entity["id"]
  ): Game.Entity | undefined => getEntities(instance).find((entity) => entity.id === entityId);

  export const getEntityAbilities = (entity: Game.Entity): Array<Game.Ability> => {
    if (entity.type === "monster") return entity.playable.abilities;
    if (entity.type === "chest" || entity.type === "campfire") return [];

    return entity.playable.inventory
      .filter((entry) => entry.equipped && entry.item.type === "weapon")
      .flatMap((entry) => entry.item.abilities);
  };

  export const calculateCharacterStats = (
    c: { attributes: Record<Game.Attribute, number>; level: number; memory: number },
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

  export const generateRandomName = (c: { race: Game.Race }) => {
    const NAME_PREFIXES: Record<Game.Race, Array<string>> = {
      dwarf: ["Thor", "Brom", "Gim", "Dwa", "Bal", "Krag", "Dum", "Thrain"],
      elf: ["Gala", "Lego", "Ara", "Cele", "Thran", "Elro", "Fea", "Luth"],
      human: ["Ara", "Bran", "Cath", "Dun", "Eri", "Finn", "Gwen", "Hal"],
      orc: ["Grom", "Thrak", "Durg", "Mog", "Grak", "Urg", "Brok", "Skar"],
    };

    const NAME_SUFFIXES: Record<Game.Race, Array<string>> = {
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

  export const getAbilityImpactTiles = (
    target: Game.Position,
    targeting: number
  ): Array<Game.Position> => {
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
    entities: Array<Game.Entity>,
    ability: Game.Ability,
    target: Game.Position
  ): Array<Game.CombatEntity> => {
    const combatEntities = entities.filter(
      (entity): entity is Game.CombatEntity =>
        entity.type === "character" || entity.type === "monster"
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
    caster: Game.Entity,
    ability: Game.Ability,
    entities: Array<Game.Entity>
  ): Array<Game.Position> => {
    const maxRange = Math.max(0, ability.range);
    const possible: Array<Position> = [];

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

  export const canEquipItem = (character: Game.Character, itemType: Game.ItemType): boolean => {
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

  // ────────────────────────────────────────────────────────────────────────────
  // Rest & Leveling System
  // ────────────────────────────────────────────────────────────────────────────

  export const calculateRestHealing = (
    character: { level: number; maxHp: number; attributes: Record<Game.Attribute, number> },
    actionsSpentResting: number
  ): number => {
    // Base healing: 1 HP per action spent resting
    const baseHealing = actionsSpentResting;

    // Constitution modifier: +0.15% per level in constitution
    const constitutionBonus = Math.floor(
      (baseHealing * (character.attributes.constitution * 0.15)) / 100
    );

    // Level scaling: 5% per level above 1
    const levelBonus = Math.floor(baseHealing * (character.level - 1) * 0.05);

    // Total healing cannot exceed missing HP or 20% of maxHp per action spent
    const maxHealingPerAction = Math.ceil(character.maxHp * 0.2);
    const totalHealing = baseHealing + constitutionBonus + levelBonus;

    return Math.min(totalHealing, actionsSpentResting * maxHealingPerAction);
  };
}
