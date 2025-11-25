import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  generateDateRange,
  buildDailyScoresForDomain,
  computeDomainStats,
  type Metric,
  type DomainStats,
} from "@/lib/scoring";
import { useMetricRecords } from "./useMetricRecords";
import { useFreePerformanceRecords } from "./useFreePerformanceRecords";

/**
 * Hook pour calculer les statistiques d'un domaine sur une période donnée
 * 
 * @param domainId - ID du domaine
 * @param days - Nombre de jours (7, 30, 90, etc.)
 * @returns Statistiques du domaine avec scores quotidiens
 */
export const useDomainStats = (domainId: string | undefined, days: number = 7) => {
  // Générer la plage de dates
  const dates = generateDateRange(days);
  const startDate = dates[dates.length - 1];
  const endDate = dates[0];

  // Récupérer les données nécessaires
  const { metricRecords, isLoading: loadingRecords } = useMetricRecords(
    domainId,
    startDate,
    endDate
  );

  const { freePerformanceRecords, isLoading: loadingFreePerfs } = useFreePerformanceRecords(
    domainId,
    undefined,
    startDate,
    endDate
  );

  const { data: metrics = [], isLoading: loadingMetrics } = useQuery({
    queryKey: ["metrics_for_scoring", domainId],
    queryFn: async () => {
      if (!domainId) return [];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("metrics")
        .select("*")
        .eq("domain_id", domainId)
        .eq("user_id", user.id);

      if (error) throw error;

      return (data || []).map(m => ({
        ...m,
        difficulty_level: (m.difficulty_level || "medium") as "low" | "medium" | "high",
      })) as Metric[];
    },
    enabled: !!domainId,
  });

  // Calculer les statistiques
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: [
      "domain_stats",
      domainId,
      days,
      metricRecords.length,
      freePerformanceRecords.length,
      metrics.length,
    ],
    queryFn: () => {
      if (!domainId) {
        return {
          stats: {
            avgRaw: 0,
            filledRate: 0,
            normalizedIndex: 0,
            streak: 0,
            streakBonus: 0,
            displayedScore: 0,
            filledDays: 0,
            totalDays: dates.length,
          } as DomainStats,
          dailyScores: {},
        };
      }

      const dailyScores = buildDailyScoresForDomain(
        domainId,
        dates,
        metricRecords,
        freePerformanceRecords,
        metrics
      );

      const stats = computeDomainStats(dates, dailyScores);

      return { stats, dailyScores };
    },
    enabled:
      !loadingRecords &&
      !loadingFreePerfs &&
      !loadingMetrics &&
      !!domainId,
  });

  return {
    stats: stats?.stats,
    dailyScores: stats?.dailyScores || {},
    isLoading: loadingRecords || loadingFreePerfs || loadingMetrics || loadingStats,
  };
};
