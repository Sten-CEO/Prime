import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { useState } from "react";

interface Metric {
  id: string;
  name: string;
  enabled: boolean;
  days: string[];
}

interface DomainMetricsProps {
  domainName: string;
}

export const DomainMetrics = ({ domainName }: DomainMetricsProps) => {
  const [metrics, setMetrics] = useState<Metric[]>([
    { id: "m1", name: "Hydratation", enabled: true, days: ["L", "M", "M", "J", "V", "S", "D"] },
    { id: "m2", name: "10k pas", enabled: true, days: ["L", "M", "M", "J", "V"] },
    { id: "m3", name: "Lecture 20min", enabled: false, days: ["L", "M", "J", "V"] },
  ]);

  const toggleMetric = (id: string) => {
    setMetrics(prev =>
      prev.map(m => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Métriques</h3>
        <Button
          size="sm"
          className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all text-white h-8 px-3"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] transition-all"
          >
            <div className="flex-1">
              <p className="text-white text-sm font-medium mb-2">{metric.name}</p>
              <div className="flex gap-1">
                {metric.days.map((day, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-1 rounded ${
                      metric.enabled
                        ? "bg-white/[0.1] text-white/80"
                        : "bg-white/[0.03] text-white/40"
                    }`}
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
            <Switch
              checked={metric.enabled}
              onCheckedChange={() => toggleMetric(metric.id)}
              className="ml-4"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};
