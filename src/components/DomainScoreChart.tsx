import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState, useMemo } from "react";
import { useDomainColors } from "@/hooks/useDomainColors";
import { subDays, subMonths, format as formatDate } from "date-fns";
import { fr } from "date-fns/locale";

interface Category {
  id: string;
  name: string;
  color?: string;
  score: number;
}

interface DomainScoreChartProps {
  domainName: string;
  domainSlug: string;
  score: number;
  variation: string;
  categories?: Category[];
}

const generateMockData = (days: number, categories?: Category[]) => {
  const data = [];
  const today = new Date();
  
  if (days === 365) {
    // 12 mois: 1 point par mois
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(today, i);
      const monthLabel = formatDate(date, "MMM", { locale: fr });
      
      const hasData = Math.random() > 0.2;
      const scoreValue = hasData ? Math.floor(Math.random() * 30) + 70 : null;
      
      const dataPoint: any = {
        date: monthLabel,
        score: scoreValue,
        hasData,
      };
      
      categories?.forEach(cat => {
        const catHasData = Math.random() > 0.2;
        dataPoint[cat.id] = catHasData ? Math.floor(Math.random() * 30) + 65 : null;
      });
      
      data.push(dataPoint);
    }
  } else if (days === 90) {
    // 90 jours: 1 point par semaine (13 semaines)
    for (let i = 12; i >= 0; i--) {
      const date = subDays(today, i * 7);
      const weekLabel = `S${13 - i}`;
      
      const hasData = Math.random() > 0.2;
      const scoreValue = hasData ? Math.floor(Math.random() * 30) + 70 : null;
      
      const dataPoint: any = {
        date: weekLabel,
        score: scoreValue,
        hasData,
      };
      
      categories?.forEach(cat => {
        const catHasData = Math.random() > 0.2;
        dataPoint[cat.id] = catHasData ? Math.floor(Math.random() * 30) + 65 : null;
      });
      
      data.push(dataPoint);
    }
  } else {
    // 7, 14 ou 30 jours: 1 point par jour
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dayLabel = days <= 7 
        ? formatDate(date, "EEE", { locale: fr }).slice(0, 3)
        : formatDate(date, "d MMM", { locale: fr });
      
      const hasData = Math.random() > 0.2;
      const scoreValue = hasData ? Math.floor(Math.random() * 30) + 70 : null;
      
      const dataPoint: any = {
        date: dayLabel,
        score: scoreValue,
        hasData,
      };
      
      categories?.forEach(cat => {
        const catHasData = Math.random() > 0.2;
        dataPoint[cat.id] = catHasData ? Math.floor(Math.random() * 30) + 65 : null;
      });
      
      data.push(dataPoint);
    }
  }
  
  return data;
};

