import type { Attribute, Character, Element } from "@/types/game";
import { create } from "zustand";

type CharacterStore = {
  can: boolean;
  setCan: (can: boolean) => void;

  character: Character;
  set: <K extends keyof Character>(key: K, value: Character[K]) => void;
  setAttribute: (attr: Attribute, value: number) => void;
  setResistance: (element: Element, value: number) => void;
  reset: () => void;
};

export const useCharacterStore = create<CharacterStore>((set) => ({
  can: true,

  setCan: (can: boolean) => set({ can }),

  character: {
    name: "",
    level: 1,
    class: "barbarian",
    resources: { actions: [0, 0], hp: [0, 0], stamina: [0, 0], cast: [0, 0] },
    race: "human",
    attributes: { str: 8, dex: 8, con: 8, wis: 8, int: 8, cha: 8 },
    actions: [],
    inventory: {},
    effects: {
      burning: 0,
      bleeding: 0,
      poisoned: 0,
      corroding: 0,
      stunned: 0,
      frozen: 0,
      slowed: 0,
      silenced: 0,
      blinded: 0,
      confused: 0,
      shocked: 0,
      broken: 0,
      weakened: 0,
      cursed: 0,
      shattered: 0,
      vulnerable: 0,
      battlecry: 0,
      regenerating: 0,
      shielded: 0,
      hasted: 0,
      strengthened: 0,
      focused: 0,
      invisible: 0,
    },
    resistances: {
      acid: 0,
      blunt: 0,
      cold: 0,
      fire: 0,
      necrotic: 0,
      pierce: 0,
      poison: 0,
      slash: 0,
      thunder: 0,
      psychic: 0,
    },
  },

  set: (key, value) =>
    set((state) => ({ character: { ...state.character, [key]: value } })),

  setAttribute: (attr, value) =>
    set((state) => ({
      character: {
        ...state.character,
        attributes: { ...state.character.attributes, [attr]: value },
      },
    })),

  setResistance: (element, value) =>
    set((state) => ({
      character: {
        ...state.character,
        resistances: { ...state.character.resistances, [element]: value },
      },
    })),

  reset: () =>
    set(() => ({
      can: true,
      character: {
        resources: {
          actions: [0, 0],
          hp: [0, 0],
          stamina: [0, 0],
          cast: [0, 0],
        },
        effects: {
          burning: 0,
          bleeding: 0,
          poisoned: 0,
          corroding: 0,
          stunned: 0,
          frozen: 0,
          slowed: 0,
          silenced: 0,
          blinded: 0,
          confused: 0,
          shocked: 0,
          broken: 0,
          weakened: 0,
          cursed: 0,
          shattered: 0,
          vulnerable: 0,
          battlecry: 0,
          regenerating: 0,
          shielded: 0,
          hasted: 0,
          strengthened: 0,
          focused: 0,
          invisible: 0,
        },
        name: "",
        level: 1,
        class: "barbarian",
        race: "human",
        attributes: { str: 8, dex: 8, con: 8, wis: 8, int: 8, cha: 8 },
        actions: [],
        inventory: {},
        resistances: {
          acid: 0,
          blunt: 0,
          cold: 0,
          fire: 0,
          necrotic: 0,
          pierce: 0,
          poison: 0,
          slash: 0,
          thunder: 0,
          psychic: 0,
        },
      },
    })),
}));
