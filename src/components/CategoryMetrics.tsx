import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3, PenSquare } from "lucide-react";
import { useState } from "react";
import { AddMetricModal } from "@/components/modals/AddMetricModal";
import { MetricStatsPanel } from "@/components/modals/MetricStatsPanel";
import { RecordMetricModal } from "@/components/modals/RecordMetricModal";
import { useMetrics } from "@/hooks/useMetrics";

interface CategoryMetricsProps {
  categoryId: string;
  domainId: string;
}

const allDays = ["L", "M", "M", "J", "V", "S", "D"];

export const CategoryMetrics = ({ categoryId, domainId }: CategoryMetricsProps) => {
  const { metrics, isLoading, createMetric, updateMetric } = useMetrics(categoryId);
  const [showAddModal, setShowAddModal] = useState(false);
  const [statsMetric, setStatsMetric] = useState<any>(null);
  const [recordingMetric, setRecordingMetric] = useState<any>(null);

  const toggleMetric = (id: string) => {
    const metric = metrics.find(m => m.id === id);
    if (metric) {
      updateMetric({ id, is_active: !metric.is_active });
    }
  };

  const handleAdd = (metric: { name: string; icon: string; days: string[] }) => {
    createMetric({
      name: `${metric.icon} ${metric.name}`,
      icon: metric.icon,
      category_id: categoryId,
      domain_id: domainId,
    });
  };

  const handleRecord = (data: { date: string; level: string; impact: number; note?: string }) => {
    // Record logic will be implemented later
  };

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
      
      <div className="space-y-4">
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
          <div key={metric.id} className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] transition-all group">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm text-white/80">{metric.name}</p>
                  <button
                    onClick={() => setRecordingMetric(metric)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/[0.05]"
                    title="Noter aujourd'hui"
                  >
                    <PenSquare className="w-3.5 h-3.5 text-white/60" />
                  </button>
                  <button
                    onClick={() => setStatsMetric(metric)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/[0.05]"
                    title="Voir les statistiques"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-white/60" />
                  </button>
                </div>
              </div>
              <Switch
                checked={metric.is_active}
                onCheckedChange={() => toggleMetric(metric.id)}
              />
            </div>
          </div>
          ))
        )}
      </div>

      <AddMetricModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAdd={handleAdd}
      />

      {statsMetric && (
        <MetricStatsPanel
          open={!!statsMetric}
          onOpenChange={() => setStatsMetric(null)}
          metricName={statsMetric.name}
        />
      )}

      {recordingMetric && (
        <RecordMetricModal
          open={!!recordingMetric}
          onOpenChange={() => setRecordingMetric(null)}
          metricName={recordingMetric.name}
          onRecord={handleRecord}
        />
      )}
    </Card>
  );
};