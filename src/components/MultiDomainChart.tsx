import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useMemo } from "react";
import { useDomainColors } from "@/hooks/useDomainColors";
import { useMultiDomainPerformanceData } from "@/hooks/useMultiDomainPerformanceData";
import { useDomains } from "@/hooks/useDomains";

const periods = [
  { label: "7j", value: "7d" },
  { label: "30j", value: "30d" },
  { label: "90j", value: "90d" },
  { label: "12m", value: "12m" },
];

export const MultiDomainChart = () => {
  const { getDomainColor } = useDomainColors();
  const { domains: dbDomains, isLoading: isLoadingDomains } = useDomains();
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  
  // Construire dynamiquement la liste des domaines actifs
  const initialActiveDomains = useMemo(() => {
    const active: Record<string, boolean> = { Général: true };
    dbDomains.forEach(domain => {
      active[domain.name] = true;
    });
    return active;
  }, [dbDomains]);
  
  const [activeDomains, setActiveDomains] = useState<Record<string, boolean>>(initialActiveDomains);
  const [compareMode, setCompareMode] = useState(false);
  const [comparedDomains, setComparedDomains] = useState<string[]>([]);
  const [mouseX, setMouseX] = useState<number | null>(null);
  
  const daysMap: Record<string, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
    "12m": 365,
  };
  
  const days = daysMap[selectedPeriod] || 7;
  const domainSlugs = dbDomains.map(d => d.slug);
  
  const { data: rawData, isLoading } = useMultiDomainPerformanceData(days, domainSlugs);
  
  // Transform data to match expected format
  const chartData = useMemo(() => {
    if (!rawData || !dbDomains.length) return [];
    
    return rawData.map((point: any) => {
      const dataPoint: any = { day: point.date };
      dbDomains.forEach(domain => {
        dataPoint[domain.name] = point[domain.slug] || 0;
      });
      dataPoint.Général = point.general || 0;
      return dataPoint;
    });
  }, [rawData, dbDomains]);
  
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
    const domainList = dbDomains.map(domain => ({
      key: domain.name,
      slug: domain.slug,
      color: domain.slug === 'general' ? 'rgb(255, 255, 255)' : `hsl(${getDomainColor(domain.slug)} / 0.6)`,
      activeColor: domain.slug === 'general' ? 'rgb(255, 255, 255)' : `hsl(${getDomainColor(domain.slug)} / 0.9)`,
    }));
    
    // Ajouter "Général" à la fin
    domainList.push({
      key: 'Général',
      slug: 'general',
      color: 'rgb(255, 255, 255)',
      activeColor: 'rgb(255, 255, 255)',
    });
    
    return domainList;
  }, [dbDomains, getDomainColor]);

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
          {isLoading || isLoadingDomains ? (
            <div className="flex items-center justify-center h-[300px] text-white/60">
              Chargement des données...
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </Card>
  );
};
