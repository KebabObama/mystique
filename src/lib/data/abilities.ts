import { AbilityPreserve } from "@/types/game/abilities.internal";

// Generate levelled damage abilities (I-VIII) plus 2 buffs and 2 debuffs per element.
// Damage scales with level; costs roughly map to power tiers.
export const ABILITIES = [
  // --- Acid (corroding) ---
  { name: "Acid Strike I", cost: 1, targeting: ["ranged", 8], effects: [["corroding", 0]], damage: [["acid", 1, 4]] },
  { name: "Acid Strike II", cost: 1, targeting: ["ranged", 8], effects: [["corroding", 1]], damage: [["acid", 2, 5]] },
  { name: "Acid Strike III", cost: 2, targeting: ["ranged", 8], effects: [["corroding", 1]], damage: [["acid", 3, 6]] },
  { name: "Acid Strike IV", cost: 2, targeting: ["ranged", 8], effects: [["corroding", 2]], damage: [["acid", 4, 8]] },
  { name: "Acid Strike V", cost: 3, targeting: ["ranged", 10], effects: [["corroding", 2]], damage: [["acid", 5, 10]] },
  {
    name: "Acid Strike VI",
    cost: 3,
    targeting: ["ranged", 10],
    effects: [["corroding", 3]],
    damage: [["acid", 6, 12]],
  },
  {
    name: "Acid Strike VII",
    cost: 4,
    targeting: ["ranged", 12],
    effects: [["corroding", 4]],
    damage: [["acid", 7, 14]],
  },
  {
    name: "Acid Strike VIII",
    cost: 4,
    targeting: ["aoe", 10, 2],
    effects: [["corroding", 5]],
    damage: [["acid", 8, 16]],
  },
  {
    name: "Corrosive Shield",
    cost: 2,
    targeting: ["self"],
    effects: [
      ["fortified", 2],
      ["corroding", 1],
    ],
    damage: [],
  },
  {
    name: "Erosive Haze",
    cost: 2,
    targeting: ["aoe", 6, 2],
    effects: [
      ["corroding", 2],
      ["weakened", 1],
    ],
    damage: [["acid", 1, 3]],
  },
  {
    name: "Pitting Curse",
    cost: 3,
    targeting: ["ranged", 7],
    effects: [
      ["corroding", 3],
      ["weakened", 2],
    ],
    damage: [],
  },
  { name: "Acid Fortify", cost: 1, targeting: ["self"], effects: [["regenerating", 1]], damage: [] },

  // --- Cold (frostbite) ---
  { name: "Frost Strike I", cost: 1, targeting: ["ranged", 9], effects: [["frostbite", 0]], damage: [["cold", 1, 4]] },
  { name: "Frost Strike II", cost: 1, targeting: ["ranged", 9], effects: [["frostbite", 1]], damage: [["cold", 2, 5]] },
  {
    name: "Frost Strike III",
    cost: 2,
    targeting: ["ranged", 9],
    effects: [["frostbite", 1]],
    damage: [["cold", 3, 6]],
  },
  { name: "Frost Strike IV", cost: 2, targeting: ["ranged", 9], effects: [["frostbite", 2]], damage: [["cold", 4, 8]] },
  {
    name: "Frost Strike V",
    cost: 3,
    targeting: ["ranged", 11],
    effects: [["frostbite", 2]],
    damage: [["cold", 5, 10]],
  },
  {
    name: "Frost Strike VI",
    cost: 3,
    targeting: ["ranged", 11],
    effects: [["frostbite", 3]],
    damage: [["cold", 6, 12]],
  },
  {
    name: "Frost Strike VII",
    cost: 4,
    targeting: ["ranged", 12],
    effects: [["frostbite", 4]],
    damage: [["cold", 7, 14]],
  },
  {
    name: "Frost Strike VIII",
    cost: 4,
    targeting: ["aoe", 8, 2],
    effects: [["frostbite", 5]],
    damage: [["cold", 8, 16]],
  },
  {
    name: "Icy Barrier",
    cost: 2,
    targeting: ["self"],
    effects: [
      ["fortified", 2],
      ["slowed", 0],
    ],
    damage: [],
  },
  {
    name: "Glacial Bind",
    cost: 2,
    targeting: ["cone", 4],
    effects: [
      ["frostbite", 2],
      ["slowed", 2],
    ],
    damage: [],
  },
  {
    name: "Shiver Curse",
    cost: 3,
    targeting: ["ranged", 8],
    effects: [
      ["frostbite", 3],
      ["stunned", 1],
    ],
    damage: [],
  },
  { name: "Winter's Blessing", cost: 1, targeting: ["self"], effects: [["regenerating", 1]], damage: [] },

  // --- Fire (burning) ---
  { name: "Flame Strike I", cost: 1, targeting: ["ranged", 10], effects: [["burning", 0]], damage: [["fire", 1, 4]] },
  { name: "Flame Strike II", cost: 1, targeting: ["ranged", 10], effects: [["burning", 1]], damage: [["fire", 2, 5]] },
  { name: "Flame Strike III", cost: 2, targeting: ["ranged", 10], effects: [["burning", 1]], damage: [["fire", 3, 6]] },
  { name: "Flame Strike IV", cost: 2, targeting: ["ranged", 10], effects: [["burning", 2]], damage: [["fire", 4, 8]] },
  { name: "Flame Strike V", cost: 3, targeting: ["ranged", 12], effects: [["burning", 2]], damage: [["fire", 5, 10]] },
  { name: "Flame Strike VI", cost: 3, targeting: ["ranged", 12], effects: [["burning", 3]], damage: [["fire", 6, 12]] },
  {
    name: "Flame Strike VII",
    cost: 4,
    targeting: ["ranged", 14],
    effects: [["burning", 4]],
    damage: [["fire", 7, 14]],
  },
  {
    name: "Flame Strike VIII",
    cost: 4,
    targeting: ["aoe", 10, 2],
    effects: [["burning", 5]],
    damage: [["fire", 8, 16]],
  },
  {
    name: "Ember Ward",
    cost: 2,
    targeting: ["self"],
    effects: [
      ["hastened", 1],
      ["fortified", 1],
    ],
    damage: [],
  },
  {
    name: "Scorching Mark",
    cost: 2,
    targeting: ["ranged", 8],
    effects: [
      ["burning", 2],
      ["weakened", 1],
    ],
    damage: [],
  },
  {
    name: "Singe Curse",
    cost: 3,
    targeting: ["aoe", 6, 2],
    effects: [
      ["burning", 3],
      ["weakened", 2],
    ],
    damage: [],
  },
  { name: "Kindle's Gift", cost: 1, targeting: ["self"], effects: [["energized", 1]], damage: [] },

  // --- Lightning (shocked) ---
  {
    name: "Spark Strike I",
    cost: 1,
    targeting: ["ranged", 10],
    effects: [["shocked", 0]],
    damage: [["lightning", 1, 4]],
  },
  {
    name: "Spark Strike II",
    cost: 1,
    targeting: ["ranged", 10],
    effects: [["shocked", 1]],
    damage: [["lightning", 2, 5]],
  },
  {
    name: "Spark Strike III",
    cost: 2,
    targeting: ["ranged", 10],
    effects: [["shocked", 1]],
    damage: [["lightning", 3, 6]],
  },
  {
    name: "Spark Strike IV",
    cost: 2,
    targeting: ["ranged", 10],
    effects: [["shocked", 2]],
    damage: [["lightning", 4, 8]],
  },
  {
    name: "Spark Strike V",
    cost: 3,
    targeting: ["ranged", 12],
    effects: [["shocked", 2]],
    damage: [["lightning", 5, 10]],
  },
  {
    name: "Spark Strike VI",
    cost: 3,
    targeting: ["ranged", 12],
    effects: [["shocked", 3]],
    damage: [["lightning", 6, 12]],
  },
  {
    name: "Spark Strike VII",
    cost: 4,
    targeting: ["ranged", 14],
    effects: [["shocked", 4]],
    damage: [["lightning", 7, 14]],
  },
  {
    name: "Spark Strike VIII",
    cost: 4,
    targeting: ["aoe", 10, 2],
    effects: [["shocked", 5]],
    damage: [["lightning", 8, 16]],
  },
  {
    name: "Overcharge Shield",
    cost: 2,
    targeting: ["self"],
    effects: [
      ["energized", 1],
      ["fortified", 1],
    ],
    damage: [],
  },
  {
    name: "Static Snare",
    cost: 2,
    targeting: ["cone", 4],
    effects: [
      ["shocked", 2],
      ["slowed", 2],
    ],
    damage: [],
  },
  {
    name: "Volt Disruption",
    cost: 3,
    targeting: ["ranged", 10],
    effects: [
      ["shocked", 3],
      ["confused", 1],
    ],
    damage: [],
  },
  { name: "Surge Gift", cost: 1, targeting: ["self"], effects: [["hastened", 1]], damage: [] },

  // --- Physical (bleeding) ---
  { name: "Strike I", cost: 1, targeting: ["melee"], effects: [["bleeding", 0]], damage: [["physical", 1, 4]] },
  { name: "Strike II", cost: 1, targeting: ["melee"], effects: [["bleeding", 1]], damage: [["physical", 2, 5]] },
  { name: "Strike III", cost: 2, targeting: ["melee"], effects: [["bleeding", 1]], damage: [["physical", 3, 6]] },
  { name: "Strike IV", cost: 2, targeting: ["melee"], effects: [["bleeding", 2]], damage: [["physical", 4, 8]] },
  { name: "Strike V", cost: 3, targeting: ["melee"], effects: [["bleeding", 2]], damage: [["physical", 5, 10]] },
  { name: "Strike VI", cost: 3, targeting: ["melee"], effects: [["bleeding", 3]], damage: [["physical", 6, 12]] },
  { name: "Strike VII", cost: 4, targeting: ["melee"], effects: [["bleeding", 4]], damage: [["physical", 7, 14]] },
  { name: "Strike VIII", cost: 4, targeting: ["melee", 2], effects: [["bleeding", 5]], damage: [["physical", 8, 16]] },
  { name: "Warrior's Fortitude", cost: 2, targeting: ["self"], effects: [["fortified", 3]], damage: [] },
  {
    name: "Hamstring",
    cost: 2,
    targeting: ["ranged", 6],
    effects: [
      ["bleeding", 2],
      ["slowed", 2],
    ],
    damage: [],
  },
  {
    name: "Crippling Blow",
    cost: 3,
    targeting: ["melee"],
    effects: [
      ["bleeding", 3],
      ["weakened", 2],
    ],
    damage: [],
  },
  { name: "Battle Roar", cost: 1, targeting: ["self"], effects: [["enraged", 1]], damage: [] },

  // --- Poison (toxin) ---
  { name: "Toxin Strike I", cost: 1, targeting: ["ranged", 8], effects: [["toxin", 0]], damage: [["poison", 1, 4]] },
  { name: "Toxin Strike II", cost: 1, targeting: ["ranged", 8], effects: [["toxin", 1]], damage: [["poison", 2, 5]] },
  { name: "Toxin Strike III", cost: 2, targeting: ["ranged", 8], effects: [["toxin", 1]], damage: [["poison", 3, 6]] },
  { name: "Toxin Strike IV", cost: 2, targeting: ["ranged", 8], effects: [["toxin", 2]], damage: [["poison", 4, 8]] },
  { name: "Toxin Strike V", cost: 3, targeting: ["ranged", 10], effects: [["toxin", 2]], damage: [["poison", 5, 10]] },
  { name: "Toxin Strike VI", cost: 3, targeting: ["ranged", 10], effects: [["toxin", 3]], damage: [["poison", 6, 12]] },
  {
    name: "Toxin Strike VII",
    cost: 4,
    targeting: ["ranged", 12],
    effects: [["toxin", 4]],
    damage: [["poison", 7, 14]],
  },
  {
    name: "Toxin Strike VIII",
    cost: 4,
    targeting: ["aoe", 10, 2],
    effects: [["toxin", 5]],
    damage: [["poison", 8, 16]],
  },
  {
    name: "Venom Guard",
    cost: 2,
    targeting: ["self"],
    effects: [
      ["regenerating", 1],
      ["fortified", 1],
    ],
    damage: [],
  },
  {
    name: "Noxious Bind",
    cost: 2,
    targeting: ["aoe", 6, 2],
    effects: [
      ["toxin", 2],
      ["confused", 1],
    ],
    damage: [],
  },
  {
    name: "Plague Mark",
    cost: 3,
    targeting: ["ranged", 9],
    effects: [
      ["toxin", 3],
      ["weakened", 2],
    ],
    damage: [],
  },
  { name: "Antidote Chant", cost: 1, targeting: ["self"], effects: [["regenerating", 1]], damage: [] },

  // --- Radiant (smitten) ---
  {
    name: "Radiant Strike I",
    cost: 1,
    targeting: ["ranged", 10],
    effects: [["smitten", 0]],
    damage: [["radiant", 1, 4]],
  },
  {
    name: "Radiant Strike II",
    cost: 1,
    targeting: ["ranged", 10],
    effects: [["smitten", 1]],
    damage: [["radiant", 2, 5]],
  },
  {
    name: "Radiant Strike III",
    cost: 2,
    targeting: ["ranged", 10],
    effects: [["smitten", 1]],
    damage: [["radiant", 3, 6]],
  },
  {
    name: "Radiant Strike IV",
    cost: 2,
    targeting: ["ranged", 10],
    effects: [["smitten", 2]],
    damage: [["radiant", 4, 8]],
  },
  {
    name: "Radiant Strike V",
    cost: 3,
    targeting: ["ranged", 12],
    effects: [["smitten", 2]],
    damage: [["radiant", 5, 10]],
  },
  {
    name: "Radiant Strike VI",
    cost: 3,
    targeting: ["ranged", 12],
    effects: [["smitten", 3]],
    damage: [["radiant", 6, 12]],
  },
  {
    name: "Radiant Strike VII",
    cost: 4,
    targeting: ["ranged", 14],
    effects: [["smitten", 4]],
    damage: [["radiant", 7, 14]],
  },
  {
    name: "Radiant Strike VIII",
    cost: 4,
    targeting: ["aoe", 10, 2],
    effects: [["smitten", 5]],
    damage: [["radiant", 8, 16]],
  },
  {
    name: "Aureole",
    cost: 2,
    targeting: ["self"],
    effects: [
      ["shielded", 2],
      ["regenerating", 1],
    ],
    damage: [],
  },
  {
    name: "Blinding Beacon",
    cost: 2,
    targeting: ["ranged", 8],
    effects: [
      ["smitten", 2],
      ["confused", 1],
    ],
    damage: [],
  },
  {
    name: "Judgment Mark",
    cost: 3,
    targeting: ["ranged", 12],
    effects: [
      ["smitten", 3],
      ["weakened", 2],
    ],
    damage: [],
  },
  { name: "Dawn's Grace", cost: 1, targeting: ["self"], effects: [["hastened", 1]], damage: [] },
  // --- Additional High-Level Spells (levels V - VIII): 10 per element (70 total) ---

  // Acid: 10 high-level acid spells
  { name: "Acid Vortex V", cost: 4, targeting: ["aoe", 10, 2], effects: [["corroding", 5]], damage: [["acid", 9, 18]] },
  {
    name: "Acid Vortex VI",
    cost: 5,
    targeting: ["aoe", 12, 2],
    effects: [["corroding", 6]],
    damage: [["acid", 11, 20]],
  },
  {
    name: "Acid Vortex VII",
    cost: 6,
    targeting: ["aoe", 12, 3],
    effects: [["corroding", 8]],
    damage: [["acid", 13, 22]],
  },
  {
    name: "Acid Vortex VIII",
    cost: 7,
    targeting: ["aoe", 14, 3],
    effects: [["corroding", 10]],
    damage: [["acid", 15, 24]],
  },
  {
    name: "Acid Cataclysm V",
    cost: 4,
    targeting: ["cone", 6],
    effects: [
      ["corroding", 5],
      ["weakened", 2],
    ],
    damage: [["acid", 8, 16]],
  },
  {
    name: "Acid Cataclysm VI",
    cost: 5,
    targeting: ["cone", 8],
    effects: [
      ["corroding", 6],
      ["weakened", 2],
    ],
    damage: [["acid", 10, 18]],
  },
  {
    name: "Acid Cataclysm VII",
    cost: 6,
    targeting: ["cone", 10],
    effects: [
      ["corroding", 8],
      ["weakened", 3],
    ],
    damage: [["acid", 12, 20]],
  },
  {
    name: "Acid Cataclysm VIII",
    cost: 7,
    targeting: ["cone", 12],
    effects: [
      ["corroding", 10],
      ["weakened", 4],
    ],
    damage: [["acid", 14, 24]],
  },
  {
    name: "Erosive Maelstrom V",
    cost: 5,
    targeting: ["aoe", 10, 3],
    effects: [["corroding", 7]],
    damage: [["acid", 10, 20]],
  },
  {
    name: "Erosive Maelstrom VI",
    cost: 6,
    targeting: ["aoe", 12, 3],
    effects: [["corroding", 8]],
    damage: [["acid", 12, 22]],
  },

  // Cold: 10 high-level cold spells
  {
    name: "Glacier Spike V",
    cost: 4,
    targeting: ["ranged", 12],
    effects: [["frostbite", 5]],
    damage: [["cold", 9, 18]],
  },
  {
    name: "Glacier Spike VI",
    cost: 5,
    targeting: ["ranged", 14],
    effects: [["frostbite", 6]],
    damage: [["cold", 11, 20]],
  },
  {
    name: "Glacier Spike VII",
    cost: 6,
    targeting: ["ranged", 14],
    effects: [["frostbite", 8]],
    damage: [["cold", 13, 22]],
  },
  {
    name: "Glacier Spike VIII",
    cost: 7,
    targeting: ["aoe", 12, 3],
    effects: [
      ["frostbite", 10],
      ["stunned", 1],
    ],
    damage: [["cold", 15, 24]],
  },
  {
    name: "Permafrost Shroud V",
    cost: 4,
    targeting: ["aoe", 10, 2],
    effects: [
      ["frostbite", 5],
      ["slowed", 3],
    ],
    damage: [["cold", 8, 16]],
  },
  {
    name: "Permafrost Shroud VI",
    cost: 5,
    targeting: ["aoe", 12, 2],
    effects: [
      ["frostbite", 6],
      ["slowed", 3],
    ],
    damage: [["cold", 10, 18]],
  },
  {
    name: "Permafrost Shroud VII",
    cost: 6,
    targeting: ["aoe", 12, 3],
    effects: [
      ["frostbite", 8],
      ["slowed", 4],
    ],
    damage: [["cold", 12, 20]],
  },
  {
    name: "Permafrost Shroud VIII",
    cost: 7,
    targeting: ["aoe", 14, 3],
    effects: [
      ["frostbite", 10],
      ["stunned", 1],
    ],
    damage: [["cold", 14, 24]],
  },
  {
    name: "Absolute Freeze V",
    cost: 5,
    targeting: ["cone", 8],
    effects: [
      ["frostbite", 7],
      ["slowed", 3],
    ],
    damage: [["cold", 10, 20]],
  },
  {
    name: "Absolute Freeze VI",
    cost: 6,
    targeting: ["cone", 10],
    effects: [
      ["frostbite", 8],
      ["stunned", 1],
    ],
    damage: [["cold", 12, 22]],
  },

  // Fire: 10 high-level fire spells
  { name: "Pyre Nova V", cost: 4, targeting: ["aoe", 10, 2], effects: [["burning", 5]], damage: [["fire", 9, 18]] },
  { name: "Pyre Nova VI", cost: 5, targeting: ["aoe", 12, 2], effects: [["burning", 6]], damage: [["fire", 11, 20]] },
  { name: "Pyre Nova VII", cost: 6, targeting: ["aoe", 12, 3], effects: [["burning", 8]], damage: [["fire", 13, 22]] },
  {
    name: "Pyre Nova VIII",
    cost: 7,
    targeting: ["aoe", 14, 3],
    effects: [["burning", 10]],
    damage: [["fire", 15, 24]],
  },
  {
    name: "Infernal Cyclone V",
    cost: 4,
    targeting: ["cone", 8],
    effects: [
      ["burning", 5],
      ["weakened", 2],
    ],
    damage: [["fire", 8, 16]],
  },
  {
    name: "Infernal Cyclone VI",
    cost: 5,
    targeting: ["cone", 10],
    effects: [
      ["burning", 6],
      ["weakened", 3],
    ],
    damage: [["fire", 10, 18]],
  },
  {
    name: "Infernal Cyclone VII",
    cost: 6,
    targeting: ["cone", 12],
    effects: [
      ["burning", 8],
      ["weakened", 3],
    ],
    damage: [["fire", 12, 20]],
  },
  {
    name: "Infernal Cyclone VIII",
    cost: 7,
    targeting: ["cone", 14],
    effects: [
      ["burning", 10],
      ["weakened", 4],
    ],
    damage: [["fire", 14, 24]],
  },
  {
    name: "Solar Cataclysm V",
    cost: 5,
    targeting: ["ranged", 14],
    effects: [
      ["burning", 7],
      ["hastened", 1],
    ],
    damage: [["fire", 10, 20]],
  },
  {
    name: "Solar Cataclysm VI",
    cost: 6,
    targeting: ["ranged", 16],
    effects: [
      ["burning", 8],
      ["stunned", 1],
    ],
    damage: [["fire", 12, 22]],
  },

  // Lightning: 10 high-level lightning spells
  {
    name: "Storm Lance V",
    cost: 4,
    targeting: ["ranged", 12],
    effects: [["shocked", 5]],
    damage: [["lightning", 9, 18]],
  },
  {
    name: "Storm Lance VI",
    cost: 5,
    targeting: ["ranged", 14],
    effects: [["shocked", 6]],
    damage: [["lightning", 11, 20]],
  },
  {
    name: "Storm Lance VII",
    cost: 6,
    targeting: ["ranged", 14],
    effects: [["shocked", 8]],
    damage: [["lightning", 13, 22]],
  },
  {
    name: "Storm Lance VIII",
    cost: 7,
    targeting: ["aoe", 12, 3],
    effects: [
      ["shocked", 10],
      ["stunned", 1],
    ],
    damage: [["lightning", 15, 24]],
  },
  {
    name: "Thunder Maw V",
    cost: 4,
    targeting: ["cone", 8],
    effects: [
      ["shocked", 5],
      ["confused", 2],
    ],
    damage: [["lightning", 8, 16]],
  },
  {
    name: "Thunder Maw VI",
    cost: 5,
    targeting: ["cone", 10],
    effects: [
      ["shocked", 6],
      ["confused", 3],
    ],
    damage: [["lightning", 10, 18]],
  },
  {
    name: "Thunder Maw VII",
    cost: 6,
    targeting: ["cone", 12],
    effects: [
      ["shocked", 8],
      ["confused", 3],
    ],
    damage: [["lightning", 12, 20]],
  },
  {
    name: "Thunder Maw VIII",
    cost: 7,
    targeting: ["cone", 14],
    effects: [
      ["shocked", 10],
      ["stunned", 1],
    ],
    damage: [["lightning", 14, 24]],
  },
  {
    name: "Tempest Call V",
    cost: 5,
    targeting: ["aoe", 10, 3],
    effects: [
      ["shocked", 7],
      ["hastened", 1],
    ],
    damage: [["lightning", 10, 20]],
  },
  {
    name: "Tempest Call VI",
    cost: 6,
    targeting: ["aoe", 12, 3],
    effects: [
      ["shocked", 8],
      ["stunned", 1],
    ],
    damage: [["lightning", 12, 22]],
  },

  // Physical: 10 high-level physical spells
  { name: "Maul V", cost: 4, targeting: ["melee"], effects: [["bleeding", 5]], damage: [["physical", 9, 18]] },
  { name: "Maul VI", cost: 5, targeting: ["melee"], effects: [["bleeding", 6]], damage: [["physical", 11, 20]] },
  { name: "Maul VII", cost: 6, targeting: ["melee"], effects: [["bleeding", 8]], damage: [["physical", 13, 22]] },
  {
    name: "Maul VIII",
    cost: 7,
    targeting: ["melee", 2],
    effects: [
      ["bleeding", 10],
      ["weakened", 3],
    ],
    damage: [["physical", 15, 24]],
  },
  {
    name: "Rending Storm V",
    cost: 4,
    targeting: ["aoe", 8, 2],
    effects: [
      ["bleeding", 5],
      ["hastened", 1],
    ],
    damage: [["physical", 8, 16]],
  },
  {
    name: "Rending Storm VI",
    cost: 5,
    targeting: ["aoe", 10, 2],
    effects: [
      ["bleeding", 6],
      ["weakened", 2],
    ],
    damage: [["physical", 10, 18]],
  },
  {
    name: "Rending Storm VII",
    cost: 6,
    targeting: ["aoe", 12, 3],
    effects: [
      ["bleeding", 8],
      ["weakened", 3],
    ],
    damage: [["physical", 12, 20]],
  },
  {
    name: "Rending Storm VIII",
    cost: 7,
    targeting: ["aoe", 14, 3],
    effects: [
      ["bleeding", 10],
      ["enraged", 1],
    ],
    damage: [["physical", 14, 24]],
  },
  {
    name: "Warbringer V",
    cost: 5,
    targeting: ["self"],
    effects: [
      ["fortified", 4],
      ["enraged", 1],
    ],
    damage: [],
  },
  {
    name: "Warbringer VI",
    cost: 6,
    targeting: ["self"],
    effects: [
      ["fortified", 5],
      ["enraged", 2],
    ],
    damage: [],
  },

  // Poison: 10 high-level poison spells
  { name: "Plagueburst V", cost: 4, targeting: ["aoe", 10, 2], effects: [["toxin", 5]], damage: [["poison", 9, 18]] },
  { name: "Plagueburst VI", cost: 5, targeting: ["aoe", 12, 2], effects: [["toxin", 6]], damage: [["poison", 11, 20]] },
  {
    name: "Plagueburst VII",
    cost: 6,
    targeting: ["aoe", 12, 3],
    effects: [["toxin", 8]],
    damage: [["poison", 13, 22]],
  },
  {
    name: "Plagueburst VIII",
    cost: 7,
    targeting: ["aoe", 14, 3],
    effects: [["toxin", 10]],
    damage: [["poison", 15, 24]],
  },
  {
    name: "Venom Storm V",
    cost: 4,
    targeting: ["cone", 8],
    effects: [
      ["toxin", 5],
      ["confused", 2],
    ],
    damage: [["poison", 8, 16]],
  },
  {
    name: "Venom Storm VI",
    cost: 5,
    targeting: ["cone", 10],
    effects: [
      ["toxin", 6],
      ["confused", 3],
    ],
    damage: [["poison", 10, 18]],
  },
  {
    name: "Venom Storm VII",
    cost: 6,
    targeting: ["cone", 12],
    effects: [
      ["toxin", 8],
      ["weakened", 3],
    ],
    damage: [["poison", 12, 20]],
  },
  {
    name: "Venom Storm VIII",
    cost: 7,
    targeting: ["cone", 14],
    effects: [
      ["toxin", 10],
      ["confused", 4],
    ],
    damage: [["poison", 14, 24]],
  },
  {
    name: "Toxic Sovereignty V",
    cost: 5,
    targeting: ["ranged", 12],
    effects: [
      ["toxin", 7],
      ["weakened", 2],
    ],
    damage: [["poison", 10, 20]],
  },
  {
    name: "Toxic Sovereignty VI",
    cost: 6,
    targeting: ["ranged", 14],
    effects: [
      ["toxin", 8],
      ["weakened", 3],
    ],
    damage: [["poison", 12, 22]],
  },

  // Radiant: 10 high-level radiant spells
  { name: "Dawnstar V", cost: 4, targeting: ["ranged", 12], effects: [["smitten", 5]], damage: [["radiant", 9, 18]] },
  { name: "Dawnstar VI", cost: 5, targeting: ["ranged", 14], effects: [["smitten", 6]], damage: [["radiant", 11, 20]] },
  {
    name: "Dawnstar VII",
    cost: 6,
    targeting: ["ranged", 14],
    effects: [["smitten", 8]],
    damage: [["radiant", 13, 22]],
  },
  {
    name: "Dawnstar VIII",
    cost: 7,
    targeting: ["aoe", 12, 3],
    effects: [
      ["smitten", 10],
      ["weakened", 3],
    ],
    damage: [["radiant", 15, 24]],
  },
  {
    name: "Luminous Cascade V",
    cost: 4,
    targeting: ["aoe", 10, 2],
    effects: [
      ["smitten", 5],
      ["shielded", 1],
    ],
    damage: [["radiant", 8, 16]],
  },
  {
    name: "Luminous Cascade VI",
    cost: 5,
    targeting: ["aoe", 12, 2],
    effects: [
      ["smitten", 6],
      ["shielded", 2],
    ],
    damage: [["radiant", 10, 18]],
  },
  {
    name: "Luminous Cascade VII",
    cost: 6,
    targeting: ["aoe", 12, 3],
    effects: [
      ["smitten", 8],
      ["regenerating", 2],
    ],
    damage: [["radiant", 12, 20]],
  },
  {
    name: "Luminous Cascade VIII",
    cost: 7,
    targeting: ["aoe", 14, 3],
    effects: [
      ["smitten", 10],
      ["hastened", 1],
    ],
    damage: [["radiant", 14, 24]],
  },
  {
    name: "Judicator's Wrath V",
    cost: 5,
    targeting: ["ranged", 14],
    effects: [
      ["smitten", 7],
      ["weakened", 2],
    ],
    damage: [["radiant", 10, 20]],
  },
  {
    name: "Judicator's Wrath VI",
    cost: 6,
    targeting: ["ranged", 16],
    effects: [
      ["smitten", 8],
      ["stunned", 1],
    ],
    damage: [["radiant", 12, 22]],
  },
] as const satisfies AbilityPreserve[];
