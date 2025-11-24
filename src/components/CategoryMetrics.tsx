import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3, PenSquare } from "lucide-react";
import { useState } from "react";
import { AddMetricModal } from "@/components/modals/AddMetricModal";
import { MetricStatsPanel } from "@/components/modals/MetricStatsPanel";
import { RecordMetricModal } from "@/components/modals/RecordMetricModal";
import { useToast } from "@/hooks/use-toast";

interface Metric {
  id: string;
  name: string;
  enabled: boolean;
  days: string[];
}

interface CategoryMetricsProps {
  metrics: Metric[];
}

const allDays = ["L", "M", "M", "J", "V", "S", "D"];

export const CategoryMetrics = ({ metrics: initialMetrics }: CategoryMetricsProps) => {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [statsMetric, setStatsMetric] = useState<Metric | null>(null);
  const [recordingMetric, setRecordingMetric] = useState<Metric | null>(null);
  const { toast } = useToast();

  const toggleMetric = (id: string) => {
    setMetrics(metrics.map(m => 
      m.id === id ? { ...m, enabled: !m.enabled } : m
    ));
  };

  const toggleDay = (id: string, day: string) => {
    setMetrics(metrics.map(m => {
      if (m.id === id) {
        const newDays = m.days.includes(day)
          ? m.days.filter(d => d !== day)
          : [...m.days, day];
        return { ...m, days: newDays };
      }
      return m;
    }));
  };

  const handleAdd = (metric: { name: string; icon: string; days: string[] }) => {
    const newMetric = {
      id: `${metrics.length + 1}`,
      name: `${metric.icon} ${metric.name}`,
      enabled: true,
      days: metric.days
    };
    setMetrics([...metrics, newMetric]);
    toast({ title: "Métrique ajoutée", description: `${metric.name} a été ajoutée avec succès.` });
  };

  const handleRecord = (data: { date: string; level: string; impact: number; note?: string }) => {
    toast({ 
      title: "Impact enregistré", 
      description: `Impact de ${data.impact} enregistré pour le ${data.date}.` 
    });
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
        {metrics.map((metric) => (
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
                <button
                  onClick={() => setEditingId(editingId === metric.id ? null : metric.id)}
                  className="text-xs text-white/50 hover:text-white/70 transition-colors"
                >
                  {editingId === metric.id ? "Masquer jours ▲" : "Jours spécifiques ▼"}
                </button>
              </div>
              <Switch
                checked={metric.enabled}
                onCheckedChange={() => toggleMetric(metric.id)}
              />
            </div>

            {editingId === metric.id && (
              <div className="ml-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] animate-fade-in">
                <div className="flex gap-2 flex-wrap">
                  {allDays.map((day, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleDay(metric.id, day)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                        metric.days.includes(day)
                          ? "bg-white/[0.15] border border-white/[0.3] text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                          : "bg-white/[0.05] border border-white/[0.12] text-white/50 hover:bg-white/[0.08]"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-white/50 mt-2">
                  {metric.days.length} jour(s) sélectionné(s)
                </p>
              </div>
            )}
          </div>
        ))}
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