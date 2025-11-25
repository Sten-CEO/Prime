import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddFreePerformanceModal } from "@/components/modals/AddFreePerformanceModal";
import { useFreePerformanceRecords } from "@/hooks/useFreePerformanceRecords";
import { FreePerformanceCard } from "@/components/FreePerformanceCard";

interface CategoryPerformancesProps {
  categoryId: string;
  domainId: string;
}

export const CategoryPerformances = ({ categoryId, domainId }: CategoryPerformancesProps) => {
  const { freePerformanceRecords, isLoading, deleteFreePerformanceRecord } = useFreePerformanceRecords(domainId, categoryId);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPerformance, setEditingPerformance] = useState<any>(null);

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
        ) : freePerformanceRecords.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-white/40 text-sm">Aucune performance libre</p>
            <p className="text-white/30 text-xs mt-1">Cliquez sur + pour en ajouter</p>
          </div>
        ) : (
          freePerformanceRecords.map((perf) => (
            <FreePerformanceCard
              key={perf.id}
              performance={perf}
              onEdit={() => setEditingPerformance(perf)}
              onDelete={() => deleteFreePerformanceRecord(perf.id)}
            />
          ))
        )}
      </div>

      <AddFreePerformanceModal
        open={showAddModal || !!editingPerformance}
        onOpenChange={(open) => {
          setShowAddModal(open);
          if (!open) setEditingPerformance(null);
        }}
        onAdd={() => {}}
        domainId={domainId}
        categories={[{ id: categoryId, name: "" }]}
        editPerformance={editingPerformance}
      />
    </Card>
  );
};
