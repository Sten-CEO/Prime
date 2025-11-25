import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddFreePerformanceModal } from "@/components/modals/AddFreePerformanceModal";
import { useFreePerformances } from "@/hooks/useFreePerformances";

interface CategoryPerformancesProps {
  categoryId: string;
  domainId: string;
}

export const CategoryPerformances = ({ categoryId, domainId }: CategoryPerformancesProps) => {
  const { freePerformances, isLoading, createFreePerformance, deleteFreePerformance } = useFreePerformances(categoryId);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = (performance: { 
    title: string; 
    date: string; 
    description?: string; 
    level: any; 
    impact: number; 
    impactType: any;
  }) => {
    createFreePerformance({
      name: performance.title,
      category_id: categoryId,
      domain_id: domainId,
    });
  };

  const handleDelete = (id: string) => {
    deleteFreePerformance(id);
  };

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Performances Libres</h3>
        <Button
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all text-white h-8 px-3"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {isLoading ? (
          <div className="py-8 text-center">
            <p className="text-white/40 text-sm">Chargement...</p>
          </div>
        ) : freePerformances.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-white/40 text-sm">Aucune performance libre</p>
            <p className="text-white/30 text-xs mt-1">Cliquez sur + pour en ajouter</p>
          </div>
        ) : (
          freePerformances.map((perf) => (
            <div
              key={perf.id}
              className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] transition-all group"
            >
              <p className="text-sm text-white/80 flex-1">{perf.name}</p>
              <button
                onClick={() => handleDelete(perf.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-red-500/20"
                title="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </button>
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
