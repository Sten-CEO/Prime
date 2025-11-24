import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { useState } from "react";

interface CategoryScoreChartProps {
  categoryName: string;
  score: number;
  variation: string;
}

const generateMockData = (days: number) => {
  const data = [];
  const insights = [
    "Excellente régularité",
    "Bon rythme",
    "Légère baisse",
    "Performance stable",
    "Besoin d'ajustement",
    "Progression visible",
    "Objectif atteint"
  ];
  
  for (let i = days; i >= 0; i--) {
    const hasData = Math.random() > 0.3;
    const scoreValue = hasData ? Math.random() * 30 + 70 : null;
    data.push({
      date: `J-${i}`,
      score: scoreValue,
      hasData,
      variation: hasData ? (Math.random() > 0.5 ? `+${(Math.random() * 0.5).toFixed(1)}` : `-${(Math.random() * 0.3).toFixed(1)}`) : null,
      insight: hasData ? insights[Math.floor(Math.random() * insights.length)] : "Jour non rempli"
    });
  }
  return data;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="backdrop-blur-xl bg-black/95 border border-white/[0.2] rounded-xl p-3 shadow-lg animate-fade-in">
        <p className="text-white text-xs font-medium mb-1">{data.date}</p>
        {data.hasData ? (
          <>
            <p className="text-white/80 text-xs">
              Score: <span className="font-semibold text-white">{data.score?.toFixed(0)}/100</span>
            </p>
            <p className={`text-xs ${data.variation?.startsWith('+') ? 'text-success' : 'text-red-500'}`}>
              Variation: {data.variation}
            </p>
            <p className="text-white/60 text-xs mt-1 italic">{data.insight}</p>
            <p className="text-success text-xs mt-1">✓ Rempli</p>
          </>
        ) : (
          <p className="text-white/40 text-xs">Non rempli</p>
        )}
      </div>
    );
  }
  return null;
};

export const CategoryScoreChart = ({ categoryName, score, variation }: CategoryScoreChartProps) => {
  const [period, setPeriod] = useState("7j");
  const days = period === "7j" ? 7 : period === "30j" ? 30 : 90;
  const data = generateMockData(days);

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {categoryName}
          </h2>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-white">{score}</span>
            <span className="text-sm text-white/60">/100</span>
            <span className={`text-sm font-medium ${
              variation.startsWith('-') ? 'text-red-500' : 'text-success'
            }`}>
              {variation}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-20 h-8 bg-white/[0.05] border-white/[0.12] text-white/80 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/95 backdrop-blur-xl border-white/[0.12]">
              <SelectItem value="7j" className="text-white/80">7j</SelectItem>
              <SelectItem value="30j" className="text-white/80">30j</SelectItem>
              <SelectItem value="90j" className="text-white/80">90j</SelectItem>
            </SelectContent>
          </Select>
          
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all group"
            title="Exporter les données"
          >
            <Download className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      <div className="animate-fade-in">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
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
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (!payload.hasData) {
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={3}
                      fill="transparent"
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth={1.5}
                    />
                  );
                }
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="rgba(255,255,255,0.9)"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={2}
                    style={{
                      filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))"
                    }}
                  />
                );
              }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};