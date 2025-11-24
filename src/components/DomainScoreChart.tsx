import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { useState } from "react";

interface DomainScoreChartProps {
  domainName: string;
  score: number;
  variation: string;
}

const generateMockData = (days: number) => {
  const data = [];
  const insights = [
    "Excellente productivité",
    "Bonne régularité",
    "Légère baisse d'énergie",
    "Performance optimale",
    "Besoin de repos",
    "Progression constante",
    "Concentration au top"
  ];
  
  let prevScore = 85;
  for (let i = days; i >= 0; i--) {
    const hasData = Math.random() > 0.2;
    const scoreValue = hasData ? Math.max(50, Math.min(100, prevScore + (Math.random() - 0.5) * 10)) : null;
    if (scoreValue) prevScore = scoreValue;
    
    data.push({
      date: `J-${i}`,
      score: scoreValue,
      prevScore: hasData ? prevScore : null,
      hasData,
      variation: hasData && scoreValue ? `${scoreValue > prevScore ? '+' : ''}${((scoreValue - prevScore) / prevScore * 100).toFixed(1)}%` : null,
      insight: hasData ? insights[Math.floor(Math.random() * insights.length)] : "Jour non rempli"
    });
  }
  
  const movingAvg = data.map((point, idx) => {
    const window = data.slice(Math.max(0, idx - 2), idx + 1).filter(p => p.hasData);
    const avg = window.length > 0 ? window.reduce((sum, p) => sum + (p.score || 0), 0) / window.length : null;
    return { ...point, movingAvg: avg };
  });
  
  return movingAvg;
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
            {data.prevScore && (
              <p className="text-white/60 text-xs">
                Score précédent: <span className="font-medium">{data.prevScore.toFixed(0)}</span>
              </p>
            )}
            <p className={`text-xs font-medium ${data.variation?.startsWith('+') ? 'text-success' : data.variation?.startsWith('-') ? 'text-red-500' : 'text-white/60'}`}>
              Variation: {data.variation}
            </p>
            <p className="text-white/60 text-xs mt-1 italic">{data.insight}</p>
            <p className="text-success text-xs mt-1">✓ Rempli</p>
          </>
        ) : (
          <p className="text-white/40 text-xs">❌ Non rempli</p>
        )}
      </div>
    );
  }
  return null;
};

const downloadChart = () => {
  const svg = document.querySelector('.recharts-surface');
  if (!svg) return;
  
  const svgData = new XMLSerializer().serializeToString(svg as Element);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'chart.svg';
  link.click();
  URL.revokeObjectURL(url);
};

export const DomainScoreChart = ({ domainName, score, variation }: DomainScoreChartProps) => {
  const [period, setPeriod] = useState("7j");
  const days = period === "7j" ? 7 : period === "14j" ? 14 : period === "30j" ? 30 : period === "90j" ? 90 : 365;
  const data = generateMockData(days);

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {domainName}
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
              <SelectItem value="14j" className="text-white/80">14j</SelectItem>
              <SelectItem value="30j" className="text-white/80">30j</SelectItem>
              <SelectItem value="90j" className="text-white/80">90j</SelectItem>
              <SelectItem value="12m" className="text-white/80">12 mois</SelectItem>
            </SelectContent>
          </Select>
          
          <button 
            onClick={downloadChart}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all group"
            title="Exporter les données"
          >
            <Download className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      <div className="animate-fade-in transition-all duration-500">
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
              dataKey="movingAvg"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={1}
              dot={false}
              strokeDasharray="2 2"
              connectNulls={true}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth={2}
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
                      strokeDasharray="2 2"
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
                    className="cursor-pointer transition-all hover:r-6"
                    style={{
                      filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))"
                    }}
                  />
                );
              }}
              connectNulls={false}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};