import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DomainCardProps {
  name: string;
  icon: LucideIcon;
  score: number;
  trend: string;
  fillRate: number;
  status: "success" | "warning" | "danger";
}

export const DomainCard = ({ name, icon: Icon, score, trend, fillRate, status }: DomainCardProps) => {
  const statusColors = {
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
  };

  return (
    <Card className="min-w-[200px] backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 hover:bg-white/[0.03] hover:border-white/[0.25] transition-all relative overflow-hidden shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/[0.04] backdrop-blur-lg flex items-center justify-center border border-white/[0.15] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
          <Icon className="w-6 h-6 text-white drop-shadow-lg" />
        </div>
        
        <div className="text-center">
          <h3 className="text-sm font-medium text-white/80 mb-1">{name}</h3>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-white">{score}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]} text-white`}>
              {trend}
            </span>
          </div>
        </div>
        
        <div className="w-full">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Rempli</span>
            <span>{fillRate}%</span>
          </div>
          <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden backdrop-blur-lg border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
            <div 
              className={`h-full ${statusColors[status]} rounded-full transition-all drop-shadow-lg`}
              style={{ width: `${fillRate}%` }}
            />
          </div>
        </div>
        
        <div className={`w-2 h-2 rounded-full ${statusColors[status]} drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]`} />
      </div>
    </Card>
  );
};
