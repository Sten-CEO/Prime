import { MoreVertical, CheckCircle2, ChevronDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface PrimeTarget {
  id: string;
  title: string;
  description: string;
  domain: string;
  category?: string;
  startDate: string;
  deadline: string;
  progress: number;
  importance: "low" | "normal" | "crucial";
  status: "on-track" | "at-risk" | "late" | "completed" | "archived";
  showOnHome: boolean;
  completedAt?: string;
  archivedAt?: string;
}

interface PrimeTargetCardProps {
  target: PrimeTarget;
  compact?: boolean;
  onView?: () => void;
  onComplete?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  getDomainLabel: (domain: string) => string;
}

export const PrimeTargetCard = ({
  target,
  compact = false,
  onView,
  onComplete,
  onArchive,
  onDelete,
  onEdit,
  getDomainLabel,
}: PrimeTargetCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatusColor = () => {
    switch (target.status) {
      case "on-track":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "at-risk":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "late":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "archived":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-white/10 text-white/60 border-white/20";
    }
  };

  const getStatusLabel = () => {
    switch (target.status) {
      case "on-track":
        return "À temps";
      case "at-risk":
        return "À risque";
      case "late":
        return "En retard";
      case "completed":
        return "Terminé";
      case "archived":
        return "Archivé";
      default:
        return target.status;
    }
  };

  const getProgressColor = () => {
    switch (target.status) {
      case "on-track":
        return "[&>div]:bg-green-500";
      case "at-risk":
        return "[&>div]:bg-orange-500";
      case "late":
        return "[&>div]:bg-red-500";
      case "completed":
        return "[&>div]:bg-green-500";
      default:
        return "[&>div]:bg-white/50";
    }
  };

  if (compact) {
    return (
      <div
        onClick={onView}
        className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 hover:bg-white/[0.06] transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-white font-medium text-sm">{target.title}</h4>
          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor()}`}>
            {getStatusLabel()}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span>{getDomainLabel(target.domain)}</span>
          {target.category && (
            <>
              <span>•</span>
              <span>{target.category}</span>
            </>
          )}
          {target.completedAt && (
            <>
              <span>•</span>
              <span>{new Date(target.completedAt).toLocaleDateString("fr-FR")}</span>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden hover:bg-white/[0.04] transition-all">
      {/* Vue minimaliste - toujours visible */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 flex items-center gap-3">
          <button
            className={`w-6 h-6 rounded-lg hover:bg-white/[0.1] flex items-center justify-center transition-all ${
              isExpanded ? 'rotate-180' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <ChevronDown className="w-4 h-4 text-white/60" />
          </button>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium text-sm truncate">{target.title}</h4>
            <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
              <span>{getDomainLabel(target.domain)}</span>
              {target.category && (
                <>
                  <span>•</span>
                  <span>{target.category}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-white/70">{target.progress}%</span>
            <div className="w-16 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  target.status === "on-track" ? "bg-green-500" :
                  target.status === "at-risk" ? "bg-orange-500" :
                  target.status === "late" ? "bg-red-500" :
                  "bg-white/50"
                }`}
                style={{ width: `${target.progress}%` }}
              />
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="w-7 h-7 rounded-lg hover:bg-white/[0.1] flex items-center justify-center transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-3.5 h-3.5 text-white/60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 border-white/[0.1]">
              <DropdownMenuItem onClick={onView} className="text-white cursor-pointer">
                Voir détails
              </DropdownMenuItem>
              {target.status !== "completed" && (
                <DropdownMenuItem onClick={onComplete} className="text-white cursor-pointer">
                  Marquer comme terminé
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onEdit} className="text-white cursor-pointer">
                Éditer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onArchive} className="text-white cursor-pointer">
                Archiver
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-400 cursor-pointer">
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Détails - visible quand déployé */}
      <div 
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-3 pb-3 pt-0 space-y-3 border-t border-white/[0.05]">
          {/* Barre de progression complète */}
          <div className="pt-3">
            <div className="flex justify-between text-xs text-white/50 mb-2">
              <span>Progression complète</span>
              <span className={`px-2 py-0.5 rounded-full border text-xs ${getStatusColor()}`}>
                {getStatusLabel()}
              </span>
            </div>
            <Progress value={target.progress} className={`h-2 ${getProgressColor()}`} />
          </div>

          {/* Description */}
          {target.description && (
            <p className="text-xs text-white/60">{target.description}</p>
          )}

          {/* Dates */}
          <div className="flex justify-between text-xs text-white/50 pt-1">
            <div>
              <span className="text-white/40">Début:</span> {new Date(target.startDate).toLocaleDateString("fr-FR")}
            </div>
            <div>
              <span className="text-white/40">Deadline:</span> {new Date(target.deadline).toLocaleDateString("fr-FR")}
            </div>
          </div>

          {/* Badge d'importance */}
          {target.importance === "crucial" && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              ⭐ Crucial
            </span>
          )}

          {/* Bouton objectif atteint */}
          {target.status !== "completed" && target.status !== "archived" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete?.();
              }}
              className="w-full flex items-center justify-center gap-2 backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 hover:bg-white/[0.08] transition-all text-white/70 text-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Objectif atteint
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
