import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays } from "date-fns";
import { Briefcase, Dumbbell, Users, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface OverviewItem {
  name: string;
  icon: LucideIcon;
  score: number;
  trend: string;
  slug: string;
}

const domainIcons: Record<string, LucideIcon> = {
  business: Briefcase,
  sport: Dumbbell,
  social: Users,
  sante: Heart,
};

const domainNames: Record<string, string> = {
  business: "Business",
  sport: "Sport",
  social: "Social",
  sante: "Santé",
};

export const useOverviewData = () => {
  return useQuery({
    queryKey: ["overview-data"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const today = new Date();
      const currentPeriodStart = subDays(today, 6); // Last 7 days
      const previousPeriodStart = subDays(today, 13); // Previous 7 days
      const previousPeriodEnd = subDays(today, 7);

      // Get all domains for the user
      const { data: domains } = await supabase
        .from("domains")
        .select("id, slug, name")
        .eq("user_id", user.id)
        .in("slug", ["business", "sport", "social", "sante"]);

      if (!domains || domains.length === 0) return [];

      const overviewItems: OverviewItem[] = [];

      for (const domain of domains) {
        // Get current period data
        const currentScore = await calculateDomainScore(
          user.id,
          domain.id,
          currentPeriodStart,
          today
        );

        // Get previous period data
        const previousScore = await calculateDomainScore(
          user.id,
          domain.id,
          previousPeriodStart,
          previousPeriodEnd
        );

        // Calculate trend
        const trend = calculateTrend(currentScore, previousScore);

        overviewItems.push({
          name: domainNames[domain.slug] || domain.name,
          icon: domainIcons[domain.slug] || Briefcase,
          score: Math.round(currentScore),
          trend,
          slug: domain.slug,
        });
      }

      return overviewItems;
    },
  });
};

async function calculateDomainScore(
  userId: string,
  domainId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  const startDateStr = startDate.toISOString().split("T")[0];
  const endDateStr = endDate.toISOString().split("T")[0];

  // Get metric records
  const { data: metricRecords } = await supabase
    .from("metric_records")
    .select(`
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
    .eq("user_id", userId)
    .eq("metrics.domain_id", domainId)
    .gte("recorded_date", startDateStr)
    .lte("recorded_date", endDateStr);

  // Get free performance records
  const { data: freePerformanceRecords } = await supabase
    .from("free_performance_records")
    .select(`
      impact_value,
      free_performances!inner(
        id,
        domain_id
      )
    `)
    .eq("user_id", userId)
    .eq("free_performances.domain_id", domainId)
    .gte("recorded_date", startDateStr)
    .lte("recorded_date", endDateStr);

  let totalImpact = 0;
  let count = 0;

  // Process metric records
  metricRecords?.forEach((record: any) => {
    const metric = record.metrics;
    let impact = record.custom_impact;
    if (!impact) {
      if (record.performance_level === "simple") impact = metric.default_impact_simple;
      else if (record.performance_level === "advanced") impact = metric.default_impact_advanced;
      else if (record.performance_level === "exceptional") impact = metric.default_impact_exceptional;
    }
    totalImpact += impact;
    count++;
  });

  // Process free performance records
  freePerformanceRecords?.forEach((record: any) => {
    totalImpact += record.impact_value;
    count++;
  });

  return count > 0 ? totalImpact / count : 0;
}

function calculateTrend(currentScore: number, previousScore: number): string {
  if (previousScore === 0) {
    return currentScore > 0 ? "+100%" : "0%";
  }

  const percentChange = ((currentScore - previousScore) / previousScore) * 100;
  const sign = percentChange >= 0 ? "+" : "";
  return `${sign}${Math.round(percentChange)}%`;
}
