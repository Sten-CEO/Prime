import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

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
          
          return (
            <div key={item.name} className="flex items-center gap-4">
              <Icon className="w-6 h-6 text-white/70" style={{ filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.4))' }} />
              <span className="text-white font-medium min-w-[80px]">{item.name}</span>
              <span className="text-white text-xl font-bold ml-auto">{item.score}</span>
              <span className={`text-sm font-medium min-w-[60px] text-right ${isPositive ? 'text-success' : 'text-warning'}`} 
                    style={{ filter: isPositive ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))' : 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))' }}>
                {item.trend}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
