import { Card } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { AddFreePerformanceModal } from "@/components/modals/AddFreePerformanceModal";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Performance {
  id: string;
  title: string;
  date: string;
  description?: string;
  score: number;
  impact: "positive" | "neutral" | "negative";
}

interface DomainPerformancesProps {
  domainName: string;
  performances: Performance[];
}

export const DomainPerformances = ({ domainName, performances: initialPerformances }: DomainPerformancesProps) => {
  const [performances, setPerformances] = useState(initialPerformances);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAdd = (performance: {
    title: string;
    date: string;
    description?: string;
    score: number;
    impact: "positive" | "neutral" | "negative";
  }) => {
    const newPerf: Performance = {
      id: `fp${Date.now()}`,
      title: performance.title,
      date: performance.date,
      description: performance.description,
      score: performance.score,
      impact: performance.impact,
    };
    setPerformances([newPerf, ...performances]);
    toast({
      title: "Performance libre ajoutée",
      description: `${performance.title} a été enregistrée pour le ${format(new Date(performance.date), "d MMMM yyyy", { locale: fr })}.`,
    });
  };

  const handleDelete = (id: string) => {
    setPerformances(performances.filter((p) => p.id !== id));
    toast({ title: "Performance supprimée", description: "La performance a été supprimée." });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-success/20";
    if (score >= 50) return "bg-yellow-500/20";
    return "bg-red-500/20";
  };

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Performances Libres</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all text-white/70 hover:text-white text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter</span>
        </button>
      </div>
      
      <div className="space-y-3">
        {performances.length === 0 ? (
          <p className="text-white/40 text-sm text-center py-8">Aucune performance libre enregistrée</p>
        ) : (
          performances.map((perf) => (
            <div key={perf.id} className="space-y-0">
              <div
                onClick={() => setExpandedId(expandedId === perf.id ? null : perf.id)}
                className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-white/90 font-medium truncate">{perf.title}</p>
                      {perf.impact === "positive" && <span className="text-xs">✅</span>}
                      {perf.impact === "neutral" && <span className="text-xs">➖</span>}
                      {perf.impact === "negative" && <span className="text-xs">⚠️</span>}
                    </div>
                    <p className="text-xs text-white/50">
                      {format(new Date(perf.date), "d MMMM yyyy", { locale: fr })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1.5 rounded-lg ${getScoreBgColor(perf.score)} flex items-center gap-1.5`}>
                      <span className={`text-sm font-bold ${getScoreColor(perf.score)}`}>
                        {perf.score}
                      </span>
                      <span className="text-xs text-white/40">/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {expandedId === perf.id && (
                <div className="ml-4 p-4 rounded-lg bg-white/[0.02] border border-white/[0.08] border-t-0 rounded-t-none animate-fade-in">
                  {perf.description && (
                    <p className="text-xs text-white/60 mb-3">{perf.description}</p>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(perf.id);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <AddFreePerformanceModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAdd={handleAdd}
      />
    </Card>
  );
};