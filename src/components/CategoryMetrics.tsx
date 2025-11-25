import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddMetricModal } from "@/components/modals/AddMetricModal";
import { useMetrics } from "@/hooks/useMetrics";
import { MetricCard } from "@/components/MetricCard";

interface CategoryMetricsProps {
  categoryId: string;
  domainId: string;
}

export const CategoryMetrics = ({ categoryId, domainId }: CategoryMetricsProps) => {
  const { metrics, isLoading, updateMetric, deleteMetric } = useMetrics(categoryId);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMetric, setEditingMetric] = useState<any>(null);

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Métriques Programmées</h3>
        <Button
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all text-white h-8 px-3"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {isLoading ? (
          <div className="py-8 text-center">
            <p className="text-white/40 text-sm">Chargement...</p>
          </div>
        ) : metrics.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-white/40 text-sm">Aucune métrique pour cette catégorie</p>
            <p className="text-white/30 text-xs mt-1">Cliquez sur + pour en ajouter</p>
          </div>
        ) : (
          metrics.map((metric) => (
            <MetricCard
              key={metric.id}
              metric={{
                ...metric,
                domain_id: domainId,
              }}
              onEdit={() => setEditingMetric(metric)}
              onDelete={() => deleteMetric(metric.id)}
              onToggleActive={() => updateMetric({ id: metric.id, is_active: !metric.is_active })}
            />
          ))
        )}
      </div>

      <AddMetricModal
        open={showAddModal || !!editingMetric}
        onOpenChange={(open) => {
          setShowAddModal(open);
          if (!open) setEditingMetric(null);
        }}
        onAdd={() => {}}
        domainId={domainId}
        categories={[{ id: categoryId, name: "" }]}
        editMetric={editingMetric}
      />
    </Card>
  );
};