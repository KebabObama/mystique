import { create } from "zustand";
import type { Attribute, Character, Element } from "@/types/game";

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
		race: "human",
		attributes: {
			str: 8,
			dex: 8,
			con: 8,
			wis: 8,
			int: 8,
			cha: 8,
		},
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

	set: (key, value) =>
		set((state) => ({
			character: { ...state.character, [key]: value },
		})),

	setAttribute: (attr, value) =>
		set((state) => ({
			character: {
				...state.character,
				attributes: {
					...state.character.attributes,
					[attr]: value,
				},
			},
		})),

	setResistance: (element, value) =>
		set((state) => ({
			character: {
				...state.character,
				resistances: {
					...state.character.resistances,
					[element]: value,
				},
			},
		})),

	reset: () =>
		set(() => ({
			can: true,
			character: {
				name: "",
				level: 1,
				class: "barbarian",
				race: "human",
				attributes: {
					str: 8,
					dex: 8,
					con: 8,
					wis: 8,
					int: 8,
					cha: 8,
				},
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
