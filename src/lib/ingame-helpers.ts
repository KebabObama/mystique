import { Game } from "@/lib/game";

/** Provides the InGameHelpers namespace. */
export namespace InGameHelpers {
    /** Defines the with effects constant. */
export const withEffects = (
    effects: Partial<Record<Game.Effect, number>> = {}
  ): Record<Game.Effect, number> =>
    Game.EFFECTS.reduce(
      (all, effect) => ({ ...all, [effect]: Math.max(0, Math.floor(effects[effect] ?? 0)) }),
      { ...Game.EMPTY_EFFECTS }
    );

  type EffectCarrier = Partial<{
    effects: Partial<Record<Game.Effect, number>> | null;
    activeEffects: Partial<Record<Game.Effect, number>> | null;
  }>;

    /** Provides the has effects function. */
export const hasEffects = (effects: Partial<Record<Game.Effect, number>> | null | undefined) =>
    Game.EFFECTS.some((effect) => (effects?.[effect] ?? 0) > 0);

    /** Defines the get stored effects constant. */
export const getStoredEffects = (entity: EffectCarrier): Record<Game.Effect, number> =>
    withEffects(entity.effects ?? {});

    /** Defines the decay effects constant. */
export const decayEffects = (
    effects: Partial<Record<Game.Effect, number>> | null | undefined,
    amount = 1
  ): Record<Game.Effect, number> =>
    Game.EFFECTS.reduce(
      (next, effect) => ({ ...next, [effect]: Math.max(0, (effects?.[effect] ?? 0) - amount) }),
      { ...Game.EMPTY_EFFECTS }
    );

    /** Defines the get turn effects constant. */
export const getTurnEffects = (entity: EffectCarrier): Record<Game.Effect, number> => {
    const activeEffects = withEffects(entity.activeEffects ?? {});
    if (!hasEffects(activeEffects)) return getStoredEffects(entity);

    const storedEffects = getStoredEffects(entity);
    const decayedActiveEffects = decayEffects(activeEffects);

    return Game.EFFECTS.reduce(
      (next, effect) => ({
        ...next,
        [effect]:
          activeEffects[effect] + Math.max(0, storedEffects[effect] - decayedActiveEffects[effect]),
      }),
      { ...Game.EMPTY_EFFECTS }
    );
  };

    /** Defines the add effect stacks constant. */
export const addEffectStacks = (
    current: Partial<Record<Game.Effect, number>> | null | undefined,
    added: Partial<Record<Game.Effect, number>> | null | undefined
  ): Record<Game.Effect, number> =>
    Game.EFFECTS.reduce(
      (next, effect) => ({
        ...next,
        [effect]: Math.max(0, (current?.[effect] ?? 0) + (added?.[effect] ?? 0)),
      }),
      { ...Game.EMPTY_EFFECTS }
    );

    /** Defines the get effective armor constant. */
export const getEffectiveArmor = (
    entity: Pick<Game.CombatEntity, "armor"> & EffectCarrier
  ): number => Math.max(0, entity.armor - getTurnEffects(entity).corroding);

    /** Defines the get effective stamina constant. */
export const getEffectiveStamina = (
    entity: Pick<Game.CombatEntity, "stamina"> & EffectCarrier
  ): number => Math.max(0, entity.stamina - getTurnEffects(entity).frostbite);

    /** Provides the resolve turn start function. */
export const resolveTurnStart = (
    entity: Pick<Game.CombatEntity, "hp" | "maxHp" | "maxActions"> & EffectCarrier
  ) => {
    const activeEffects = getStoredEffects(entity);
    const currentHp = entity.hp ?? entity.maxHp ?? 0;
    const maxHp = entity.maxHp ?? currentHp;

    return {
      activeEffects,
      effects: decayEffects(activeEffects),
      hp: Math.max(0, Math.min(maxHp, currentHp - activeEffects.burning)),
      actions: Math.max(0, (entity.maxActions ?? 0) - activeEffects.shocked),
    };
  };

    /** Defines the get entities constant. */
export const getEntities = (instance: Game.Instance): Array<Game.Entity> => [
    ...instance.characters,
    ...instance.monsters,
    ...instance.chests,
    ...instance.campfires,
  ];

    /** Defines the get entity by id constant. */
export const getEntityById = (
    instance: Game.Instance,
    entityId: Game.Entity["id"]
  ): Game.Entity | undefined => getEntities(instance).find((entity) => entity.id === entityId);

    /** Defines the get entity abilities constant. */
export const getEntityAbilities = (entity: Game.Entity): Array<Game.Ability> => {
    if (entity.type === "monster") return entity.abilities;
    if (entity.type === "chest" || entity.type === "campfire") return [];

    return entity.inventory
      .filter((entry: any) => entry.equipped && entry.type === "weapon")
      .flatMap((entry: any) => entry.abilities);
  };

    /** Provides the calculate character stats function. */
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

    /** Provides the generate random name function. */
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

    /** Defines the get ability impact tiles constant. */
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

    /** Defines the get ability victims constant. */
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

    /** Defines the get ability viable targets constant. */
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

    /** Defines the can equip item constant. */
export const canEquipItem = (
    character: Pick<Game.CharacterEntity, "inventory">,
    itemType: Game.ItemType
  ): boolean => {
    if (itemType === "misc") return false;
    const equippedOfType = character.inventory.filter(
      (inv: any) => inv.equipped && inv.type === itemType
    ).length;
    const maxSlots = itemType === "ring" ? 2 : 1;
    return equippedOfType < maxSlots;
  };

/** Defines the calculate rest healing constant. */
export const calculateRestHealing = (
    character: Pick<Game.CharacterEntity, "attributes" | "level" | "maxHp">,
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
