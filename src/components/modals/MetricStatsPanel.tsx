import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface MetricStatsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metricName: string;
}

const mockData = [
  { day: "L", value: 1 },
  { day: "M", value: 1 },
  { day: "M", value: 0 },
  { day: "J", value: 1 },
  { day: "V", value: 1 },
  { day: "S", value: 1 },
  { day: "D", value: 0 },
];

export const MetricStatsPanel = ({ open, onOpenChange, metricName }: MetricStatsPanelProps) => {
  const totalPlanned = 7;
  const totalCompleted = 5;
  const successRate = ((totalCompleted / totalPlanned) * 100).toFixed(0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="backdrop-blur-3xl bg-black/95 border-l border-white/[0.18] text-white w-[400px]"
      >
        <SheetHeader>
          <SheetTitle className="text-white text-xl">{metricName}</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <p className="text-xs text-white/60 mb-1">Jours prévus</p>
              <p className="text-2xl font-bold text-white">{totalPlanned}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <p className="text-xs text-white/60 mb-1">Jours validés</p>
              <p className="text-2xl font-bold text-success">{totalCompleted}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
            <p className="text-xs text-white/60 mb-2">Taux de réussite</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white">{successRate}%</p>
              <span className="text-sm text-success">+5% vs semaine dernière</span>
            </div>
            <div className="w-full h-2 bg-white/[0.05] rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-success to-success/80 rounded-full transition-all duration-500"
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
            <p className="text-sm text-white/80 mb-4">Derniers 7 jours</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={mockData}>
                <XAxis 
                  dataKey="day" 
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
                />
                <YAxis 
                  domain={[0, 1]}
                  ticks={[0, 1]}
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="value" 
                  stroke="rgba(34,197,94,0.8)" 
                  strokeWidth={2}
                  dot={{ fill: "rgba(34,197,94,1)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <p className="text-xs text-white/60 mb-1">Meilleur jour</p>
              <p className="text-lg font-semibold text-white">Lundi</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <p className="text-xs text-white/60 mb-1">Pire jour</p>
              <p className="text-lg font-semibold text-white">Mercredi</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
