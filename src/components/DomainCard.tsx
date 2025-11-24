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
    <Card className="min-w-[200px] backdrop-blur-xl bg-glass-bg/20 border-glass-border/10 rounded-3xl p-6 hover:bg-glass-bg/25 transition-all">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-glass-bg/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-foreground" />
        </div>
        
        <div className="text-center">
          <h3 className="text-sm font-medium text-foreground/80 mb-1">{name}</h3>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-foreground">{score}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]} text-white`}>
              {trend}
            </span>
          </div>
        </div>
        
        <div className="w-full">
          <div className="flex justify-between text-xs text-foreground/60 mb-1">
            <span>Rempli</span>
            <span>{fillRate}%</span>
          </div>
          <div className="h-1.5 bg-glass-bg/10 rounded-full overflow-hidden">
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
