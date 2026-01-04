import { Game } from "@/types/game";
import { ABILITIES } from "./abilities";

export const NODES: Game.Node[] = [
  // --- 1. PYROMANCY TREE (INT Focus) ---
  { name: "spark", required: [], ability: [], attributes: { int: 1 } },
  {
    name: "ember initiate",
    required: ["spark"],
    ability: [ABILITIES["firebolt"]],
    attributes: { int: 1, wis: 1 },
  },
  {
    name: "flame dancer",
    required: ["ember initiate"],
    ability: [ABILITIES["flame throw"], ABILITIES["flame hand"]],
    attributes: { dex: 1, int: 1 },
  },
  {
    name: "blaze scholar",
    required: ["flame dancer"],
    ability: [ABILITIES["fireball"], ABILITIES["flame burst"]],
    attributes: { int: 2 },
  },
  {
    name: "magma lord",
    required: ["blaze scholar"],
    ability: [ABILITIES["melting touch"], ABILITIES["flame strike"]],
    attributes: { con: 2, int: 1 },
  },
  {
    name: "avatar of infernum",
    required: ["magma lord"],
    ability: [ABILITIES["true flame"], ABILITIES["molten realm"], ABILITIES["hug of infernum"]],
    attributes: { int: 3, wis: 2 },
  },

  // --- 2. MARTIAL PROWESS TREE (STR/DEX Focus) ---
  { name: "squire", required: [], ability: [], attributes: { str: 1 } },
  {
    name: "frontliner",
    required: ["squire"],
    ability: [ABILITIES["shield bash"], ABILITIES["leg trip"]],
    attributes: { str: 1, con: 1 },
  },
  {
    name: "gladiator",
    required: ["frontliner"],
    ability: [ABILITIES["heavy slam"], ABILITIES["bleeding gash"]],
    attributes: { str: 2 },
  },
  {
    name: "vanguard",
    required: ["gladiator"],
    ability: [ABILITIES["battle cry"], ABILITIES["parry stance"]],
    attributes: { con: 2, wis: 1 },
  },
  {
    name: "war master",
    required: ["vanguard"],
    ability: [ABILITIES["whirlwind"], ABILITIES["crushing blow"]],
    attributes: { str: 2, dex: 1 },
  },
  {
    name: "juggernaut",
    required: ["war master"],
    ability: [ABILITIES["bone breaker"], ABILITIES["iron will"]],
    attributes: { str: 3, con: 2 },
  },

  // --- 3. SCOUT & MARKSMAN TREE (DEX Focus) ---
  { name: "strider", required: [], ability: [], attributes: { dex: 1 } },
  {
    name: "skirmisher",
    required: ["strider"],
    ability: [ABILITIES["quickstep"], ABILITIES["flicker jab"]],
    attributes: { dex: 1, wis: 1 },
  },
  {
    name: "archer",
    required: ["skirmisher"],
    ability: [ABILITIES["volley"], ABILITIES["concussive shot"]],
    attributes: { dex: 2 },
  },
  {
    name: "elite ranger",
    required: ["archer"],
    ability: [ABILITIES["rapid fire"], ABILITIES["vault kick"]],
    attributes: { dex: 2, str: 1 },
  },

  // --- 4. ARCANE & ELEMENTAL TREE (INT/WIS Focus) ---
  { name: "apprentice", required: [], ability: [], attributes: { int: 1 } },
  {
    name: "elementalist",
    required: ["apprentice"],
    ability: [ABILITIES["frost bolt"], ABILITIES["arcane spark"], ABILITIES["acid splash"]],
    attributes: { int: 1, wis: 1 },
  },
  {
    name: "storm caller",
    required: ["elementalist"],
    ability: [ABILITIES["lightning strike"], ABILITIES["static field"], ABILITIES["thunderclap"]],
    attributes: { wis: 2 },
  },
  {
    name: "archmage",
    required: ["storm caller"],
    ability: [ABILITIES["chain lightning"], ABILITIES["arcane storm"], ABILITIES["astral gate"]],
    attributes: { int: 3, wis: 1 },
  },

  // --- 5. DIVINE & SANCTUARY TREE (WIS Focus) ---
  { name: "acolyte", required: [], ability: [], attributes: { wis: 1 } },
  {
    name: "healer",
    required: ["acolyte"],
    ability: [ABILITIES["minor mend"], ABILITIES["soothe mind"]],
    attributes: { wis: 1, con: 1 },
  },
  {
    name: "priest",
    required: ["healer"],
    ability: [ABILITIES["bless"], ABILITIES["holy flash"], ABILITIES["purifying mist"]],
    attributes: { wis: 2 },
  },
  {
    name: "cleric",
    required: ["priest"],
    ability: [ABILITIES["divine shield"], ABILITIES["regrowth"], ABILITIES["smite"]],
    attributes: { con: 2, wis: 1 },
  },
  {
    name: "saint",
    required: ["cleric"],
    ability: [ABILITIES["holy ground"], ABILITIES["martyr light"], ABILITIES["judgement"]],
    attributes: { wis: 3, int: 2 },
  },

  // --- 6. SHADOW & TOXIN TREE (DEX/INT Focus) ---
  { name: "outcast", required: [], ability: [], attributes: { dex: 1 } },
  {
    name: "assassin",
    required: ["outcast"],
    ability: [ABILITIES["poisoned dagger"], ABILITIES["shadow step"]],
    attributes: { dex: 2 },
  },
  {
    name: "plague bringer",
    required: ["assassin"],
    ability: [ABILITIES["venom bolt"], ABILITIES["septic strike"], ABILITIES["poison cloud"]],
    attributes: { int: 2, con: 1 },
  },
  {
    name: "reaper",
    required: ["plague bringer"],
    ability: [ABILITIES["vampiric touch"], ABILITIES["death's door"]],
    attributes: { str: 2, int: 2 },
  },

  // --- 7. HYBRID CROSS-OVER NODES (Logical Cascades) ---
  {
    name: "spellblade",
    required: ["elementalist", "gladiator"],
    ability: [ABILITIES["arcane battery"], ABILITIES["precise stab"]],
    attributes: { str: 1, int: 1, dex: 1 },
  },
  {
    name: "time warden",
    required: ["archmage", "skirmisher"],
    ability: [ABILITIES["chronoshift"], ABILITIES["temporal haste"], ABILITIES["lightning tether"]],
    attributes: { wis: 3 },
  },
  {
    name: "dark crusader",
    required: ["cleric", "assassin"],
    ability: [ABILITIES["sacred bind"], ABILITIES["corrupted grasp"]],
    attributes: { str: 2, wis: 2 },
  },
  {
    name: "earth shaker",
    required: ["vanguard", "magma lord"],
    ability: [ABILITIES["earthquake"], ABILITIES["stone wall"]],
    attributes: { str: 2, con: 2 },
  },
  {
    name: "forbidden student",
    required: ["apprentice"],
    ability: [],
    attributes: { int: 1, con: 1 },
  },
  {
    name: "warlock",
    required: ["forbidden student"],
    ability: [ABILITIES["witch's brew"], ABILITIES["decaying touch"]],
    attributes: { int: 2 },
  },
  {
    name: "void prophet",
    required: ["warlock"],
    ability: [ABILITIES["phantom pain"], ABILITIES["silence"]],
    attributes: { wis: 2, int: 1 },
  },
  {
    name: "harbinger of chaos",
    required: ["void prophet"],
    ability: [ABILITIES["entropic touch"], ABILITIES["volcanic eruption"]],
    attributes: { int: 3, con: 2 },
  },

  // --- 9. CHRONOMANCY & SPACE (WIS/INT Focus) ---
  { name: "time seeker", required: ["apprentice"], ability: [], attributes: { wis: 1 } },
  {
    name: "rift walker",
    required: ["time seeker"],
    ability: [ABILITIES["arcane spark"], ABILITIES["anchor curse"]],
    attributes: { wis: 2, dex: 1 },
  },
  {
    name: "gravity master",
    required: ["rift walker"],
    ability: [ABILITIES["gravity well"]],
    attributes: { int: 2, wis: 1 },
  },

  // --- 10. BERSERKER & BLOOD (STR/CON Focus) ---
  { name: "outlander", required: ["squire"], ability: [], attributes: { con: 1 } },
  {
    name: "blood rager",
    required: ["outlander"],
    ability: [ABILITIES["bloodlust"], ABILITIES["blood tribute"]],
    attributes: { str: 2 },
  },
  {
    name: "frenzied slayer",
    required: ["blood rager"],
    ability: [ABILITIES["berserker rage"], ABILITIES["reckless charge"]],
    attributes: { str: 1, con: 2 },
  },

  // --- 11. TACTICIAN & SUPPORT (WIS/DEX Focus) ---
  { name: "strategist", required: ["strider"], ability: [], attributes: { wis: 1 } },
  {
    name: "battle leader",
    required: ["strategist"],
    ability: [ABILITIES["valor aura"], ABILITIES["intimidate"]],
    attributes: { wis: 2, str: 1 },
  },
  {
    name: "grand tactician",
    required: ["battle leader"],
    ability: [ABILITIES["divine inspiration"], ABILITIES["adrenaline rush"]],
    attributes: { wis: 2, dex: 2 },
  },

  // --- 12. DEFENSIVE SPECIALIST (CON/WIS Focus) ---
  { name: "warden", required: ["squire"], ability: [], attributes: { con: 1 } },
  {
    name: "iron bastion",
    required: ["warden"],
    ability: [ABILITIES["iron skin"], ABILITIES["stone wall"]],
    attributes: { con: 2, str: 1 },
  },
  {
    name: "unbreakable",
    required: ["iron bastion"],
    ability: [ABILITIES["diamond soul"]],
    attributes: { con: 3, wis: 1 },
  },

  // --- 13. HYBRID & ELITE COMBINATIONS ---
  {
    name: "frost knight",
    required: ["gladiator", "elementalist"],
    ability: [ABILITIES["frost armor"], ABILITIES["coldsnap burst"]],
    attributes: { str: 2, int: 1 },
  },
  {
    name: "sun praiser",
    required: ["priest", "blaze scholar"],
    ability: [ABILITIES["solar flare"], ABILITIES["holy fire"]],
    attributes: { wis: 2, int: 2 },
  },
  {
    name: "monk of serenity",
    required: ["skirmisher", "healer"],
    ability: [ABILITIES["meditate"], ABILITIES["battle trance"]],
    attributes: { wis: 2, dex: 2 },
  },
  {
    name: "radiant savior",
    required: ["saint"],
    ability: [ABILITIES["radiant Nova"], ABILITIES["equilibrium"]],
    attributes: { wis: 3, con: 2 },
  },
];
