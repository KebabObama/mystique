import { Attribute, Castname, Character, Class, Race } from "@/types/game";
import { CASTNAME } from "@/types/game/consts";

export const mod = (i: number, j = 10, k = 2) => Math.floor((i - j) / k);
export const castname = (e: Class): Castname => CASTNAME[e];

export namespace maxStats {
  export const stamina = (t: Character): number => {
    if (t.effects.frozen || t.effects.stunned) return 0;
    let e = 10;
    const raceModifiers: Record<Race | Class, number> = {
      orc: 1,
      tiefling: 1,
      elf: 0,
      human: 0,
      dwarf: -1,
      dragonborn: -1,
      barbarian: 1,
      ranger: 1,
      warlock: 0,
      cleric: -1,
      wizard: -1,
    };
    e += raceModifiers[t.race] + raceModifiers[t.class];
    e += mod(t.attributes.dex, undefined, 3);
    if (t.effects.battlecry) e += 1;
    if (t.effects.confused) e -= 1;
    if (t.effects.hasted) e *= 2;
    if (t.effects.slowed) e /= 2;
    return Math.floor(e);
  };

  export const health = (t: Character): number => {
    let e = 4;
    const raceModifiers: Record<Race | Class, number> = {
      orc: 2,
      dragonborn: 2,
      tiefling: 1,
      dwarf: 1,
      elf: 0,
      human: 0,
      barbarian: 2,
      ranger: 1,
      warlock: 0,
      cleric: -1,
      wizard: -1,
    };
    e += raceModifiers[t.race] + raceModifiers[t.class];
    e += mod(t.attributes.dex, undefined, 1);
    e += t.level * 2;
    if (t.effects.strengthened) e *= 2;
    if (t.effects.weakened) e /= 2;
    return Math.floor(e);
  };

  export const actions = (t: Character): number => {
    let e = 1;
    e += t.level / 5;
    if (t.effects.hasted) e *= 2;
    return Math.floor(e);
  };

  export const cast = (t: Character): number => {
    let e = 0;
    e = { barbarian: 2, ranger: 3, warlock: 0, cleric: 2, wizard: 5 }[t.class];
    e +=
      { barbarian: 0.5, ranger: 2, warlock: 0, cleric: 1, wizard: 3 }[t.class] *
      (t.level - 1);
    const d: Record<Class, Attribute> = {
      barbarian: "str",
      ranger: "dex",
      warlock: "cha",
      cleric: "wis",
      wizard: "int",
    };
    e += mod(t.attributes[d[t.class]], 0, 4);
    return Math.floor(e);
  };

  export const resources = (t: Character): Character["resources"] => {
    const hp = health(t);
    const st = stamina(t);
    const ac = actions(t);
    const cs = cast(t);
    return {
      hp: [hp, hp],
      stamina: [st, st],
      actions: [ac, ac],
      cast: [cs, cs],
    } as Character["resources"];
  };
}
