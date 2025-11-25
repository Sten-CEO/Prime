import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { useState, useMemo } from "react";
import { useDomainColors } from "@/hooks/useDomainColors";

const mockData = [
  { day: "Lun", Business: 80, Sport: 70, Social: 60, Santé: 90 },
  { day: "Mar", Business: 70, Sport: 80, Social: 70, Santé: 80 },
  { day: "Mer", Business: 90, Sport: 60, Social: 80, Santé: 70 },
  { day: "Jeu", Business: 80, Sport: 90, Social: 70, Santé: 90 },
  { day: "Ven", Business: 90, Sport: 80, Social: 90, Santé: 80 },
  { day: "Sam", Business: 70, Sport: 90, Social: 80, Santé: 90 },
  { day: "Dim", Business: 80, Sport: 70, Social: 90, Santé: 80 },
];

const domainMapping: Record<string, string> = {
  "Business": "business",
  "Sport": "sport",
  "Social": "social",
  "Santé": "sante",
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
  });
  const [compareMode, setCompareMode] = useState(false);
  const [comparedDomains, setComparedDomains] = useState<string[]>([]);
  const [mouseX, setMouseX] = useState<number | null>(null);
  
  const weekVariation = "+18% cette semaine";

  const domains = useMemo(() => {
    return Object.keys(domainMapping).map(key => {
      const slug = domainMapping[key];
      const hslColor = getDomainColor(slug);
      return {
        key,
        color: `hsl(${hslColor} / 0.6)`,
        activeColor: `hsl(${hslColor} / 0.9)`,
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
            <LineChart data={mockData}>
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
              <Legend />
              {domains.map(({ key, color, activeColor }) => {
                const isActive = activeDomains[key];
                const isCompared = compareMode && comparedDomains.includes(key);
                const opacity = compareMode 
                  ? (isCompared ? 1 : 0.2)
                  : (isActive ? 1 : 0.2);
                const strokeColor = compareMode && isCompared ? activeColor : color;
                
                return isActive && (
                  <Line 
                    key={key}
                    type="monotone" 
                    dataKey={key}
                    stroke={strokeColor}
                    strokeWidth={2.5}
                    opacity={opacity}
                    dot={{ fill: strokeColor, r: 4, filter: `drop-shadow(0 0 4px ${strokeColor})` }}
                    activeDot={{ r: 6 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Domain toggles */}
        <div className="flex gap-3 mt-4 justify-center flex-wrap">
          {domains.map(({ key, color }) => (
            <button
              key={key}
              onClick={() => {
                if (compareMode) {
                  selectForCompare(key);
                } else {
                  toggleDomain(key);
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                compareMode && comparedDomains.includes(key)
                  ? "bg-white/[0.15] border border-white/[0.3]"
                  : activeDomains[key]
                  ? "bg-white/[0.08] border border-white/[0.15]"
                  : "bg-white/[0.02] border border-white/[0.08] opacity-50"
              }`}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ 
                  backgroundColor: color,
                  boxShadow: activeDomains[key] ? `0 0 8px ${color}` : 'none'
                }}
              />
              <span className="text-white text-xs">{key}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};