const periods = [
  { label: "7j", value: "7d" },
  { label: "30j", value: "30d" },
  { label: "90j", value: "90d" },
  { label: "12m", value: "12m" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="backdrop-blur-xl bg-black/95 border border-white/[0.2] rounded-xl p-3 shadow-lg animate-fade-in">
        <p className="text-white text-xs font-medium mb-1">{data.date}</p>
        {data.hasData ? (
          <>
            <p className="text-white/80 text-xs">
              Indice: <span className="font-semibold text-white">{data.score?.toFixed(1)}</span>
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

const defaultCategoryColors: { [key: string]: string } = {
  strategie: "rgba(34, 211, 238, 0.8)",
  execution: "rgba(16, 185, 129, 0.8)",
  entrainement: "rgba(16, 185, 129, 0.8)",
  relations: "rgba(244, 114, 182, 0.8)",
  bienetre: "rgba(168, 85, 247, 0.8)",
};

export const DomainScoreChart = ({ domainName, domainSlug, score, variation, categories = [] }: DomainScoreChartProps) => {
  const { getDomainColor } = useDomainColors();
  const domainHslColor = getDomainColor(domainSlug);
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [activeCategories, setActiveCategories] = useState<Record<string, boolean>>(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: true }), {})
  );
  const [compareMode, setCompareMode] = useState(false);
  const [comparedCategories, setComparedCategories] = useState<string[]>([]);
  
  const days = selectedPeriod === "7d" ? 7 : selectedPeriod === "30d" ? 30 : selectedPeriod === "90d" ? 90 : 365;
  const data = useMemo(() => generateMockData(days, categories), [days, categories]);

  const toggleCategory = (categoryId: string) => {
    setActiveCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (!compareMode) {
      setComparedCategories([]);
    }
  };

  const selectForCompare = (categoryId: string) => {
    if (comparedCategories.includes(categoryId)) {
      setComparedCategories(comparedCategories.filter(c => c !== categoryId));
    } else if (comparedCategories.length < 2) {
      setComparedCategories([...comparedCategories, categoryId]);
    }
  };

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {domainName}
          </h2>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-white">{score}</span>
            <span className="text-sm text-white/60">indice</span>
            <span className={`text-sm font-medium ${
              variation.startsWith('-') ? 'text-red-500' : 'text-success'
            }`}>
              {variation}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex gap-1 backdrop-blur-xl bg-white/[0.04] border border-white/[0.1] rounded-lg p-1">
            {periods.map((period) => (
              <Button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                variant="ghost"
                size="sm"
                className={`h-7 px-3 text-xs transition-all ${
                  selectedPeriod === period.value
                    ? "bg-white/[0.15] text-white"
                    : "text-white/60 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                {period.label}
              </Button>
            ))}
          </div>

          {/* Compare button */}
          <Button
            onClick={toggleCompareMode}
            variant="ghost"
            size="sm"
            className={`h-7 px-3 text-xs transition-all ${
              compareMode
                ? "bg-aura-cyan/20 text-aura-cyan border border-aura-cyan/40"
                : "text-white/60 hover:text-white hover:bg-white/[0.08]"
            }`}
          >
            Comparer
          </Button>
          
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
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Category lines */}
            {categories.map((cat) => {
              const isActive = activeCategories[cat.id];
              const isCompared = compareMode && comparedCategories.includes(cat.id);
              const opacity = compareMode 
                ? (isCompared ? 1 : 0.15)
                : (isActive ? 1 : 0.15);
              const color = cat.color || defaultCategoryColors[cat.id] || "rgba(100, 100, 100, 0.8)";
              
              return (
                <Line
                  key={cat.id}
                  type="monotone"
                  dataKey={cat.id}
                  stroke={color}
                  strokeWidth={2}
                  opacity={opacity}
                  dot={{ fill: color, r: 2, filter: `drop-shadow(0 0 4px ${color})` }}
                  activeDot={{ r: 4 }}
                  connectNulls={false}
                />
              );
            })}
            
            {/* Main domain line - uses domain color */}
            <Line
              type="monotone"
              dataKey="score"
              stroke={`hsl(${domainHslColor})`}
              strokeWidth={3}
              dot={{ fill: `hsl(${domainHslColor})`, r: 2, filter: `drop-shadow(0 0 4px hsl(${domainHslColor}))` }}
              activeDot={{ r: 4 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="flex gap-2 mt-4 justify-center flex-wrap">
          {categories.map((cat) => {
            const color = cat.color || defaultCategoryColors[cat.id] || "rgba(100, 100, 100, 0.8)";
            const isActive = activeCategories[cat.id];
            const isCompared = compareMode && comparedCategories.includes(cat.id);
            
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (compareMode) {
                    selectForCompare(cat.id);
                  } else {
                    toggleCategory(cat.id);
                  }
                }}
                className="flex items-center gap-2 transition-all cursor-pointer"
                style={{ opacity: isActive ? 1 : 0.3 }}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: color,
                    boxShadow: isActive ? `0 0 6px ${color}` : 'none'
                  }}
                />
                <span className="text-white text-xs">{cat.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
};