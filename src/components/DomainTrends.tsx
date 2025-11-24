import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { TrendDetailPanel } from "@/components/modals/TrendDetailPanel";

interface Trend {
  period: string;
  value: string;
  type: "up" | "down" | "stable";
  tooltip: string;
}

interface DomainTrendsProps {
  trends: Trend[];
}

export const DomainTrends = ({ trends }: DomainTrendsProps) => {
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case "up":
        return <TrendingUp className="w-4 h-4" />;
      case "down":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "up":
        return "text-success";
      case "down":
        return "text-warning";
      default:
        return "text-white/60";
    }
  };

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
      <h3 className="text-lg font-semibold text-white mb-4">Tendances</h3>
      
      <div className="flex items-center justify-between gap-4">
        <TooltipProvider>
          {trends.map((trend, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div 
                  onClick={() => setSelectedTrend(trend)}
                  className="flex-1 flex flex-col items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] transition-all cursor-pointer"
                >
                  <span className="text-xs text-white/60">{trend.period}</span>
                  <div className={`flex items-center gap-1 ${getColor(trend.type)}`}>
                    {getIcon(trend.type)}
                    <span className="text-sm font-semibold">{trend.value}</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-black/95 backdrop-blur-xl border-white/[0.12]">
                <p className="text-xs text-white/80">{trend.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {selectedTrend && (
        <TrendDetailPanel
          open={!!selectedTrend}
          onOpenChange={() => setSelectedTrend(null)}
          period={selectedTrend.period}
          value={selectedTrend.value}
        />
      )}
    </Card>
  );
};
