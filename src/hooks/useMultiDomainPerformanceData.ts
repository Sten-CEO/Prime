import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays, subMonths, format as formatDate } from "date-fns";
import { fr } from "date-fns/locale";

interface PerformanceDataPoint {
  date: string;
  [domainSlug: string]: number | null | string;
}

export const useMultiDomainPerformanceData = (days: number, domainSlugs: string[]) => {
  return useQuery({
    queryKey: ["multi-domain-performance", days, domainSlugs],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const today = new Date();
      const startDate = days === 365 ? subMonths(today, 12) : subDays(today, days - 1);

      // Get all domains for the user
      const { data: domains } = await supabase
        .from("domains")
        .select("id, slug")
        .eq("user_id", user.id)
        .in("slug", domainSlugs);

      if (!domains || domains.length === 0) return [];

      const domainIds = domains.map(d => d.id);
      const domainMap = new Map(domains.map(d => [d.id, d.slug]));

      // Get metric records for all domains
      const { data: metricRecords } = await supabase
        .from("metric_records")
        .select(`
          recorded_date,
          performance_level,
          custom_impact,
          metrics!inner(
            id,
            domain_id,
            default_impact_simple,
            default_impact_advanced,
            default_impact_exceptional
          )
        `)
        .eq("user_id", user.id)
        .in("metrics.domain_id", domainIds)
        .gte("recorded_date", startDate.toISOString().split("T")[0])
        .lte("recorded_date", today.toISOString().split("T")[0]);

      // Get free performance records for all domains
      const { data: freePerformanceRecords } = await supabase
        .from("free_performance_records")
        .select(`
          recorded_date,
          impact_value,
          free_performances!inner(
            id,
            domain_id
          )
        `)
        .eq("user_id", user.id)
        .in("free_performances.domain_id", domainIds)
        .gte("recorded_date", startDate.toISOString().split("T")[0])
        .lte("recorded_date", today.toISOString().split("T")[0]);

      // Aggregate data by date and domain
      const dataByDate = new Map<string, Map<string, number>>();

      // Process metric records
      metricRecords?.forEach((record: any) => {
        const date = record.recorded_date;
        const metric = record.metrics;
        const domainSlug = domainMap.get(metric.domain_id);
        if (!domainSlug) return;
        
        let impact = record.custom_impact;
        if (!impact) {
          if (record.performance_level === "simple") impact = metric.default_impact_simple;
          else if (record.performance_level === "advanced") impact = metric.default_impact_advanced;
          else if (record.performance_level === "exceptional") impact = metric.default_impact_exceptional;
        }

        if (!dataByDate.has(date)) {
          dataByDate.set(date, new Map());
        }

        const dayData = dataByDate.get(date)!;
        dayData.set(domainSlug, (dayData.get(domainSlug) || 0) + impact);
      });

      // Process free performance records
      freePerformanceRecords?.forEach((record: any) => {
        const date = record.recorded_date;
        const freePerf = record.free_performances;
        const domainSlug = domainMap.get(freePerf.domain_id);
        if (!domainSlug) return;

        const impact = record.impact_value;

        if (!dataByDate.has(date)) {
          dataByDate.set(date, new Map());
        }

        const dayData = dataByDate.get(date)!;
        dayData.set(domainSlug, (dayData.get(domainSlug) || 0) + impact);
      });

      // Generate data points based on time period
      const data: PerformanceDataPoint[] = [];

      if (days === 365) {
        // 12 months: 1 point per month
        for (let i = 11; i >= 0; i--) {
          const date = subMonths(today, i);
          const monthLabel = formatDate(date, "MMM", { locale: fr });
          const monthKey = formatDate(date, "yyyy-MM");

          const domainSums = new Map<string, number>();
          const domainCounts = new Map<string, number>();

          dataByDate.forEach((dayData, dateKey) => {
            if (dateKey.startsWith(monthKey)) {
              dayData.forEach((total, domainSlug) => {
                domainSums.set(domainSlug, (domainSums.get(domainSlug) || 0) + total);
                domainCounts.set(domainSlug, (domainCounts.get(domainSlug) || 0) + 1);
              });
            }
          });

          const dataPoint: PerformanceDataPoint = { date: monthLabel };
          let generalTotal = 0;
          let generalCount = 0;

          domainSlugs.forEach(slug => {
            const sum = domainSums.get(slug) || 0;
            const count = domainCounts.get(slug) || 0;
            dataPoint[slug] = count > 0 ? sum / count : null;
            if (count > 0) {
              generalTotal += sum / count;
              generalCount++;
            }
          });

          dataPoint["general"] = generalCount > 0 ? generalTotal / generalCount : null;
          data.push(dataPoint);
        }
      } else if (days === 90) {
        // 90 days: 1 point per week (13 weeks)
        for (let i = 12; i >= 0; i--) {
          const weekStart = subDays(today, i * 7 + 6);
          const weekEnd = subDays(today, i * 7);
          const weekLabel = `S${13 - i}`;

          const domainSums = new Map<string, number>();
          const domainCounts = new Map<string, number>();

          dataByDate.forEach((dayData, dateKey) => {
            const recordDate = new Date(dateKey);
            if (recordDate >= weekStart && recordDate <= weekEnd) {
              dayData.forEach((total, domainSlug) => {
                domainSums.set(domainSlug, (domainSums.get(domainSlug) || 0) + total);
                domainCounts.set(domainSlug, (domainCounts.get(domainSlug) || 0) + 1);
              });
            }
          });

          const dataPoint: PerformanceDataPoint = { date: weekLabel };
          let generalTotal = 0;
          let generalCount = 0;

          domainSlugs.forEach(slug => {
            const sum = domainSums.get(slug) || 0;
            const count = domainCounts.get(slug) || 0;
            dataPoint[slug] = count > 0 ? sum / count : null;
            if (count > 0) {
              generalTotal += sum / count;
              generalCount++;
            }
          });

          dataPoint["general"] = generalCount > 0 ? generalTotal / generalCount : null;
          data.push(dataPoint);
        }
      } else {
        // 7, 30 days: 1 point per day
        for (let i = days - 1; i >= 0; i--) {
          const date = subDays(today, i);
          const dateKey = formatDate(date, "yyyy-MM-dd");
          const dayLabel = days <= 7 
            ? formatDate(date, "EEE", { locale: fr }).slice(0, 3)
            : formatDate(date, "d MMM", { locale: fr });

          const dayData = dataByDate.get(dateKey);

          const dataPoint: PerformanceDataPoint = { date: dayLabel };
          let generalTotal = 0;
          let generalCount = 0;

          domainSlugs.forEach(slug => {
            const value = dayData?.get(slug) || null;
            dataPoint[slug] = value;
            if (value) {
              generalTotal += value;
              generalCount++;
            }
          });

          dataPoint["general"] = generalCount > 0 ? generalTotal / generalCount : null;
          data.push(dataPoint);
        }
      }

      return data;
    },
  });
};
