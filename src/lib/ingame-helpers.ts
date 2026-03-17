import { Game } from "@/lib/types";

export namespace InGameHelpers {
  export const withEffects = (
    effects: Partial<Record<Game.Effect, number>> = {}
  ): Record<Game.Effect, number> => ({ ...Game.EMPTY_EFFECTS, ...effects });

  export const getEntities = (instance: Game.Instance): Array<Game.Entity> => [
    ...instance.characters,
    ...instance.monsters,
    ...instance.chests,
    ...instance.campfires,
  ];

  export const getEntityById = (
    instance: Game.Instance,
    entityId: string
  ): Game.Entity | undefined => getEntities(instance).find((entity) => entity.id === entityId);

  export const getEntityAbilities = (entity: Game.Entity): Array<Game.Ability> => {
    if (entity.type === "monster") return entity.abilities;
    if (entity.type === "chest" || entity.type === "campfire") return [];

    return entity.inventory
      .filter((entry: any) => entry.equipped && entry.type === "weapon")
      .flatMap((entry: any) => entry.abilities);
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
    void entities;
    const maxRange = Math.max(0, ability.range);
    const possible: Array<Game.Position> = [];

    for (let dx = -maxRange; dx <= maxRange; dx++) {
      for (let dz = -maxRange; dz <= maxRange; dz++) {
        if (Math.abs(dx) + Math.abs(dz) > maxRange) continue;
        const target = { x: caster.position.x + dx, z: caster.position.z + dz };
        possible.push(target);
      }
    }

    return possible;
  };

  export const canEquipItem = (character: Game.Character, itemType: Game.ItemType): boolean => {
    if (itemType === "misc") return false;
    const equippedOfType = character.inventory.filter(
      (inv: any) => inv.equipped && inv.type === itemType
    ).length;
    const maxSlots = itemType === "ring" ? 2 : 1;
    return equippedOfType < maxSlots;
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Rest & Leveling System
  // ────────────────────────────────────────────────────────────────────────────

  export const calculateRestHealing = (
    character: Game.Character,
    actionsSpentResting: number
  ): number => {
    const baseHealing = actionsSpentResting;
    const constitutionBonus = Math.floor(
      (baseHealing * (character.attributes.constitution * 0.15)) / 100
    );
    const levelBonus = Math.floor(baseHealing * (character.level - 1) * 0.05);
    const maxHealingPerAction = Math.ceil(character.maxHp * 0.2);
    const totalHealing = baseHealing + constitutionBonus + levelBonus;
    return Math.min(totalHealing, actionsSpentResting * maxHealingPerAction);
  };
}
