"use client";

import {
	ChevronLeft,
	ChevronRight,
	Minus,
	Plus,
	Shuffle,
	Sparkles,
	User,
} from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import type { Attribute, Character, Class, Race } from "@/types/game";
import { ATTRIBUTES, CLASSES, RACES } from "@/types/game/consts";
import { Button } from "./ui/button";
import Dialog from "./ui/dialog";
import { Input } from "./ui/input";

type Step = "name" | "race" | "class" | "attributes" | "summary";

const ATTRIBUTE_POINTS = 21;
const MIN_ATTRIBUTE = 8;
const MAX_ATTRIBUTE = 20;

const NAME_PREFIXES: Record<Race, string[]> = {
	dragonborn: ["Drak", "Shar", "Kava", "Zor", "Mera", "Thar", "Bala", "Nyx"],
	dwarf: ["Thor", "Brom", "Gim", "Dwa", "Bal", "Krag", "Dum", "Thrain"],
	elf: ["Gala", "Lego", "Ara", "Cele", "Thran", "Elro", "Fea", "Luth"],
	human: ["Ara", "Bran", "Cath", "Dun", "Eri", "Finn", "Gwen", "Hal"],
	orc: ["Grom", "Thrak", "Durg", "Mog", "Grak", "Urg", "Brok", "Skar"],
	tiefling: ["Zar", "Mor", "Kael", "Dae", "Raz", "Vel", "Nyx", "Ash"],
};

const NAME_SUFFIXES: Record<Race, string[]> = {
	dragonborn: ["oth", "ash", "nar", "ix", "ath", "orn", "yx", "ion"],
	dwarf: ["in", "li", "dur", "nar", "rim", "dan", "bur", "rik"],
	elf: ["driel", "las", "wen", "born", "duil", "ion", "nor", "ien"],
	human: ["gorn", "wen", "ric", "ley", "ton", "wyn", "dor", "ian"],
	orc: ["ash", "nak", "ush", "gul", "lok", "tar", "gar", "dak"],
	tiefling: ["iel", "oth", "ax", "mon", "ius", "eth", "ara", "lyn"],
};

const generateRandomName = (race: Race): string => {
	const prefixes = NAME_PREFIXES[race];
	const suffixes = NAME_SUFFIXES[race];
	const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
	const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
	return prefix + suffix;
};

const getRaceDescription = (race: Race): string => {
	const descriptions: Record<Race, string> = {
		dragonborn: "Noble warriors with draconic ancestry and breath weapons",
		dwarf: "Sturdy and resilient, masters of stone and metal",
		elf: "Graceful and long-lived, attuned to magic and nature",
		human: "Versatile and ambitious, adaptable to any role",
		orc: "Fierce and powerful, born for battle",
		tiefling: "Infernal heritage grants dark powers and resilience",
	};
	return descriptions[race];
};

const getClassDescription = (cls: Class): string => {
	const descriptions: Record<Class, string> = {
		barbarian: "Fierce warrior who channels rage in battle",
		bard: "Charismatic performer who weaves magic through music",
		cleric: "Divine spellcaster who channels the power of the gods",
		ranger: "Skilled hunter and tracker, master of wilderness",
		wizard: "Scholarly mage who masters arcane spells",
		warlock: "Wielder of eldritch power from otherworldly patrons",
	};
	return descriptions[cls];
};

const getAttributeName = (attr: Attribute): string => {
	const names: Record<Attribute, string> = {
		str: "Strength",
		dex: "Dexterity",
		con: "Constitution",
		int: "Intelligence",
		wis: "Wisdom",
		cha: "Charisma",
	};
	return names[attr];
};

