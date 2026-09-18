export type DamageState = 'empty' | 'superficial' | 'aggravated';

export interface Discipline {
  id: string;
  name: string;
  level: number;
  powers: { id: string; name: string; description: string }[];
}

export interface Advantage {
  id: string;
  name: string;
  category: string;
  level: number;
  description: string;
}

export interface Weapon {
  id: string;
  name: string;
  damage: string;
  notes: string;
}

export interface Character {
  id: string;
  name: string;
  concept: string;
  predatorType: string;
  ambition: string;
  desire: string;
  clan: string;
  generation: number;
  sire: string;
  chronicle: string;

  attributes: {
    strength: number;
    dexterity: number;
    stamina: number;
    charisma: number;
    manipulation: number;
    composure: number;
    intelligence: number;
    wits: number;
    resolve: number;
  };

  skills: {
    athletics: { value: number; spec: string };
    brawl: { value: number; spec: string };
    craft: { value: number; spec: string };
    drive: { value: number; spec: string };
    firearms: { value: number; spec: string };
    larceny: { value: number; spec: string };
    melee: { value: number; spec: string };
    stealth: { value: number; spec: string };
    survival: { value: number; spec: string };
    animalKen: { value: number; spec: string };
    etiquette: { value: number; spec: string };
    insight: { value: number; spec: string };
    intimidation: { value: number; spec: string };
    leadership: { value: number; spec: string };
    performance: { value: number; spec: string };
    persuasion: { value: number; spec: string };
    streetwise: { value: number; spec: string };
    subterfuge: { value: number; spec: string };
    academics: { value: number; spec: string };
    awareness: { value: number; spec: string };
    finance: { value: number; spec: string };
    investigation: { value: number; spec: string };
    medicine: { value: number; spec: string };
    occult: { value: number; spec: string };
    politics: { value: number; spec: string };
    science: { value: number; spec: string };
    technology: { value: number; spec: string };
  };

  healthDamage: DamageState[];
  willpowerDamage: DamageState[];
  humanity: number;
  stains: number;
  hunger: number;
  bloodPotency: number;

  disciplines: Discipline[];

  tenets: string;
  touchstones: string;
  clanBane: string;
  resonance: string;

  advantages: Advantage[];
  haven: { rating: number; merits: string; noHaven: boolean };

  trueAge: string;
  apparentAge: string;
  dateOfBirth: string;
  dateOfDeath: string;
  appearance: string;
  distinguishingFeatures: string;
  history: string;

  weapons: Weapon[];
  gear: string;

  totalXP: number;
  spentXP: number;

  createdAt: string;
  updatedAt: string;
}

export function createBlankCharacter(): Character {
  const now = new Date().toISOString();
  const makeSkill = () => ({ value: 0, spec: '' });
  return {
    id: crypto.randomUUID(),
    name: 'New Kindred',
    concept: '',
    predatorType: '',
    ambition: '',
    desire: '',
    clan: '',
    generation: 13,
    sire: '',
    chronicle: '',
    attributes: {
      strength: 1, dexterity: 1, stamina: 1,
      charisma: 1, manipulation: 1, composure: 1,
      intelligence: 1, wits: 1, resolve: 1,
    },
    skills: {
      athletics: makeSkill(), brawl: makeSkill(), craft: makeSkill(),
      drive: makeSkill(), firearms: makeSkill(), larceny: makeSkill(),
      melee: makeSkill(), stealth: makeSkill(), survival: makeSkill(),
      animalKen: makeSkill(), etiquette: makeSkill(), insight: makeSkill(),
      intimidation: makeSkill(), leadership: makeSkill(), performance: makeSkill(),
      persuasion: makeSkill(), streetwise: makeSkill(), subterfuge: makeSkill(),
      academics: makeSkill(), awareness: makeSkill(), finance: makeSkill(),
      investigation: makeSkill(), medicine: makeSkill(), occult: makeSkill(),
      politics: makeSkill(), science: makeSkill(), technology: makeSkill(),
    },
    healthDamage: Array(4).fill('empty') as DamageState[],
    willpowerDamage: Array(2).fill('empty') as DamageState[],
    humanity: 7,
    stains: 0,
    hunger: 1,
    bloodPotency: 1,
    disciplines: [],
    tenets: '',
    touchstones: '',
    clanBane: '',
    resonance: '',
    advantages: [],
    haven: { rating: 2, merits: '', noHaven: false },
    trueAge: '',
    apparentAge: '',
    dateOfBirth: '',
    dateOfDeath: '',
    appearance: '',
    distinguishingFeatures: '',
    history: '',
    weapons: [],
    gear: '',
    totalXP: 0,
    spentXP: 0,
    createdAt: now,
    updatedAt: now,
  };
}
