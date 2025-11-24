import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface Trend {
  period: string;
  value: string;
  type: "up" | "down" | "stable";
  tooltip: string;
}

interface DomainTrendsEnhancedProps {
  trends: Trend[];
}

const generateMiniData = (period: string) => {
  const length = period === "Semaine" ? 7 : period === "Mois" ? 30 : 365;
  return Array.from({ length }, (_, i) => ({
    date: `J-${length - i}`,
    score: Math.random() * 30 + 70,
  }));
};

export const DomainTrendsEnhanced = ({ trends }: DomainTrendsEnhancedProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

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

  const selectedTrendData = selectedPeriod ? generateMiniData(selectedPeriod) : null;

  return (
    <>
      <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
        <h3 className="text-lg font-semibold text-white mb-4">Tendances</h3>
        
        <div className="flex items-center justify-between gap-4">
          <TooltipProvider>
            {trends.map((trend, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => setSelectedPeriod(trend.period)}
                    className="flex-1 flex flex-col items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] transition-all cursor-pointer"
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
      </Card>

      {/* Panneau latéral */}
      {selectedPeriod && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" onClick={() => setSelectedPeriod(null)}>
          <div
            className="fixed right-0 top-0 bottom-0 w-[500px] backdrop-blur-3xl bg-white/[0.02] border-l border-white/[0.18] p-8 animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Tendance - {selectedPeriod}</h3>
              <button
                onClick={() => setSelectedPeriod(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.08] transition-all"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-white/60 text-sm mb-2">Évolution sur la période</p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={selectedTrendData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth={2}
                    dot={{ fill: "rgba(255,255,255,0.9)", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                <p className="text-white/60 text-xs mb-1">Score moyen</p>
                <p className="text-white text-2xl font-bold">
                  {selectedTrendData
                    ? (selectedTrendData.reduce((acc, d) => acc + d.score, 0) / selectedTrendData.length).toFixed(0)
                    : 0}
                  /100
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                <p className="text-white/60 text-xs mb-1">Variation</p>
                <p className="text-success text-lg font-semibold">
                  {trends.find((t) => t.period === selectedPeriod)?.value}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
