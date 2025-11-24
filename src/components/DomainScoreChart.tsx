import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface DomainScoreChartProps {
  domainName: string;
  score: number;
  variation: string;
}

const generateMockData = (days: number) => {
  const data = [];
  for (let i = days; i >= 0; i--) {
    const hasData = Math.random() > 0.3;
    data.push({
      date: `J-${i}`,
      score: hasData ? Math.random() * 3 + 7 : null,
      hasData,
    });
  }
  return data;
};

export const DomainScoreChart = ({ domainName, score, variation }: DomainScoreChartProps) => {
  const [period, setPeriod] = useState("7j");
  const days = period === "7j" ? 7 : period === "30j" ? 30 : 90;
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
            <span className="text-sm text-white/60">/10</span>
            <span className={`text-sm font-medium ${
              variation.startsWith('-') ? 'text-red-500' : 'text-success'
            }`}>
              {variation}
            </span>
          </div>
        </div>

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
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
          />
          <YAxis
            domain={[0, 10]}
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.95)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              padding: "8px 12px",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}
            itemStyle={{ color: "#fff", fontSize: "12px" }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(var(--success))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (!payload.hasData) return null;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill="hsl(var(--success))"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth={2}
                />
              );
            }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
