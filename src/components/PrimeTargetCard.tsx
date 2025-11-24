import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface PrimeTargetCardProps {
  title: string;
  progress: number;
  deadline: string;
  status: "in-progress" | "completed" | "delayed";
  completed: boolean;
}

export const PrimeTargetCard = ({ title, progress, deadline, status, completed }: PrimeTargetCardProps) => {
  const statusColors = {
    "in-progress": "bg-success",
    "completed": "bg-success",
    "delayed": "bg-warning",
  };

  const statusLabels = {
    "in-progress": "En cours",
    "completed": "Terminé",
    "delayed": "En retard",
  };

  return (
    <Card className="backdrop-blur-xl bg-white/[0.03] border-white/[0.15] rounded-2xl p-5 hover:bg-white/[0.05] transition-all relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={completed}
          className="mt-1 border-glass-border/30 data-[state=checked]:bg-success data-[state=checked]:border-success"
        />
        
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-sm font-medium text-white mb-1">{title}</h3>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span>{deadline}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${statusColors[status]}`} />
                {statusLabels[status]}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/60">
              <span>Progression</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
              <div 
                className={`h-full ${statusColors[status]} rounded-full transition-all shadow-lg`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
