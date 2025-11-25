import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays, subMonths, startOfDay, endOfDay, format as formatDate } from "date-fns";
import { fr } from "date-fns/locale";

interface PerformanceDataPoint {
  date: string;
  score: number | null;
  hasData: boolean;
  [categoryId: string]: number | null | boolean | string;
}

export const useDomainPerformanceData = (
  domainSlug: string,
  days: number,
  categories?: Array<{ id: string; name: string; color?: string }>
) => {
  return useQuery({
    queryKey: ["domain-performance", domainSlug, days, categories?.map(c => c.id)],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Get domain
      const { data: domain } = await supabase
        .from("domains")
        .select("id")
        .eq("user_id", user.id)
        .eq("slug", domainSlug)
        .single();

      if (!domain) return [];

      const today = new Date();
      const startDate = days === 365 ? subMonths(today, 12) : subDays(today, days - 1);

      // Get metric records for the domain
      const { data: metricRecords } = await supabase
        .from("metric_records")
        .select(`
          recorded_date,
          performance_level,
          custom_impact,
          metrics!inner(
            id,
            domain_id,
            category_id,
            default_impact_simple,
            default_impact_advanced,
            default_impact_exceptional
          )
        `)
        .eq("user_id", user.id)
        .eq("metrics.domain_id", domain.id)
        .gte("recorded_date", startDate.toISOString().split("T")[0])
        .lte("recorded_date", today.toISOString().split("T")[0]);

      // Get free performance records for the domain
      const { data: freePerformanceRecords } = await supabase
        .from("free_performance_records")
        .select(`
          recorded_date,
          impact_value,
          free_performances!inner(
            id,
            domain_id,
            category_id
          )
        `)
        .eq("user_id", user.id)
        .eq("free_performances.domain_id", domain.id)
        .gte("recorded_date", startDate.toISOString().split("T")[0])
        .lte("recorded_date", today.toISOString().split("T")[0]);

      // Aggregate data by date
      const dataByDate = new Map<string, { domainTotal: number; categoryTotals: Map<string, number> }>();

      // Process metric records
      metricRecords?.forEach((record: any) => {
        const date = record.recorded_date;
        const metric = record.metrics;
        
        let impact = record.custom_impact;
        if (!impact) {
          if (record.performance_level === "simple") impact = metric.default_impact_simple;
          else if (record.performance_level === "advanced") impact = metric.default_impact_advanced;
          else if (record.performance_level === "exceptional") impact = metric.default_impact_exceptional;
        }

        if (!dataByDate.has(date)) {
          dataByDate.set(date, { domainTotal: 0, categoryTotals: new Map() });
        }

        const dayData = dataByDate.get(date)!;
        dayData.domainTotal += impact;

        if (metric.category_id) {
          const catTotal = dayData.categoryTotals.get(metric.category_id) || 0;
          dayData.categoryTotals.set(metric.category_id, catTotal + impact);
        }
      });

      // Process free performance records
      freePerformanceRecords?.forEach((record: any) => {
        const date = record.recorded_date;
        const freePerf = record.free_performances;
        const impact = record.impact_value;

        if (!dataByDate.has(date)) {
          dataByDate.set(date, { domainTotal: 0, categoryTotals: new Map() });
        }

        const dayData = dataByDate.get(date)!;
        dayData.domainTotal += impact;

        if (freePerf.category_id) {
          const catTotal = dayData.categoryTotals.get(freePerf.category_id) || 0;
          dayData.categoryTotals.set(freePerf.category_id, catTotal + impact);
        }
      });

      // Generate data points based on time period
      const data: PerformanceDataPoint[] = [];

      if (days === 365) {
        // 12 months: 1 point per month
        for (let i = 11; i >= 0; i--) {
          const date = subMonths(today, i);
          const monthLabel = formatDate(date, "MMM", { locale: fr });
          const monthKey = formatDate(date, "yyyy-MM");

          let monthTotal = 0;
          let monthCount = 0;
          const categorySums = new Map<string, number>();
          const categoryCounts = new Map<string, number>();

          dataByDate.forEach((dayData, dateKey) => {
            if (dateKey.startsWith(monthKey)) {
              monthTotal += dayData.domainTotal;
              monthCount++;

              dayData.categoryTotals.forEach((total, catId) => {
                categorySums.set(catId, (categorySums.get(catId) || 0) + total);
                categoryCounts.set(catId, (categoryCounts.get(catId) || 0) + 1);
              });
            }
          });

          const dataPoint: PerformanceDataPoint = {
            date: monthLabel,
            score: monthCount > 0 ? monthTotal / monthCount : null,
            hasData: monthCount > 0,
          };

          categories?.forEach(cat => {
            const catSum = categorySums.get(cat.id) || 0;
            const catCount = categoryCounts.get(cat.id) || 0;
            dataPoint[cat.id] = catCount > 0 ? catSum / catCount : null;
          });

          data.push(dataPoint);
        }
      } else if (days === 90) {
        // 90 days: 1 point per week (13 weeks)
        for (let i = 12; i >= 0; i--) {
          const weekStart = subDays(today, i * 7 + 6);
          const weekEnd = subDays(today, i * 7);
          const weekLabel = `S${13 - i}`;

          let weekTotal = 0;
          let weekCount = 0;
          const categorySums = new Map<string, number>();
          const categoryCounts = new Map<string, number>();

          dataByDate.forEach((dayData, dateKey) => {
            const recordDate = new Date(dateKey);
            if (recordDate >= weekStart && recordDate <= weekEnd) {
              weekTotal += dayData.domainTotal;
              weekCount++;

              dayData.categoryTotals.forEach((total, catId) => {
                categorySums.set(catId, (categorySums.get(catId) || 0) + total);
                categoryCounts.set(catId, (categoryCounts.get(catId) || 0) + 1);
              });
            }
          });

          const dataPoint: PerformanceDataPoint = {
            date: weekLabel,
            score: weekCount > 0 ? weekTotal / weekCount : null,
            hasData: weekCount > 0,
          };

          categories?.forEach(cat => {
            const catSum = categorySums.get(cat.id) || 0;
            const catCount = categoryCounts.get(cat.id) || 0;
            dataPoint[cat.id] = catCount > 0 ? catSum / catCount : null;
          });

          data.push(dataPoint);
        }
      } else {
        // 7, 14, 30 days: 1 point per day
        for (let i = days - 1; i >= 0; i--) {
          const date = subDays(today, i);
          const dateKey = formatDate(date, "yyyy-MM-dd");
          const dayLabel = days <= 7 
            ? formatDate(date, "EEE", { locale: fr }).slice(0, 3)
            : formatDate(date, "d MMM", { locale: fr });

          const dayData = dataByDate.get(dateKey);

          const dataPoint: PerformanceDataPoint = {
            date: dayLabel,
            score: dayData?.domainTotal || null,
            hasData: !!dayData,
          };

          categories?.forEach(cat => {
            dataPoint[cat.id] = dayData?.categoryTotals.get(cat.id) || null;
          });

          data.push(dataPoint);
        }
      }

      return data;
    },
  });
};
