/**
 * Module de calcul de scores pour Prime
 * 
 * Ce fichier contient toutes les fonctions PURES de calcul de scores,
 * séries, statistiques, etc.
 */

// ============= CONSTANTES CONFIGURABLES =============

/**
 * Facteur de normalisation pour convertir le score brut en indice 0-100
 * Un avgRaw de NORMALIZATION_FACTOR correspond à un indice de 100
 */
export const NORMALIZATION_FACTOR = 10;

/**
 * Coefficients de difficulté pour les métriques
 */
export const DIFFICULTY_COEFFICIENTS = {
  low: 1.0,
  medium: 1.2,
  high: 1.5,
} as const;

/**
 * Bonus journalier pour les performances libres selon leur ordre
 * 1ère perf: 1.0, 2ème: 1.1, 3ème: 1.25, 4ème+: 1.4
 */
export const DAILY_BONUS_COEFFICIENTS = [1.0, 1.1, 1.25, 1.4];

/**
 * Série minimale pour avoir un bonus de discipline
 */
export const MIN_STREAK_FOR_BONUS = 3;

/**
 * Formule du bonus de discipline: Math.min(Math.sqrt(streak) * STREAK_BONUS_MULTIPLIER, STREAK_BONUS_MAX)
 */
export const STREAK_BONUS_MULTIPLIER = 2;
export const STREAK_BONUS_MAX = 10;

// ============= TYPES =============

export interface MetricEvent {
  id: string;
  user_id: string;
  metric_id: string;
  domain_id: string;
  category_id: string | null;
  recorded_date: string; // "YYYY-MM-DD"
  units: number; // nombre d'unités complétées
  custom_impact?: number | null;
  created_at: string;
}

export interface Metric {
  id: string;
  user_id: string;
  domain_id: string;
  category_id: string | null;
  name: string;
  scheduled_days: string[];
  impact_weight: number;
  difficulty_level: "low" | "medium" | "high";
  is_active: boolean;
  created_at: string;
}

export interface FreePerformanceRecord {
  id: string;
  user_id: string;
  free_performance_id: string;
  domain_id?: string;
  category_id?: string | null;
  recorded_date: string; // "YYYY-MM-DD"
  impact_value: number; // 1, 2, 3, etc.
  created_at: string;
}

export interface DomainStats {
  avgRaw: number;
  filledRate: number;
  normalizedIndex: number;
  streak: number;
  streakBonus: number;
  displayedScore: number;
  filledDays: number;
  totalDays: number;
}

export interface DailyScores {
  [date: string]: number; // date -> raw score
}

// ============= FONCTIONS DE CALCUL =============

/**
 * Calcule le score brut quotidien pour un domaine
 * 
 * @param domainId - ID du domaine
 * @param date - Date au format "YYYY-MM-DD"
 * @param metricEvents - Événements de métriques du jour
 * @param freePerformanceRecords - Enregistrements de performances libres du jour
 * @param metrics - Liste complète des métriques (pour les coefficients)
 * @returns Score brut du jour
 */
export function computeDailyRawScoreForDomain(
  domainId: string,
  date: string,
  metricEvents: MetricEvent[],
  freePerformanceRecords: FreePerformanceRecord[],
  metrics: Metric[]
): number {
  // 1. Score des métriques du jour
  const metricScore = metricEvents
    .filter(event => event.domain_id === domainId && event.recorded_date === date)
    .reduce((sum, event) => {
      const metric = metrics.find(m => m.id === event.metric_id);
      if (!metric) return sum;

      const baseImpact = metric.impact_weight;
      const difficultyCoef = DIFFICULTY_COEFFICIENTS[metric.difficulty_level];
      const metricImpact = baseImpact * difficultyCoef * event.units;

      return sum + metricImpact;
    }, 0);

  // 2. Score des performances libres du jour
  const dayFreePerfs = freePerformanceRecords.filter(
    perf => perf.recorded_date === date
  );

  const freeScore = dayFreePerfs.reduce((sum, perf, index) => {
    const baseImpact = perf.impact_value;
    
    // Bonus journalier selon l'ordre
    const dailyBonusCoef = DAILY_BONUS_COEFFICIENTS[
      Math.min(index, DAILY_BONUS_COEFFICIENTS.length - 1)
    ];

    const freeImpact = baseImpact * dailyBonusCoef;
    return sum + freeImpact;
  }, 0);

  return metricScore + freeScore;
}

/**
 * Calcule le score brut quotidien pour une catégorie
 */
