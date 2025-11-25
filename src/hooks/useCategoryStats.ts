import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format, eachDayOfInterval } from "date-fns";
import { useDisciplineStreak } from "./useDisciplineStreak";
import { IMPACT_VALUES } from "@/lib/impactConfig";

interface CategoryStats {
  categoryId: string;
  categoryName: string;
  avgScore7d: number;
  avgScore30d: number;
  filledDaysPercent: number;
  emptyDaysPercent: number;
  bestDay: { day: string; score: number };
  worstDay: { day: string; score: number };
  metricsCompletionRate: number;
  performancesCount: number;
  currentStreak: number;
  maxStreak: number;
  disciplineBonus: number;
}

export const useCategoryStats = (domainId: string) => {
  return useQuery({
    queryKey: ["categoryStats", domainId],
    queryFn: async (): Promise<CategoryStats[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Récupérer les catégories du domaine
      const { data: categories } = await supabase
        .from("categories")
        .select("id, name")
        .eq("domain_id", domainId)
        .eq("user_id", user.id);

      if (!categories || categories.length === 0) return [];

      const stats: CategoryStats[] = [];

      for (const category of categories) {
        const categoryStats = await calculateCategoryStats(
          user.id,
          domainId,
          category.id,
          category.name
        );
        stats.push(categoryStats);
      }

      return stats;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

async function calculateCategoryStats(
  userId: string,
  domainId: string,
  categoryId: string,
  categoryName: string
): Promise<CategoryStats> {
  const today = startOfDay(new Date());
  const date7dAgo = subDays(today, 7);
  const date30dAgo = subDays(today, 30);

  // Récupérer les métriques de la catégorie
  const { data: metrics } = await supabase
    .from("metrics")
    .select("id")
    .eq("category_id", categoryId)
    .eq("user_id", userId);

  const metricIds = metrics?.map((m) => m.id) || [];

  // Récupérer les enregistrements de métriques (7j)
  const { data: metricRecords7d } = await supabase
    .from("metric_records")
    .select("recorded_date, performance_level, custom_impact, metric_id")
    .in("metric_id", metricIds)
    .eq("user_id", userId)
    .gte("recorded_date", format(date7dAgo, "yyyy-MM-dd"));

  // Récupérer les enregistrements de métriques (30j)
  const { data: metricRecords30d } = await supabase
    .from("metric_records")
    .select("recorded_date, performance_level, custom_impact, metric_id")
    .in("metric_id", metricIds)
    .eq("user_id", userId)
    .gte("recorded_date", format(date30dAgo, "yyyy-MM-dd"));

  // Récupérer les performances libres (7j)
  const { data: freePerf7d } = await supabase
    .from("free_performance_records")
    .select("recorded_date, impact_value")
    .eq("user_id", userId)
    .gte("recorded_date", format(date7dAgo, "yyyy-MM-dd"));

  // Récupérer les performances libres (30j)
  const { data: freePerf30d } = await supabase
    .from("free_performance_records")
    .select("recorded_date, impact_value")
    .eq("user_id", userId)
    .gte("recorded_date", format(date30dAgo, "yyyy-MM-dd"));

  // Calculer les scores par jour (7j)
  const dailyScores7d = calculateDailyScores(metricRecords7d || [], freePerf7d || []);
  const avgScore7d = dailyScores7d.length > 0
    ? Math.round(dailyScores7d.reduce((sum, s) => sum + s.score, 0) / dailyScores7d.length)
    : 0;

  // Calculer les scores par jour (30j)
  const dailyScores30d = calculateDailyScores(metricRecords30d || [], freePerf30d || []);
  const avgScore30d = dailyScores30d.length > 0
    ? Math.round(dailyScores30d.reduce((sum, s) => sum + s.score, 0) / dailyScores30d.length)
    : 0;

  // Calculer % jours remplis/vides (30j)
  const days30d = eachDayOfInterval({ start: date30dAgo, end: today });
  const datesWithData = new Set([
    ...(metricRecords30d || []).map((r) => r.recorded_date),
    ...(freePerf30d || []).map((r) => r.recorded_date),
  ]);
  const filledDays = datesWithData.size;
  const filledDaysPercent = Math.round((filledDays / days30d.length) * 100);
  const emptyDaysPercent = 100 - filledDaysPercent;

  // Meilleur et pire jour (30j)
  const sortedByScore = [...dailyScores30d].sort((a, b) => b.score - a.score);
  const bestDay = sortedByScore[0] || { day: "-", score: 0 };
  const worstDay = sortedByScore[sortedByScore.length - 1] || { day: "-", score: 0 };

  // Taux de complétion des métriques
  const activeMetrics = metrics?.filter((m) => m.id) || [];
  const completedMetrics = new Set(metricRecords30d?.map((r) => r.metric_id) || []);
  const metricsCompletionRate = activeMetrics.length > 0
    ? Math.round((completedMetrics.size / activeMetrics.length) * 100)
    : 0;

  // Nombre de performances notées
  const performancesCount = (metricRecords30d?.length || 0) + (freePerf30d?.length || 0);

  // Récupérer les données de série (via le hook useDisciplineStreak simulé ici)
  const streakData = await calculateStreak(userId, domainId, categoryId);

  return {
    categoryId,
    categoryName,
    avgScore7d,
    avgScore30d,
    filledDaysPercent,
    emptyDaysPercent,
    bestDay: {
      day: bestDay.day,
      score: bestDay.score,
    },
    worstDay: {
      day: worstDay.day,
      score: worstDay.score,
    },
    metricsCompletionRate,
    performancesCount,
    currentStreak: streakData.currentStreak,
    maxStreak: streakData.maxStreak,
    disciplineBonus: streakData.disciplineBonus,
  };
}

function calculateDailyScores(
  metricRecords: any[],
  freePerf: any[]
): { day: string; score: number }[] {
  const scoresByDate: { [date: string]: number } = {};

  // Agréger les impacts de métriques
  metricRecords.forEach((record) => {
    const impact = record.custom_impact || IMPACT_VALUES[record.performance_level === "exceptional" ? 3 : record.performance_level === "advanced" ? 2 : 1];
    scoresByDate[record.recorded_date] = (scoresByDate[record.recorded_date] || 0) + impact;
  });

  // Agréger les impacts de performances libres
  freePerf.forEach((record) => {
    scoresByDate[record.recorded_date] = (scoresByDate[record.recorded_date] || 0) + record.impact_value;
  });

  return Object.entries(scoresByDate).map(([date, score]) => ({
    day: format(new Date(date), "EEE"),
    score,
  }));
}

async function calculateStreak(
  userId: string,
  domainId: string,
  categoryId: string
): Promise<{ currentStreak: number; maxStreak: number; disciplineBonus: number }> {
  const startDate = format(subDays(new Date(), 365), "yyyy-MM-dd");
  const today = format(startOfDay(new Date()), "yyyy-MM-dd");

  // Récupérer toutes les dates avec des données
  const { data: metricRecords } = await supabase
    .from("metric_records")
    .select("recorded_date, metrics!inner(category_id)")
    .eq("user_id", userId)
    .eq("metrics.category_id", categoryId)
    .gte("recorded_date", startDate);

  const { data: perfRecords } = await supabase
    .from("free_performance_records")
    .select("recorded_date, free_performances!inner(category_id)")
    .eq("user_id", userId)
    .eq("free_performances.category_id", categoryId)
    .gte("recorded_date", startDate);

  const allDates = new Set<string>();
  metricRecords?.forEach((r) => allDates.add(r.recorded_date));
  perfRecords?.forEach((r) => allDates.add(r.recorded_date));

  const sortedDates = Array.from(allDates).sort((a, b) => b.localeCompare(a));

  if (sortedDates.length === 0) {
    return { currentStreak: 0, maxStreak: 0, disciplineBonus: 0 };
  }

  // Calculer série actuelle
  let currentStreak = 0;
  let expectedDate = today;
  const hasDataToday = sortedDates.includes(today);

  for (const date of sortedDates) {
    if (date === expectedDate) {
      currentStreak++;
      expectedDate = format(subDays(new Date(expectedDate), 1), "yyyy-MM-dd");
    } else if (!hasDataToday && currentStreak === 0) {
      currentStreak++;
      expectedDate = format(subDays(new Date(date), 1), "yyyy-MM-dd");
    } else {
      break;
    }
  }

  // Calculer série maximale
  let maxStreak = currentStreak;
  let tempStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
      maxStreak = Math.max(maxStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  const disciplineBonus = currentStreak >= 3 ? currentStreak - 2 : 0;

  return { currentStreak, maxStreak, disciplineBonus };
}
