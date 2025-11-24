import { Card } from "@/components/ui/card";
import { LucideIcon, MoreVertical } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OverviewItem {
  name: string;
  icon: LucideIcon;
  score: number;
  trend: string;
}

interface OverviewCardProps {
  items: OverviewItem[];
}

export const OverviewCard = ({ items }: OverviewCardProps) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (name: string) => {
    setFavorites(prev => 
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };

  const bestDomain = items.reduce((best, item) => {
    const trendValue = parseFloat(item.trend.replace(/[^0-9.-]/g, ''));
    const bestTrendValue = parseFloat(best.trend.replace(/[^0-9.-]/g, ''));
    return trendValue > bestTrendValue ? item : best;
  });

  const handleItemClick = (name: string) => {
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    navigate(`/domaines/${slug}`);
  };

  return (
    <Card className="backdrop-blur-xl bg-white/[0.01] border border-white/[0.08] rounded-3xl p-8 h-full shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
      <h2 className="text-lg font-semibold text-white/90 mb-6">Overview</h2>
      <div className="flex justify-between mb-4 px-1">
        <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Domaine</span>
        <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Score</span>
      </div>
      <div className="space-y-6">
        {items.map((item) => {
          const Icon = item.icon;
          const isPositive = item.trend.startsWith('+');
          const isBest = item.name === bestDomain.name;
          
          return (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <div 
                  className={`flex items-center gap-4 cursor-pointer rounded-xl p-3 -mx-3 transition-all hover:bg-white/[0.05] relative group ${
                    isBest ? 'animate-pulse-slow' : ''
                  }`}
                  onClick={() => handleItemClick(item.name)}
                >
                  {isBest && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-success/10 to-transparent blur-xl -z-10" />
                  )}
                  <Icon className="w-6 h-6 text-white/70" style={{ filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.4))' }} />
                  <span className="text-white font-medium min-w-[80px]">{item.name}</span>
                  <span className="text-white text-xl font-bold ml-auto">{item.score}</span>
                  <span className={`text-sm font-medium min-w-[60px] text-right ${isPositive ? 'text-success' : 'text-warning'}`} 
                        style={{ filter: isPositive ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))' : 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))' }}>
                    {item.trend}
                  </span>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger className="ml-2 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="w-4 h-4 text-white/50 hover:text-white" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="backdrop-blur-xl bg-black/80 border-white/[0.15]">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleFavorite(item.name); }}>
                        {favorites.includes(item.name) ? '★' : '☆'} {favorites.includes(item.name) ? 'Retirer des favoris' : 'Mettre en favori'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        Réorganiser
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="backdrop-blur-xl bg-black/80 border-white/[0.15] p-3">
                <div className="space-y-1">
                  <p className="text-white font-semibold">Score actuel: {item.score}/10</p>
                  <p className="text-white/70 text-xs">Variation 7j: {item.trend}</p>
                  <p className="text-white/60 text-xs italic mt-2">Dernier insight: Excellente progression</p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </Card>
  );
};