export function computeDailyRawScoreForCategory(
  categoryId: string,
  date: string,
  metricEvents: MetricEvent[],
  freePerformanceRecords: FreePerformanceRecord[],
  metrics: Metric[]
): number {
  // Filtrer uniquement les événements de cette catégorie
  const categoryMetricEvents = metricEvents.filter(e => e.category_id === categoryId);
  const categoryFreePerfs = freePerformanceRecords.filter(p => p.category_id === categoryId);
  const categoryMetrics = metrics.filter(m => m.category_id === categoryId);

  // Utiliser la même logique que pour le domaine
  const metricScore = categoryMetricEvents
    .filter(event => event.recorded_date === date)
    .reduce((sum, event) => {
      const metric = categoryMetrics.find(m => m.id === event.metric_id);
      if (!metric) return sum;

      const baseImpact = metric.impact_weight;
      const difficultyCoef = DIFFICULTY_COEFFICIENTS[metric.difficulty_level];
      const metricImpact = baseImpact * difficultyCoef * event.units;

      return sum + metricImpact;
    }, 0);

  const dayFreePerfs = categoryFreePerfs.filter(perf => perf.recorded_date === date);
  const freeScore = dayFreePerfs.reduce((sum, perf, index) => {
    const baseImpact = perf.impact_value;
    const dailyBonusCoef = DAILY_BONUS_COEFFICIENTS[
      Math.min(index, DAILY_BONUS_COEFFICIENTS.length - 1)
    ];
    const freeImpact = baseImpact * dailyBonusCoef;
    return sum + freeImpact;
  }, 0);

  return metricScore + freeScore;
}

/**
 * Calcule la série (streak) pour un domaine
 * 
 * @param dates - Liste de dates triées par ordre décroissant (plus récente en premier)
 * @param dailyScores - Map date -> score brut
 * @returns Longueur de la série actuelle
 */
export function computeStreak(
  dates: string[],
  dailyScores: DailyScores
): number {
  let streak = 0;

  for (const date of dates) {
    const score = dailyScores[date] || 0;
    if (score > 0) {
      streak++;
    } else {
      break; // On arrête dès qu'on trouve un jour vide
    }
  }

  return streak;
}

/**
 * Calcule le bonus de discipline basé sur la série
 * 
 * @param streakLength - Longueur de la série
 * @returns Bonus de discipline (0 si série < 3)
 */
export function computeStreakBonus(streakLength: number): number {
  if (streakLength < MIN_STREAK_FOR_BONUS) return 0;
  
  return Math.min(
    Math.sqrt(streakLength) * STREAK_BONUS_MULTIPLIER,
    STREAK_BONUS_MAX
  );
}

/**
 * Calcule les statistiques complètes pour un domaine sur une période
 * 
 * @param dates - Liste de dates de la période (triées desc)
 * @param dailyScores - Map date -> score brut
 * @returns Statistiques complètes
 */
export function computeDomainStats(
  dates: string[],
  dailyScores: DailyScores
): DomainStats {
  if (dates.length === 0) {
    return {
      avgRaw: 0,
      filledRate: 0,
      normalizedIndex: 0,
      streak: 0,
      streakBonus: 0,
      displayedScore: 0,
      filledDays: 0,
      totalDays: 0,
    };
  }

  // 1. Moyenne score brut
  const scores = dates.map(d => dailyScores[d] || 0);
  const sum = scores.reduce((a, b) => a + b, 0);
  const avgRaw = sum / scores.length;

  // 2. % jours remplis
  const filledDays = scores.filter(s => s > 0).length;
  const filledRate = filledDays / scores.length;

  // 3. Index normalisé 0-100
  const normalizedIndex = Math.max(
    0,
    Math.min(100, avgRaw * NORMALIZATION_FACTOR)
  );

  // 4. Série & Bonus
  const streak = computeStreak(dates, dailyScores);
  const streakBonus = computeStreakBonus(streak);

  // 5. Score final affiché
  const displayedScore = Math.min(100, normalizedIndex + streakBonus);

  return {
    avgRaw,
    filledRate,
    normalizedIndex,
    streak,
    streakBonus,
    displayedScore,
    filledDays,
    totalDays: dates.length,
  };
}

/**
 * Génère une liste de dates pour une période donnée
 * 
 * @param days - Nombre de jours (ex: 7, 30)
 * @returns Liste de dates au format "YYYY-MM-DD", triées par ordre décroissant
 */
export function generateDateRange(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
}

/**
 * Construit le map dailyScores pour un domaine sur une période
 * 
 * @param domainId - ID du domaine
 * @param dates - Liste des dates à calculer
 * @param metricEvents - Tous les événements de métriques
 * @param freePerformanceRecords - Tous les enregistrements de perfs libres
 * @param metrics - Liste des métriques
 * @returns Map date -> score brut
 */
export function buildDailyScoresForDomain(
  domainId: string,
  dates: string[],
  metricEvents: MetricEvent[],
  freePerformanceRecords: FreePerformanceRecord[],
  metrics: Metric[]
): DailyScores {
  const dailyScores: DailyScores = {};

  for (const date of dates) {
    dailyScores[date] = computeDailyRawScoreForDomain(
      domainId,
      date,
      metricEvents,
      freePerformanceRecords,
      metrics
    );
  }

  return dailyScores;
}

/**
 * Construit le map dailyScores pour une catégorie sur une période
 */
export function buildDailyScoresForCategory(
  categoryId: string,
  dates: string[],
  metricEvents: MetricEvent[],
  freePerformanceRecords: FreePerformanceRecord[],
  metrics: Metric[]
): DailyScores {
  const dailyScores: DailyScores = {};

  for (const date of dates) {
    dailyScores[date] = computeDailyRawScoreForCategory(
      categoryId,
      date,
      metricEvents,
      freePerformanceRecords,
      metrics
    );
  }

  return dailyScores;
}
