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

        // Get discipline streak and bonus
        const streakData = await calculateDomainStreak(user.id, domain.id);
        const scoreWithBonus = currentScore + streakData.disciplineBonus;

        // Calculate trend
        const trend = calculateTrend(scoreWithBonus, previousScore);

        overviewItems.push({
          name: domainNames[domain.slug] || domain.name,
          icon: domainIcons[domain.slug] || Briefcase,
          score: Math.round(scoreWithBonus),
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

async function calculateDomainStreak(
  userId: string,
  domainId: string
): Promise<{ currentStreak: number; maxStreak: number; disciplineBonus: number }> {
  const startDate = subDays(new Date(), 365).toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];

  // Get all dates with data for this domain
  const { data: metricRecords } = await supabase
    .from("metric_records")
    .select("recorded_date, metrics!inner(domain_id)")
    .eq("user_id", userId)
    .eq("metrics.domain_id", domainId)
    .gte("recorded_date", startDate);

  const { data: perfRecords } = await supabase
    .from("free_performance_records")
    .select("recorded_date, free_performances!inner(domain_id)")
    .eq("user_id", userId)
    .eq("free_performances.domain_id", domainId)
    .gte("recorded_date", startDate);

  const allDates = new Set<string>();
  metricRecords?.forEach((r: any) => allDates.add(r.recorded_date));
  perfRecords?.forEach((r: any) => allDates.add(r.recorded_date));

  const sortedDates = Array.from(allDates).sort((a, b) => b.localeCompare(a));

  if (sortedDates.length === 0) {
    return { currentStreak: 0, maxStreak: 0, disciplineBonus: 0 };
  }

  // Calculate current streak
  let currentStreak = 0;
  let expectedDate = today;
  const hasDataToday = sortedDates.includes(today);

  for (const date of sortedDates) {
    if (date === expectedDate) {
      currentStreak++;
      expectedDate = subDays(new Date(expectedDate), 1).toISOString().split("T")[0];
    } else if (!hasDataToday && currentStreak === 0) {
      currentStreak++;
      expectedDate = subDays(new Date(date), 1).toISOString().split("T")[0];
    } else {
      break;
    }
  }

  // Calculate max streak
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

  // Calculate discipline bonus: starts at 3 consecutive days, bonus = streak - 2
  const disciplineBonus = currentStreak >= 3 ? currentStreak - 2 : 0;

  return { currentStreak, maxStreak, disciplineBonus };
}
