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
    <Card className="min-w-[200px] backdrop-blur-2xl bg-white/[0.02] border border-white/[0.12] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/[0.18] transition-all relative overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/[0.06] backdrop-blur-md flex items-center justify-center border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
          <Icon className="w-6 h-6 text-white" />
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
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden backdrop-blur-md border border-white/[0.08]">
            <div 
              className={`h-full ${statusColors[status]} rounded-full transition-all`}
              style={{ width: `${fillRate}%` }}
            />
          </div>
        </div>
        
        <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
      </div>
    </Card>
  );
};
