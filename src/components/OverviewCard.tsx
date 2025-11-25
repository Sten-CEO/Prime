import { Card } from "@/components/ui/card";
import { LucideIcon, MoreVertical, Star, Move, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface OverviewItem {
  name: string;
  icon: LucideIcon;
  score: number;
  trend: string;
}

interface OverviewCardProps {
  items: OverviewItem[];
  favorites: string[];
  onToggleFavorite: (name: string) => void;
  onReorderItems: (newOrder: OverviewItem[]) => void;
  isLoading?: boolean;
}

export const OverviewCard = ({ items, favorites, onToggleFavorite, onReorderItems, isLoading = false }: OverviewCardProps) => {
  const navigate = useNavigate();
  const [isReorderOpen, setIsReorderOpen] = useState(false);
  const [localItems, setLocalItems] = useState(items);

  const bestDomain = items.length > 0 
    ? items.reduce((best, item) => {
        const trendValue = parseFloat(item.trend.replace(/[^0-9.-]/g, ''));
        const bestTrendValue = parseFloat(best.trend.replace(/[^0-9.-]/g, ''));
        return trendValue > bestTrendValue ? item : best;
      })
    : null;

  const handleItemClick = (name: string) => {
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    navigate(`/domaines/${slug}`);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...localItems];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setLocalItems(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === localItems.length - 1) return;
    const newItems = [...localItems];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setLocalItems(newItems);
  };

  const handleSaveOrder = () => {
    onReorderItems(localItems);
    setIsReorderOpen(false);
  };

  const handleOpenReorder = () => {
    setLocalItems(items);
    setIsReorderOpen(true);
  };

  return (
    <>
      <Card className="backdrop-blur-xl bg-white/[0.01] border border-white/[0.08] rounded-3xl p-8 h-full shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
        <h2 className="text-lg font-semibold text-white/90 mb-6">Overview</h2>
        <div className="flex justify-between mb-4 px-1">
          <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Domaine</span>
          <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Score</span>
        </div>
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8 text-white/50">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-white/10 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-white/10 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="text-white/70 text-base mb-3">
                Aucune donnée disponible
              </div>
              <p className="text-white/50 text-sm">
                Commencez à enregistrer vos performances pour voir vos statistiques ici
              </p>
            </div>
          ) : (
            items.map((item) => {
              const Icon = item.icon;
              const isPositive = item.trend.startsWith('+');
              const isBest = bestDomain ? item.name === bestDomain.name : false;
              const isFavorite = favorites.includes(item.name);
              
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
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium min-w-[80px]">{item.name}</span>
                        {isFavorite && (
                          <Star className="w-3.5 h-3.5 text-warning fill-warning" style={{ filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))' }} />
                        )}
                      </div>
                      <span className="text-white text-xl font-bold ml-auto">{item.score}</span>
                      <span className={`text-sm font-medium min-w-[60px] text-right ${isPositive ? 'text-success' : 'text-warning'}`} 
                            style={{ filter: isPositive ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))' : 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))' }}>
                        {item.trend}
                      </span>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger className="ml-2 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="w-4 h-4 text-white/50 hover:text-white" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        className="backdrop-blur-3xl bg-white/[0.08] border border-white/[0.2] rounded-2xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.15)] z-50 min-w-[200px]"
                        align="end"
                        sideOffset={5}
                      >
                        <DropdownMenuItem 
                          onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.name); }}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-white/90 hover:bg-white/[0.15] hover:text-white transition-all focus:bg-white/[0.15] focus:text-white outline-none"
                        >
                          <Star className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
                          <span className="text-sm">{isFavorite ? 'Retirer des favoris' : 'Mettre en favori'}</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator className="my-2 bg-white/[0.15] h-px" />
                        
                        <DropdownMenuItem 
                          onClick={(e) => { e.stopPropagation(); handleOpenReorder(); }}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-white/90 hover:bg-white/[0.15] hover:text-white transition-all focus:bg-white/[0.15] focus:text-white outline-none"
                        >
                          <Move className="w-4 h-4" />
                          <span className="text-sm">Réorganiser</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="backdrop-blur-xl bg-black/80 border-white/[0.15] p-3">
                  <div className="space-y-1">
                    <p className="text-white font-semibold">Score actuel: {item.score}/100</p>
                    <p className="text-white/70 text-xs">Variation 7j: {item.trend}</p>
                    <p className="text-white/60 text-xs italic mt-2">Dernier insight: Excellente progression</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })
        )}
        </div>
      </Card>

      {/* Reorder Dialog */}
      <Dialog open={isReorderOpen} onOpenChange={setIsReorderOpen}>
        <DialogContent className="backdrop-blur-3xl bg-white/[0.08] border border-white/[0.2] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.15)] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Réorganiser les domaines</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {localItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.name}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.05] border border-white/[0.1]"
                >
                  <Icon className="w-5 h-5 text-white/70" />
                  <span className="text-white font-medium flex-1">{item.name}</span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/[0.1] disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === localItems.length - 1}
                      className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/[0.1] disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsReorderOpen(false)}
              variant="ghost"
              className="flex-1 text-white/70 hover:text-white hover:bg-white/[0.1]"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSaveOrder}
              className="flex-1 backdrop-blur-xl bg-success/20 hover:bg-success/30 border border-success/40 text-white"
            >
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
