import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown, GripVertical } from "lucide-react";

interface PrimeTargetCardProps {
  id: string | number;
  title: string;
  progress: number;
  deadline: string;
  status: "in-progress" | "completed" | "delayed";
  completed: boolean;
  domain?: string;
  onToggle?: () => void;
  index: number;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export const PrimeTargetCard = ({ 
  id, 
  title, 
  progress, 
  deadline, 
  status, 
  completed, 
  onToggle, 
  index, 
  onDragStart,
  onDragEnd,
  isDragging
}: PrimeTargetCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChecked, setIsChecked] = useState(completed);
  const [showAnimation, setShowAnimation] = useState(false);

  const statusColors = {
    "in-progress": "bg-success shadow-[0_0_20px_rgba(16,185,129,0.6)]",
    "completed": "bg-success shadow-[0_0_20px_rgba(16,185,129,0.6)]",
    "delayed": "bg-warning shadow-[0_0_20px_rgba(251,146,60,0.6)]",
  };

  const statusLabels = {
    "in-progress": "En cours",
    "completed": "Terminé",
    "delayed": "En retard",
  };

  const getAutoTag = () => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (progress >= 90) return { label: "En avance", color: "text-success" };
    if (daysUntilDeadline < 0) return { label: "En retard", color: "text-warning" };
    if (progress / 100 > (1 - daysUntilDeadline / 30)) return { label: "En avance", color: "text-success" };
    return { label: "À temps", color: "text-aura-cyan" };
  };

  const autoTag = getAutoTag();

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
    if (checked) {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 600);
    }
    onToggle?.();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    onDragStart(index);
  };

  return (
    <Card 
      className={`backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-5 hover:bg-white/[0.03] hover:border-white/[0.25] transition-all relative overflow-hidden shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] group ${
        isDragging ? "opacity-30 scale-95" : ""
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      {showAnimation && (
        <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent animate-ping pointer-events-none" />
      )}
      
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing mt-1">
          <GripVertical className="w-4 h-4 text-white/70" />
        </div>

        <Checkbox 
          checked={isChecked}
          onCheckedChange={handleCheckboxChange}
          className="mt-1 border-glass-border/30 data-[state=checked]:bg-success data-[state=checked]:border-success transition-all"
        />
        
        <div className="flex-1 space-y-3">
          <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-medium text-white mb-1 flex-1">{title}</h3>
              <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60 flex-wrap">
              <span>{deadline}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${statusColors[status]}`} />
                {statusLabels[status]}
              </span>
              <span>•</span>
              <span className={`${autoTag.color} font-medium`}>{autoTag.label}</span>
            </div>
          </div>
          
          {isExpanded && (
            <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.08] space-y-2 animate-accordion-down">
              <p className="text-xs text-white/70">
                Description: Cet objectif vise à atteindre un jalon important dans votre développement.
              </p>
              <div className="space-y-1">
                <p className="text-xs text-white/60">Sous-objectifs:</p>
                <ul className="text-xs text-white/50 list-disc list-inside">
                  <li>Étape 1 - Complétée ✓</li>
                  <li>Étape 2 - En cours</li>
                  <li>Étape 3 - À venir</li>
                </ul>
              </div>
              <p className="text-xs text-white/50 italic">Notes: Avance bien, continuer sur cette lancée.</p>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/60">
              <span>Progression</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden backdrop-blur-lg border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
              <div 
                className={`h-full ${statusColors[status]} rounded-full transition-all duration-300`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
