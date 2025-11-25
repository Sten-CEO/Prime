import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { useState, useMemo } from "react";
import { useDomainColors } from "@/hooks/useDomainColors";
import { subDays, subMonths, format } from "date-fns";
import { fr } from "date-fns/locale";

// Generate mock data for different periods
const generateMockData = (days: number) => {
  const data = [];
  const today = new Date();
  
  if (days === 365) {
    // 12 mois: 1 point par mois
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(today, i);
      const monthLabel = format(date, "MMM", { locale: fr });
      
      const business = Math.floor(Math.random() * 30) + 70;
      const sport = Math.floor(Math.random() * 30) + 65;
      const social = Math.floor(Math.random() * 30) + 60;
      const sante = Math.floor(Math.random() * 30) + 75;
      const general = Math.round((business + sport + social + sante) / 4);
      
      data.push({
        day: monthLabel,
        Business: business,
        Sport: sport,
        Social: social,
        Santé: sante,
        Général: general,
      });
    }
  } else if (days === 90) {
    // 90 jours: 1 point par semaine (13 semaines)
    for (let i = 12; i >= 0; i--) {
      const date = subDays(today, i * 7);
      const weekLabel = `S${13 - i}`;
      
      const business = Math.floor(Math.random() * 30) + 70;
      const sport = Math.floor(Math.random() * 30) + 65;
      const social = Math.floor(Math.random() * 30) + 60;
      const sante = Math.floor(Math.random() * 30) + 75;
      const general = Math.round((business + sport + social + sante) / 4);
      
      data.push({
        day: weekLabel,
        Business: business,
        Sport: sport,
        Social: social,
        Santé: sante,
        Général: general,
      });
    }
  } else {
    // 7 ou 30 jours: 1 point par jour
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dayLabel = days <= 7 
        ? format(date, "EEE", { locale: fr }).slice(0, 3)
        : format(date, "d MMM", { locale: fr });
      
      const business = Math.floor(Math.random() * 30) + 70;
      const sport = Math.floor(Math.random() * 30) + 65;
      const social = Math.floor(Math.random() * 30) + 60;
      const sante = Math.floor(Math.random() * 30) + 75;
      const general = Math.round((business + sport + social + sante) / 4);
      
      data.push({
        day: dayLabel,
        Business: business,
        Sport: sport,
        Social: social,
        Santé: sante,
        Général: general,
      });
    }
  }
  
  return data;
};

const domainMapping: Record<string, string> = {
  "Business": "business",
  "Sport": "sport",
  "Social": "social",
  "Santé": "sante",
  "Général": "general",
};

const periods = [
  { label: "7j", value: "7d" },
  { label: "30j", value: "30d" },
  { label: "90j", value: "90d" },
  { label: "12m", value: "12m" },
];

