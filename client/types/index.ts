export type LifestyleProfile = {
  age?: string;
  homeType?: string;
  activityLevel?: string;
  preferences?: string[];
};

export type BreedTraitScore = {
  label: string;
  value: number;
};

export type BreedInterpretation = {
  summary: string;
  traits: BreedTraitScore[];
};

export type BreedComparison = {
  summary: string;
  rankings: Array<{ breedId: string; score: number; reason: string }>;
};
