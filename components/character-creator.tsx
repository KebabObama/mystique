"use client";

import { ChevronLeft, ChevronRight, Minus, Plus, Sparkles } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import type { Attribute, Character, Class, Race } from "@/types/game";
import { ATTRIBUTES, CLASSES, RACES } from "@/types/game/consts";
import { Button } from "./ui/button";
import Dialog from "./ui/dialog";

type Step = "race" | "class" | "attributes" | "summary";

const ATTRIBUTE_POINTS = 21;
const MIN_ATTRIBUTE = 8;
const MAX_ATTRIBUTE = 20;

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

	const handleNext = () => {
		if (step === "race") setStep("class");
		else if (step === "class") setStep("attributes");
		else if (step === "attributes") setStep("summary");
		else {
			// Create character
			console.log("Creating character:", character);
			setOpen(false);
			setStep("race");
		}
	};

	const handleBack = () => {
		if (step === "class") setStep("race");
		else if (step === "attributes") setStep("class");
		else if (step === "summary") setStep("attributes");
	};

	const canProceed = () => {
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
			<Dialog.Content className="sm:max-w-2xl max-h-[90vh] h-full">
				<Dialog.Header>
					<Dialog.Title className="text-2xl">
						{step === "race" && "Choose Your Race"}
						{step === "class" && "Choose Your Class"}
						{step === "attributes" && "Assign Attributes"}
						{step === "summary" && "Character Summary"}
					</Dialog.Title>
					<Dialog.Description>
						{step === "race" &&
							"Select the race that defines your character's heritage"}
						{step === "class" && "Select your character's class and role"}
						{step === "attributes" &&
							`Distribute ${ATTRIBUTE_POINTS} points across your attributes`}
						{step === "summary" && "Review your character before creation"}
					</Dialog.Description>
				</Dialog.Header>

				<div className="py-6">
					{/* Race Selection */}
					{step === "race" && (
						<div className="grid grid-cols-2 gap-4">
							{RACES.map((race) => (
								<button
									key={race}
									type="button"
									onClick={() => setCharacter({ ...character, race })}
									className={cn(
										"relative p-6 text-left transition-all border-2 bg-card hover:bg-muted/50",
										character.race === race
											? "border-foreground shadow-lg scale-105"
											: "border-border hover:border-foreground/50",
									)}
								>
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
										"relative p-6 text-left transition-all border-2 bg-card hover:bg-muted/50",
										character.class === cls
											? "border-foreground shadow-lg scale-105"
											: "border-border hover:border-foreground/50",
									)}
								>
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
							<div className="text-center mb-6">
								<p className="text-lg font-semibold">
									Points Remaining:{" "}
									<span
										className={cn(
											"text-2xl",
											remainingPoints === 0
												? "text-green-500"
												: "text-foreground",
										)}
									>
										{remainingPoints}
									</span>
								</p>
							</div>
							<div className="grid grid-cols-2 gap-4">
								{ATTRIBUTES.map((attr) => (
									<div
										key={attr}
										className="flex items-center justify-between p-4 bg-muted/30 border border-border"
									>
										<div className="flex-1">
											<p className="font-semibold">{getAttributeName(attr)}</p>
											<p className="text-sm text-muted-foreground uppercase">
												{attr}
											</p>
										</div>
										<div className="flex items-center gap-4">
											<Button
												size="icon"
												variant="outline"
												onClick={() => updateAttribute(attr, -1)}
												disabled={character.attributes[attr] <= MIN_ATTRIBUTE}
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
											>
												<Plus className="size-4" />
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Summary */}
					{step === "summary" && (
						<div className="space-y-6">
							<div className="grid grid-cols-2 gap-4">
								<div className="p-4 bg-muted/30 border border-border">
									<p className="text-sm text-muted-foreground mb-1">Race</p>
									<p className="text-lg font-semibold capitalize">
										{character.race}
									</p>
								</div>
								<div className="p-4 bg-muted/30 border border-border">
									<p className="text-sm text-muted-foreground mb-1">Class</p>
									<p className="text-lg font-semibold capitalize">
										{character.class}
									</p>
								</div>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-3">Attributes</h3>
								<div className="grid grid-cols-2 gap-3">
									{ATTRIBUTES.map((attr) => (
										<div
											key={attr}
											className="flex justify-between p-3 bg-muted/30 border border-border"
										>
											<span className="font-medium">
												{getAttributeName(attr)}
											</span>
											<span className="font-bold">
												{character.attributes[attr]}
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
						{step === "summary" ? "Create" : "Next"}
						{step !== "summary" && <ChevronRight className="size-4" />}
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog>
	);
};
