import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, BarChart3, X } from "lucide-react";
import { useState } from "react";

interface Metric {
  id: string;
  name: string;
  enabled: boolean;
  specificDays: boolean;
  days: boolean[];
}

export const CategoryMetrics = () => {
  const [metrics, setMetrics] = useState<Metric[]>([
    { id: "m1", name: "Hydratation", enabled: true, specificDays: true, days: [true, true, true, true, true, true, true] },
    { id: "m2", name: "10k pas", enabled: true, specificDays: true, days: [true, true, true, true, true, false, false] },
    { id: "m3", name: "Lecture 20min", enabled: false, specificDays: false, days: [true, true, true, true, true, true, true] },
  ]);
  const [selectedMetricStats, setSelectedMetricStats] = useState<string | null>(null);

  const toggleMetric = (id: string) => {
    setMetrics(prev =>
      prev.map(m => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const toggleSpecificDays = (id: string) => {
    setMetrics(prev =>
      prev.map(m => (m.id === id ? { ...m, specificDays: !m.specificDays } : m))
    );
  };

  const toggleDay = (id: string, dayIndex: number) => {
    setMetrics(prev =>
      prev.map(m => {
        if (m.id === id) {
          const newDays = [...m.days];
          newDays[dayIndex] = !newDays[dayIndex];
          return { ...m, days: newDays };
        }
        return m;
      })
    );
  };

  const dayLabels = ["L", "M", "M", "J", "V", "S", "D"];

  return (
    <>
      <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Métriques Programmées</h3>
          <Button
            size="sm"
            className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all text-white h-8 px-3"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="space-y-2">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] transition-all">
                <div className="flex-1">
                  <p className="text-white text-sm font-medium mb-2">{metric.name}</p>
                  <button
                    onClick={() => toggleSpecificDays(metric.id)}
                    className="text-xs text-white/50 hover:text-white/70 transition-colors"
                  >
                    {metric.specificDays ? "Jours actifs ▼" : "Activer jours spécifiques"}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedMetricStats(metric.id)}
                    className="text-white/60 hover:text-white transition-colors p-1"
                    title="Voir les statistiques"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <Switch
                    checked={metric.enabled}
                    onCheckedChange={() => toggleMetric(metric.id)}
                    className="ml-2"
                  />
                </div>
              </div>

              {metric.specificDays && (
                <div className="ml-4 flex gap-2 animate-fade-in">
                  {dayLabels.map((day, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleDay(metric.id, idx)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                        metric.days[idx]
                          ? "bg-white/[0.15] border border-white/[0.3] text-white"
                          : "bg-white/[0.03] border border-white/[0.08] text-white/40 hover:bg-white/[0.05]"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Panneau latéral statistiques */}
      {selectedMetricStats && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" onClick={() => setSelectedMetricStats(null)}>
          <div
            className="fixed right-0 top-0 bottom-0 w-[500px] backdrop-blur-3xl bg-white/[0.02] border-l border-white/[0.18] p-8 animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Statistiques - {metrics.find(m => m.id === selectedMetricStats)?.name}
              </h3>
              <button
                onClick={() => setSelectedMetricStats(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.08] transition-all"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                <p className="text-white/60 text-xs mb-1">Historique 7 jours</p>
                <p className="text-white text-2xl font-bold">5/7 jours</p>
                <p className="text-success text-sm mt-1">71% complété</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                <p className="text-white/60 text-xs mb-1">Historique 30 jours</p>
                <p className="text-white text-2xl font-bold">24/30 jours</p>
                <p className="text-success text-sm mt-1">80% complété</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                <p className="text-white/60 text-xs mb-1">Variation</p>
                <p className="text-success text-lg font-semibold">+12%</p>
                <p className="text-white/60 text-xs mt-1">vs période précédente</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
