import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Check, X, Star, Target, Activity, BarChart2 } from "lucide-react";

interface CategoryStatsBlockProps {
  categoryName: string;
  domainName: string;
  stats: {
    avgScore7d: number;
    avgScore30d: number;
    filledDaysPercent: number;
    emptyDaysPercent: number;
    activeMetricsCount: number;
    metricsCompletionRate: number;
    performancesRatedCount: number;
    trend: "up" | "down" | "stable";
    trendMessage: string;
  };
}

export const CategoryStatsBlock = ({ categoryName, domainName, stats }: CategoryStatsBlockProps) => {
  const getTrendIcon = () => {
    switch (stats.trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-success" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-white/60" />;
    }
  };

  const getTrendColor = () => {
    switch (stats.trend) {
      case "up":
        return "text-success";
      case "down":
        return "text-red-500";
      default:
        return "text-white/60";
    }
  };

  const statBlocks = [
    { label: "Moy. 7j", value: stats.avgScore7d, suffix: "/100", icon: BarChart2, color: "text-white" },
    { label: "Moy. 30j", value: stats.avgScore30d, suffix: "/100", icon: BarChart2, color: "text-white" },
    { label: "Jours remplis", value: stats.filledDaysPercent, suffix: "%", icon: Check, color: "text-success" },
    { label: "Jours vides", value: stats.emptyDaysPercent, suffix: "%", icon: X, color: "text-red-500" },
    { label: "Métriques actives", value: stats.activeMetricsCount, suffix: "", icon: Target, color: "text-white" },
    { label: "Taux complétion", value: stats.metricsCompletionRate, suffix: "%", icon: Activity, color: "text-white" },
    { label: "Perfs notées", value: stats.performancesRatedCount, suffix: "", icon: Star, color: "text-white" },
  ];

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">Statistiques</h3>
        <p className="text-xs text-white/60">{domainName} • {categoryName}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {statBlocks.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`w-3 h-3 ${stat.color}`} />
                <p className="text-[10px] text-white/60 uppercase tracking-wide">{stat.label}</p>
              </div>
              <p className={`text-xl font-bold ${stat.color}`}>
                {stat.value}<span className="text-sm text-white/60">{stat.suffix}</span>
              </p>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
        <div className="flex items-center gap-2 mb-2">
          {getTrendIcon()}
          <p className="text-xs text-white/60 uppercase tracking-wide">Statut</p>
        </div>
        <p className={`text-sm font-medium ${getTrendColor()}`}>
          {stats.trendMessage}
        </p>
      </div>
    </Card>
  );
};