export const CharacterCreator = () => {
	const [open, setOpen] = React.useState(false);
	const [step, setStep] = React.useState<Step>("race");
	const [characterName, setCharacterName] = React.useState("");
	const [character, setCharacter] = React.useState<Character>({
		user: "me",
		level: 1,
		class: "barbarian",
		race: "dragonborn",
		actions: [],
		attributes: {
			str: 8,
			dex: 8,
			con: 8,
			int: 8,
			wis: 8,
			cha: 8,
		},
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
	});

	const totalAttributePoints = React.useMemo(() => {
		return Object.values(character.attributes).reduce(
			(sum, val) => sum + val,
			0,
		);
	}, [character.attributes]);

	const remainingPoints =
		ATTRIBUTE_POINTS + MIN_ATTRIBUTE * 6 - totalAttributePoints;

	const updateAttribute = (attr: Attribute, delta: number) => {
		const newValue = character.attributes[attr] + delta;
		if (newValue >= MIN_ATTRIBUTE && newValue <= MAX_ATTRIBUTE) {
			if (delta > 0 && remainingPoints <= 0) return;
			setCharacter({
				...character,
				attributes: { ...character.attributes, [attr]: newValue },
			});
		}
	};

	const handleRandomName = () => {
		setCharacterName(generateRandomName(character.race));
	};

	const handleNext = () => {
		if (step === "race") setStep("class");
		else if (step === "class") setStep("attributes");
		else if (step === "attributes") setStep("name");
		else if (step === "name") setStep("summary");
		else {
			// Create character
			console.log("Creating character:", { ...character, name: characterName });
			setOpen(false);
			setStep("race");
			setCharacterName("");
		}
	};

	const handleBack = () => {
		if (step === "class") setStep("race");
		else if (step === "attributes") setStep("class");
		else if (step === "name") setStep("attributes");
		else if (step === "summary") setStep("name");
	};

	const canProceed = () => {
		if (step === "name") return characterName.trim().length > 0;
		if (step === "attributes") return remainingPoints === 0;
		return true;
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<Button size="lg" className="gap-2">
					<Sparkles className="size-6" />
					Create Character
				</Button>
			</Dialog.Trigger>
			<Dialog.Content className="sm:max-w-2xl lg:max-w-6xl max-h-[90vh] h-full">
				<Dialog.Header>
					<Dialog.Title className="text-2xl">
						{step === "race" && "Choose Your Race"}
						{step === "class" && "Choose Your Class"}
						{step === "attributes" && "Assign Attributes"}
						{step === "name" && "Name Your Character"}
						{step === "summary" && "Character Summary"}
					</Dialog.Title>
					<Dialog.Description>
						{step === "race" &&
							"Select the race that defines your character's heritage"}
						{step === "class" && "Select your character's class and role"}
						{step === "attributes" &&
							`Distribute ${ATTRIBUTE_POINTS} points across your attributes`}
						{step === "name" && "Give your character a unique name"}
						{step === "summary" && "Review your character before creation"}
					</Dialog.Description>
				</Dialog.Header>

				<div className="h-full overflow-x-hidden px-1.5 overflow-y-auto">
					{/* Race Selection */}
					{step === "race" && (
						<div className="grid grid-cols-2 gap-4">
							{RACES.map((race) => (
								<button
									key={race}
									type="button"
									onClick={() => setCharacter({ ...character, race })}
									className={cn(
										"relative p-6 text-left transition-all border-2 bg-card hover:bg-muted/50 group",
										character.race === race
											? "border-primary shadow-lg scale-[1.02] bg-primary/5"
											: "border-border hover:border-foreground/50",
									)}
								>
									{character.race === race && (
										<div className="absolute top-2 right-2 size-6 rounded-full bg-primary flex items-center justify-center">
											<Sparkles className="size-4 text-primary-foreground" />
										</div>
									)}
									<h3 className="text-lg font-semibold capitalize mb-2">
										{race}
									</h3>
									<p className="text-sm text-muted-foreground">
										{getRaceDescription(race)}
									</p>
								</button>
							))}
						</div>
					)}

					{/* Class Selection */}
					{step === "class" && (
						<div className="grid grid-cols-2 gap-4">
							{CLASSES.map((cls) => (
								<button
									key={cls}
									type="button"
									onClick={() => setCharacter({ ...character, class: cls })}
									className={cn(
										"relative p-6 text-left transition-all border-2 bg-card hover:bg-muted/50 group",
										character.class === cls
											? "border-primary shadow-lg scale-[1.02] bg-primary/5"
											: "border-border hover:border-foreground/50",
									)}
								>
									{character.class === cls && (
										<div className="absolute top-2 right-2 size-6 rounded-full bg-primary flex items-center justify-center">
											<Sparkles className="size-4 text-primary-foreground" />
										</div>
									)}
									<h3 className="text-lg font-semibold capitalize mb-2">
										{cls}
									</h3>
									<p className="text-sm text-muted-foreground">
										{getClassDescription(cls)}
									</p>
								</button>
							))}
						</div>
					)}

					{/* Attributes */}
					{step === "attributes" && (
						<div className="space-y-4">
							<div className="text-center mb-6 p-4 bg-muted/30 border border-border">
								<p className="text-sm text-muted-foreground mb-1">
									Points Remaining
								</p>
								<p
									className={cn(
										"text-4xl font-bold",
										remainingPoints === 0
											? "text-green-500"
											: remainingPoints < 5
												? "text-orange-500"
												: "text-foreground",
									)}
								>
									{remainingPoints}
								</p>
								{remainingPoints === 0 && (
									<p className="text-xs text-green-500 mt-1">
										All points allocated!
									</p>
								)}
							</div>
							<div className="grid grid-cols-2 gap-4">
								{ATTRIBUTES.map((attr) => (
									<div
										key={attr}
										className="flex items-center justify-between p-4 bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
									>
										<div className="flex-1">
											<p className="font-semibold">{getAttributeName(attr)}</p>
											<p className="text-sm text-muted-foreground uppercase">
												{attr}
											</p>
										</div>
										<div className="flex items-center gap-3">
											<Button
												size="icon"
												variant="outline"
												onClick={() => updateAttribute(attr, -1)}
												disabled={character.attributes[attr] <= MIN_ATTRIBUTE}
												className="size-8"
											>
												<Minus className="size-4" />
											</Button>
											<span className="text-2xl font-bold w-12 text-center">
												{character.attributes[attr]}
											</span>
											<Button
												size="icon"
												variant="outline"
												onClick={() => updateAttribute(attr, 1)}
												disabled={
													character.attributes[attr] >= MAX_ATTRIBUTE ||
													remainingPoints <= 0
												}
												className="size-8"
											>
												<Plus className="size-4" />
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Name Input */}
					{step === "name" && (
						<div className="space-y-6">
							<div className="flex items-center justify-center mb-8">
								<div className="size-24 rounded-full bg-primary/10 border-2 border-primary/50 flex items-center justify-center">
									<User className="size-12 text-primary" />
								</div>
							</div>
							<div className="space-y-4">
								<div className="p-4 bg-muted/30 border border-border rounded-lg">
									<p className="text-sm text-muted-foreground mb-3 text-center">
										Your Character
									</p>
									<p className="text-center text-lg capitalize font-semibold">
										Level {character.level} {character.race} {character.class}
									</p>
								</div>
								<div className="space-y-2">
									<label
										htmlFor="character-name"
										className="text-sm font-medium"
									>
										Character Name
									</label>
									<div className="flex gap-2">
										<Input
											id="character-name"
											type="text"
											placeholder="Enter character name..."
											value={characterName}
											onChange={(e) => setCharacterName(e.target.value)}
											className="flex-1"
											autoFocus
										/>
										<Button
											type="button"
											variant="outline"
											size="icon"
											onClick={handleRandomName}
											title="Generate random name"
										>
											<Shuffle className="size-4" />
										</Button>
									</div>
								</div>
								<p className="text-sm text-muted-foreground">
									Choose a name that reflects your character's personality and
									heritage. You can also generate a random name based on your
									selected race.
								</p>
							</div>
						</div>
					)}

					{/* Summary */}
					{step === "summary" && (
						<div className="space-y-6">
							<div className="flex flex-col items-center mb-6 p-6 bg-gradient-to-b from-muted/50 to-transparent border border-border rounded-lg">
								<div className="size-24 rounded-full bg-primary/10 border-2 border-primary/50 flex items-center justify-center mb-4">
									<User className="size-12 text-primary" />
								</div>
								<h2 className="text-3xl font-bold mb-1">{characterName}</h2>
								<p className="text-muted-foreground capitalize text-lg">
									Level {character.level} {character.race} {character.class}
								</p>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="p-5 bg-muted/30 border border-border rounded-lg hover:bg-muted/40 transition-colors">
									<p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
										Race
									</p>
									<p className="text-xl font-bold capitalize mb-2">
										{character.race}
									</p>
									<p className="text-sm text-muted-foreground">
										{getRaceDescription(character.race)}
									</p>
								</div>
								<div className="p-5 bg-muted/30 border border-border rounded-lg hover:bg-muted/40 transition-colors">
									<p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
										Class
									</p>
									<p className="text-xl font-bold capitalize mb-2">
										{character.class}
									</p>
									<p className="text-sm text-muted-foreground">
										{getClassDescription(character.class)}
									</p>
								</div>
							</div>
							<div className="p-5 bg-muted/30 border border-border rounded-lg">
								<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
									<Sparkles className="size-5 text-primary" />
									Attributes
								</h3>
								<div className="grid grid-cols-3 gap-3">
									{ATTRIBUTES.map((attr) => (
										<div
											key={attr}
											className="flex flex-col items-center p-3 bg-background/50 border border-border rounded-lg"
										>
											<span className="text-xs text-muted-foreground uppercase mb-1">
												{attr}
											</span>
											<span className="text-2xl font-bold">
												{character.attributes[attr]}
											</span>
											<span className="text-xs text-muted-foreground mt-1">
												{getAttributeName(attr)}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					)}
				</div>

				<Dialog.Footer className="flex justify-between">
					{step !== "race" && (
						<Button variant="outline" onClick={handleBack}>
							<ChevronLeft className="size-4" />
							Back
						</Button>
					)}
					<Button
						onClick={handleNext}
						disabled={!canProceed()}
						className="ml-auto"
					>
						{step === "summary" ? "Create Character" : "Next"}
						{step !== "summary" && <ChevronRight className="size-4" />}
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog>
	);
};