export const MultiDomainChart = () => {
  const { getDomainColor } = useDomainColors();
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [activeDomains, setActiveDomains] = useState<Record<string, boolean>>({
    Business: true,
    Sport: true,
    Social: true,
    Santé: true,
    Général: true,
  });
  const [compareMode, setCompareMode] = useState(false);
  const [comparedDomains, setComparedDomains] = useState<string[]>([]);
  const [mouseX, setMouseX] = useState<number | null>(null);
  
  // Generate data based on selected period
  const chartData = useMemo(() => {
    const daysMap: Record<string, number> = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "12m": 365,
    };
    return generateMockData(daysMap[selectedPeriod] || 7);
  }, [selectedPeriod]);
  
  // Calculate week variation for "Général"
  const weekVariation = useMemo(() => {
    if (chartData.length < 7) return "+0%";
    
    const lastWeek = chartData.slice(-7);
    const previousWeek = chartData.slice(-14, -7);
    
    if (previousWeek.length === 0) return "+0%";
    
    const lastWeekAvg = lastWeek.reduce((sum, d) => sum + (d.Général || 0), 0) / lastWeek.length;
    const previousWeekAvg = previousWeek.reduce((sum, d) => sum + (d.Général || 0), 0) / previousWeek.length;
    
    const change = ((lastWeekAvg - previousWeekAvg) / previousWeekAvg) * 100;
    return `${change > 0 ? '+' : ''}${Math.round(change)}%`;
  }, [chartData]);

  const domains = useMemo(() => {
    return Object.keys(domainMapping).map(key => {
      const slug = domainMapping[key];
      const hslColor = getDomainColor(slug);
      // Général reste complètement blanc pur (RGB)
      const isGeneral = slug === 'general';
      return {
        key,
        color: isGeneral ? 'rgb(255, 255, 255)' : `hsl(${hslColor} / 0.6)`,
        activeColor: isGeneral ? 'rgb(255, 255, 255)' : `hsl(${hslColor} / 0.9)`,
      };
    });
  }, [getDomainColor]);

  const toggleDomain = (domain: string) => {
    setActiveDomains(prev => ({ ...prev, [domain]: !prev[domain] }));
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (!compareMode) {
      setComparedDomains([]);
    }
  };

  const selectForCompare = (domain: string) => {
    if (comparedDomains.includes(domain)) {
      setComparedDomains(comparedDomains.filter(d => d !== domain));
    } else if (comparedDomains.length < 2) {
      setComparedDomains([...comparedDomains, domain]);
    }
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex gap-3 justify-center flex-wrap mb-2">
        {payload.map((entry: any) => {
          const domainKey = entry.value;
          const isActive = activeDomains[domainKey];
          const isCompared = compareMode && comparedDomains.includes(domainKey);
          const domain = domains.find(d => d.key === domainKey);
          const color = domain?.color || entry.color;
          
          return (
            <button
              key={domainKey}
              onClick={() => {
                if (compareMode) {
                  selectForCompare(domainKey);
                } else {
                  toggleDomain(domainKey);
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
              <span className="text-white text-xs">{domainKey}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-xl p-3 shadow-lg">
          <p className="text-white text-xs font-medium mb-2">{label}</p>
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-white/70">{entry.name}</span>
              <span className="text-white font-semibold">{entry.value}</span>
              <span className="text-success text-xs">+5</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="backdrop-blur-2xl bg-white/[0.02] border border-white/[0.12] rounded-2xl p-8 relative overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
      {/* Aura effect */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/[0.05] rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-aura-cyan/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Performance Multi-Domaines</h2>
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium ${
              weekVariation.startsWith('-') 
                ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]' 
                : 'text-success drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]'
            }`}>
              {weekVariation}
            </span>
            
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
          </div>
        </div>
        
        {/* Chart */}
        <div onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMouseX(e.clientX - rect.left);
        }} onMouseLeave={() => setMouseX(null)}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--glass-border) / 0.1)" />
              <XAxis 
                dataKey="day" 
                stroke="rgba(255, 255, 255, 0.6)"
                style={{ fontSize: '12px', fill: 'white' }}
              />
              <YAxis 
                stroke="rgba(255, 255, 255, 0.6)"
                style={{ fontSize: '12px', fill: 'white' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              {domains.map(({ key, color, activeColor }) => {
                const isActive = activeDomains[key];
                const isCompared = compareMode && comparedDomains.includes(key);
                const opacity = compareMode 
                  ? (isCompared ? 1 : 0.15)
                  : (isActive ? 1 : 0.15);
                const strokeColor = compareMode && isCompared ? activeColor : color;
                
                return (
                  <Line 
                    key={key}
                    type="monotone" 
                    dataKey={key}
                    stroke={strokeColor}
                    strokeWidth={2.5}
                    opacity={opacity}
                    dot={{ fill: strokeColor, r: 2, filter: `drop-shadow(0 0 4px ${strokeColor})` }}
                    activeDot={{ r: 4 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
