import { Card } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { AddFreePerformanceModal } from "@/components/modals/AddFreePerformanceModal";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type PerformanceLevel = "simple" | "advanced" | "exceptional";

interface Performance {
  id: string;
  title: string;
  date: string;
  description?: string;
  level: PerformanceLevel;
  impact: number;
  impactType: "positive" | "neutral" | "negative";
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
    level: PerformanceLevel;
    impact: number;
    impactType: "positive" | "neutral" | "negative";
  }) => {
    const newPerf: Performance = {
      id: `fp${Date.now()}`,
      title: performance.title,
      date: performance.date,
      description: performance.description,
      level: performance.level,
      impact: performance.impact,
      impactType: performance.impactType,
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

  const getImpactColor = (impact: number) => {
    if (impact >= 3) return "text-success";
    if (impact >= 2) return "text-yellow-500";
    return "text-white/70";
  };

  const getImpactBgColor = (impact: number) => {
    if (impact >= 3) return "bg-success/20";
    if (impact >= 2) return "bg-yellow-500/20";
    return "bg-white/10";
  };

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-5 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white">Performances Libres</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all text-white/70 hover:text-white text-[10px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter</span>
        </button>
      </div>
      
      <div className="space-y-2.5">
        {performances.length === 0 ? (
          <p className="text-white/40 text-[10px] text-center py-6">Aucune performance libre enregistrée</p>
        ) : (
          performances.map((perf) => (
            <div key={perf.id} className="space-y-0">
              <div
                onClick={() => setExpandedId(expandedId === perf.id ? null : perf.id)}
                className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-xs text-white/90 font-medium truncate">{perf.title}</p>
                      {perf.impactType === "positive" && <span className="text-[10px]">✅</span>}
                      {perf.impactType === "neutral" && <span className="text-[10px]">➖</span>}
                      {perf.impactType === "negative" && <span className="text-[10px]">⚠️</span>}
                    </div>
                    <p className="text-[10px] text-white/50">
                      {format(new Date(perf.date), "d MMM yyyy", { locale: fr })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`px-2.5 py-1 rounded-lg ${getImpactBgColor(perf.impact)} flex items-center gap-1`}>
                      <span className={`text-xs font-bold ${getImpactColor(perf.impact)}`}>
                        {perf.impact}
                      </span>
                      <span className="text-[10px] text-white/40">impact</span>
                    </div>
                  </div>
                </div>
              </div>

              {expandedId === perf.id && (
                <div className="ml-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] border-t-0 rounded-t-none animate-fade-in">
                  {perf.description && (
                    <p className="text-[10px] text-white/60 mb-2.5">{perf.description}</p>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(perf.id);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
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