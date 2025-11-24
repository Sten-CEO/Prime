import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface TrendDetailPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period: string;
  value: string;
}

const mockData = {
  "Semaine": [
    { day: "L", score: 82 },
    { day: "M", score: 85 },
    { day: "M", score: null },
    { day: "J", score: 87 },
    { day: "V", score: 84 },
    { day: "S", score: 89 },
    { day: "D", score: null },
  ],
  "Mois": Array.from({ length: 30 }, (_, i) => ({
    day: `J${i + 1}`,
    score: Math.random() > 0.2 ? 70 + Math.random() * 30 : null
  })),
  "Année": Array.from({ length: 12 }, (_, i) => ({
    day: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"][i],
    score: 70 + Math.random() * 30
  }))
};

export const TrendDetailPanel = ({ open, onOpenChange, period, value }: TrendDetailPanelProps) => {
  const data = mockData[period as keyof typeof mockData] || mockData["Semaine"];
  const filledDays = data.filter(d => d.score !== null).length;
  const totalDays = data.length;
  const avgScore = data.filter(d => d.score !== null).reduce((sum, d) => sum + (d.score || 0), 0) / filledDays;
  const bestDay = data.reduce((best, d) => (d.score && d.score > (best.score || 0)) ? d : best, { day: "-", score: 0 });
  const worstDay = data.reduce((worst, d) => (d.score && (!worst.score || d.score < worst.score)) ? d : worst, { day: "-", score: 100 });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="backdrop-blur-3xl bg-black/95 border-l border-white/[0.18] text-white w-[450px]"
      >
        <SheetHeader>
          <SheetTitle className="text-white text-xl">Détails - {period}</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
            <p className="text-xs text-white/60 mb-2">Variation</p>
            <p className={`text-3xl font-bold ${value.startsWith('+') ? 'text-success' : value.startsWith('-') ? 'text-red-500' : 'text-white/60'}`}>
              {value}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
            <p className="text-sm text-white/80 mb-4">Évolution sur la période</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={data}>
                <XAxis 
                  dataKey="day" 
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(0,0,0,0.95)", 
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="rgba(255,255,255,0.8)" 
                  strokeWidth={2}
                  dot={{ fill: "rgba(255,255,255,0.9)", r: 3 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <p className="text-xs text-white/60 mb-1">Jours remplis</p>
              <p className="text-2xl font-bold text-success">{filledDays}</p>
              <p className="text-xs text-white/40 mt-1">sur {totalDays}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <p className="text-xs text-white/60 mb-1">Jours non remplis</p>
              <p className="text-2xl font-bold text-red-500">{totalDays - filledDays}</p>
              <p className="text-xs text-white/40 mt-1">{((totalDays - filledDays) / totalDays * 100).toFixed(0)}%</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
            <p className="text-xs text-white/60 mb-2">Score moyen</p>
            <p className="text-3xl font-bold text-white">{avgScore.toFixed(0)}<span className="text-lg text-white/60">/100</span></p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <p className="text-xs text-white/60 mb-1">Meilleur jour</p>
              <p className="text-lg font-semibold text-white">{bestDay.day}</p>
              <p className="text-sm text-success">{bestDay.score?.toFixed(0)}/100</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <p className="text-xs text-white/60 mb-1">Pire jour</p>
              <p className="text-lg font-semibold text-white">{worstDay.day}</p>
              <p className="text-sm text-red-500">{worstDay.score?.toFixed(0)}/100</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
