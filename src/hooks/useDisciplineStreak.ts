import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format, differenceInDays, parseISO } from "date-fns";

interface StreakData {
  currentStreak: number;
  maxStreak: number;
  disciplineBonus: number;
  hasDataToday: boolean;
}

/**
 * Calcule les séries de discipline pour un domaine ou une catégorie
 * Une série = jours consécutifs avec au moins 1 performance (métrique ou perf libre)
 * Série démarre à partir de 3 jours
 * Bonus: série de 3j = 0, 4j = +1, 5j = +2, etc.
 */
export const useDisciplineStreak = (domainId?: string, categoryId?: string) => {
  return useQuery({
    queryKey: ["disciplineStreak", domainId, categoryId],
    queryFn: async (): Promise<StreakData> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { currentStreak: 0, maxStreak: 0, disciplineBonus: 0, hasDataToday: false };
      }

      // Récupérer les 365 derniers jours pour calculer max streak
      const startDate = format(subDays(new Date(), 365), "yyyy-MM-dd");
      const today = format(startOfDay(new Date()), "yyyy-MM-dd");

      // Récupérer les enregistrements de métriques
      let metricQuery = supabase
        .from("metric_records")
        .select("recorded_date, metrics(domain_id, category_id)")
        .eq("user_id", user.id)
        .gte("recorded_date", startDate)
        .order("recorded_date", { ascending: false });

      if (domainId) {
        metricQuery = metricQuery.eq("metrics.domain_id", domainId);
      }
      if (categoryId) {
        metricQuery = metricQuery.eq("metrics.category_id", categoryId);
      }

      const { data: metricRecords } = await metricQuery;

      // Récupérer les performances libres
      let perfQuery = supabase
        .from("free_performance_records")
        .select("recorded_date, free_performances(domain_id, category_id)")
        .eq("user_id", user.id)
        .gte("recorded_date", startDate)
        .order("recorded_date", { ascending: false });

      if (domainId) {
        perfQuery = perfQuery.eq("free_performances.domain_id", domainId);
      }
      if (categoryId) {
        perfQuery = perfQuery.eq("free_performances.category_id", categoryId);
      }

      const { data: perfRecords } = await perfQuery;

      // Combiner toutes les dates uniques
      const allDates = new Set<string>();
      
      metricRecords?.forEach((record) => {
        allDates.add(record.recorded_date);
      });
      
      perfRecords?.forEach((record) => {
        allDates.add(record.recorded_date);
      });

      const sortedDates = Array.from(allDates).sort((a, b) => b.localeCompare(a));

      if (sortedDates.length === 0) {
        return { currentStreak: 0, maxStreak: 0, disciplineBonus: 0, hasDataToday: false };
      }

      // Calculer la série actuelle
      let currentStreak = 0;
      let expectedDate = today;
      const hasDataToday = sortedDates.includes(today);

      for (const date of sortedDates) {
        const diff = differenceInDays(parseISO(expectedDate), parseISO(date));
        
        if (diff === 0) {
          currentStreak++;
          expectedDate = format(subDays(parseISO(expectedDate), 1), "yyyy-MM-dd");
        } else if (diff === 1 && !hasDataToday && currentStreak === 0) {
          // Si pas de données aujourd'hui, on peut commencer la série hier
          currentStreak++;
          expectedDate = format(subDays(parseISO(date), 1), "yyyy-MM-dd");
        } else {
          break;
        }
      }

      // Calculer la série maximale (sliding window)
      let maxStreak = currentStreak;
      let tempStreak = 1;
      
      for (let i = 1; i < sortedDates.length; i++) {
        const diff = differenceInDays(parseISO(sortedDates[i - 1]), parseISO(sortedDates[i]));
        
        if (diff === 1) {
          tempStreak++;
          maxStreak = Math.max(maxStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }

      // Calculer le bonus discipline
      // Série commence à partir de 3 jours, bonus = streak - 2
      const disciplineBonus = currentStreak >= 3 ? currentStreak - 2 : 0;

      return {
        currentStreak,
        maxStreak,
        disciplineBonus,
        hasDataToday,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
