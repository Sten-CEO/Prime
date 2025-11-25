import { X, Calendar, TrendingUp, AlertCircle, Edit, CheckCircle2, Archive, Trash2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
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

interface TargetDetailPanelProps {
  target: PrimeTarget | null;
  onClose: () => void;
  onUpdate: (target: PrimeTarget) => void;
  onComplete: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (target: PrimeTarget) => void;
  getDomainLabel: (domain: string) => string;
}

export const TargetDetailPanel = ({
  target,
  onClose,
  onUpdate,
  onComplete,
  onArchive,
  onDelete,
  onEdit,
  getDomainLabel,
}: TargetDetailPanelProps) => {
  const navigate = useNavigate();
  const [localProgress, setLocalProgress] = useState(target?.progress || 0);

  if (!target) return null;

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

  const getImportanceLabel = () => {
    switch (target.importance) {
      case "low":
        return "Faible";
      case "normal":
        return "Normal";
      case "crucial":
        return "Crucial ⭐";
      default:
        return target.importance;
    }
  };

  const handleProgressUpdate = (value: number[]) => {
    setLocalProgress(value[0]);
    onUpdate({ ...target, progress: value[0] });
  };

  const handleCompleteClick = () => {
    onComplete(target.id);
    onClose();
  };

  const handleArchiveClick = () => {
    onArchive(target.id);
    onClose();
  };

  const handleDeleteClick = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet objectif ?")) {
      onDelete(target.id);
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[500px] backdrop-blur-xl bg-black/80 border-l border-white/[0.08] z-50 overflow-y-auto animate-slide-in-right">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold text-white mb-2">{target.title}</h2>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <span>{getDomainLabel(target.domain)}</span>
                {target.category && (
                  <>
                    <span>•</span>
                    <span>{target.category}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor()}`}>
                {getStatusLabel()}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-white/[0.1] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
          </div>

          {/* Progression & dates */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Progression & dates
            </h3>

            {/* Slider de progression */}
            <div>
              <div className="flex justify-between text-sm text-white/70 mb-3">
                <span>Progression</span>
                <span className="font-medium">{localProgress}%</span>
              </div>
              <Slider
                value={[localProgress]}
                onValueChange={handleProgressUpdate}
                max={100}
                step={5}
                className="mb-2"
                disabled={target.status === "completed" || target.status === "archived"}
              />
              <Progress value={localProgress} className="h-2 [&>div]:bg-white" />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-lg p-3">
                <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                  <Calendar className="w-3 h-3" />
                  Début
                </div>
                <p className="text-white text-sm">{new Date(target.startDate).toLocaleDateString("fr-FR")}</p>
              </div>

              <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-lg p-3">
                <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                  <Calendar className="w-3 h-3" />
                  Deadline
                </div>
                <p className="text-white text-sm">{new Date(target.deadline).toLocaleDateString("fr-FR")}</p>
              </div>
            </div>

            {/* État calculé */}
            {target.status === "late" && (
              <div className="flex items-start gap-2 backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                <div className="text-sm text-red-300">
                  <p className="font-medium">En retard</p>
                  <p className="text-xs text-red-400/80">La deadline est dépassée et l'objectif n'est pas terminé.</p>
                </div>
              </div>
            )}

            {target.status === "at-risk" && (
              <div className="flex items-start gap-2 backdrop-blur-xl bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5" />
                <div className="text-sm text-orange-300">
                  <p className="font-medium">À risque</p>
                  <p className="text-xs text-orange-400/80">La deadline approche et la progression est faible.</p>
                </div>
              </div>
            )}
          </div>

          {/* Détails & contexte */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 space-y-4">
            <h3 className="text-lg font-semibold text-white">Détails & contexte</h3>

            {target.description && (
              <div>
                <p className="text-sm text-white/50 mb-2">Description</p>
                <p className="text-white/80 text-sm leading-relaxed">{target.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-white/50 mb-2">Importance</p>
                <p className="text-white text-sm">{getImportanceLabel()}</p>
              </div>

              <div>
                <p className="text-sm text-white/50 mb-2">Affichage accueil</p>
                <p className="text-white text-sm">{target.showOnHome ? "Oui" : "Non"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-white/50 mb-2">Domaine & Catégorie</p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/domaines/${target.domain}`)}
                  className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 hover:bg-white/[0.08] transition-all text-white text-sm flex items-center gap-2"
                >
                  {getDomainLabel(target.domain)}
                  <ExternalLink className="w-3 h-3" />
                </button>
                {target.category && (
                  <span className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-white/70 text-sm">
                    {target.category}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Historique lié */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 space-y-3">
            <h3 className="text-lg font-semibold text-white">Historique lié</h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 text-white/60">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Créé le {new Date(target.startDate).toLocaleDateString("fr-FR")}</span>
              </div>

              {target.completedAt && (
                <div className="flex items-center gap-3 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Complété le {new Date(target.completedAt).toLocaleDateString("fr-FR")}</span>
                </div>
              )}

              {target.archivedAt && (
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                  <span>Archivé le {new Date(target.archivedAt).toLocaleDateString("fr-FR")}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate(`/prime-history?target=${target.id}`)}
              className="w-full backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] rounded-lg px-4 py-2 hover:bg-white/[0.08] transition-all text-white text-sm flex items-center justify-center gap-2"
            >
              Ouvrir dans Prime History
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {target.status !== "completed" && target.status !== "archived" && (
              <button
                onClick={handleCompleteClick}
                className="w-full backdrop-blur-xl bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-3 hover:bg-green-500/30 transition-all text-green-400 font-medium flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Marquer comme terminé
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onEdit(target)}
                className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 hover:bg-white/[0.08] transition-all text-white text-sm flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Éditer
              </button>

              {target.status !== "archived" && (
                <button
                  onClick={handleArchiveClick}
                  className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 hover:bg-white/[0.08] transition-all text-white text-sm flex items-center justify-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  Archiver
                </button>
              )}
            </div>

            <button
              onClick={handleDeleteClick}
              className="w-full backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 hover:bg-red-500/20 transition-all text-red-400 text-sm flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
