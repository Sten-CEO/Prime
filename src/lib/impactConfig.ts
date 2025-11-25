// Configuration des impacts de performance
// Ces valeurs sont configurables et déterminent le score ajouté pour chaque niveau

export const IMPACT_VALUES = {
  1: 20,  // Impact Simple
  2: 50,  // Impact Avancée
  3: 80,  // Impact Exceptionnelle
} as const;

export type ImpactLevel = 1 | 2 | 3;

export const getImpactValue = (level: ImpactLevel): number => {
  return IMPACT_VALUES[level];
};

export const getImpactLabel = (level: ImpactLevel): string => {
  switch (level) {
    case 1:
      return "Simple";
    case 2:
      return "Avancée";
    case 3:
      return "Exceptionnelle";
  }
};

export const getImpactDescription = (level: ImpactLevel): string => {
  switch (level) {
    case 1:
      return "Performance simple, effort minimal";
    case 2:
      return "Performance avancée, bon effort";
    case 3:
      return "Performance exceptionnelle, effort maximal";
  }
};

// Calcul du bonus discipline basé sur la série
export const calculateDisciplineBonus = (currentStreak: number): number => {
  if (currentStreak < 3) return 0;
  return currentStreak - 2; // Série de 3j = +1, 4j = +2, etc.
};
