import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddMetricModal } from "@/components/modals/AddMetricModal";
import { RecordMetricModal } from "@/components/modals/RecordMetricModal";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

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
    { id: "m1", name: "💧 Hydratation", enabled: true, days: ["L", "M", "M", "J", "V", "S", "D"] },
    { id: "m2", name: "👟 10k pas", enabled: true, days: ["L", "M", "M", "J", "V"] },
    { id: "m3", name: "📖 Lecture 20min", enabled: false, days: ["L", "M", "J", "V"] },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [recordingMetricId, setRecordingMetricId] = useState<string | null>(null);
  const [recordDate, setRecordDate] = useState<Date>(new Date());
  const [recordScore, setRecordScore] = useState(50);
  const { toast } = useToast();

  const recordingMetric = metrics.find((m) => m.id === recordingMetricId);

  const toggleMetric = (id: string) => {
    setMetrics(prev =>
      prev.map(m => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const toggleDay = (id: string, day: string) => {
    setMetrics(prev =>
      prev.map(m => {
        if (m.id === id) {
          const newDays = m.days.includes(day)
            ? m.days.filter(d => d !== day)
            : [...m.days, day];
          return { ...m, days: newDays };
        }
        return m;
      })
    );
  };

  const handleAdd = (metric: { name: string; icon: string; days: string[] }) => {
    const newMetric = {
      id: `m${metrics.length + 1}`,
      name: `${metric.icon} ${metric.name}`,
      enabled: true,
      days: metric.days,
    };
    setMetrics([...metrics, newMetric]);
    toast({ title: "Métrique ajoutée", description: `${metric.name} a été ajoutée avec succès.` });
  };

  const handleRecordPerformance = () => {
    if (!recordingMetric) return;
    
    toast({
      title: "Performance enregistrée",
      description: `${recordingMetric.name}: ${recordScore}/100 le ${format(recordDate, "d MMMM yyyy", { locale: fr })}`,
    });
    
    // Reset
    setRecordingMetricId(null);
    setExpandedId(null);
    setRecordDate(new Date());
    setRecordScore(50);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-5 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white">Métriques</h3>
        <Button
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all text-white h-7 px-2.5"
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="space-y-2.5">
        {metrics.map((metric) => (
          <div key={metric.id} className="space-y-0">
            <div
              onClick={() => {
                if (metric.enabled) {
                  if (expandedId === metric.id) {
                    setExpandedId(null);
                    setRecordingMetricId(null);
                  } else {
                    setExpandedId(metric.id);
                    setRecordingMetricId(metric.id);
                  }
                }
              }}
              className={`p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] transition-all ${
                metric.enabled ? "hover:bg-white/[0.04] cursor-pointer" : "opacity-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-xs font-medium">{metric.name}</p>
                    {metric.enabled && expandedId === metric.id ? (
                      <ChevronUp className="w-3 h-3 text-white/40" />
                    ) : metric.enabled ? (
                      <ChevronDown className="w-3 h-3 text-white/40" />
                    ) : null}
                  </div>
                </div>
                <Switch
                  checked={metric.enabled}
                  onCheckedChange={(checked) => {
                    toggleMetric(metric.id);
                    if (!checked) {
                      setExpandedId(null);
                      setRecordingMetricId(null);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="ml-3 scale-90"
                />
              </div>
            </div>

            {expandedId === metric.id && recordingMetricId === metric.id && (
              <div
                className="ml-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] border-t-0 rounded-t-none animate-fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="text-xs text-white/80 font-medium mb-2">Noter la performance</h4>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[10px] text-white/60 mb-1 block">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white/[0.05] border-white/[0.12] text-white hover:bg-white/[0.08] h-8 text-[10px]",
                            !recordDate && "text-white/60"
                          )}
                        >
                          <CalendarIcon className="mr-1.5 h-2.5 w-2.5" />
                          {recordDate ? format(recordDate, "d MMM yyyy", { locale: fr }) : <span>Date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-black/95 backdrop-blur-xl border-white/[0.12]" align="start">
                        <Calendar
                          mode="single"
                          selected={recordDate}
                          onSelect={(date) => date && setRecordDate(date)}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-[10px] text-white/60 mb-1.5 block">Note (0-100)</label>
                    <div className="flex items-center gap-2.5">
                      <Slider
                        value={[recordScore]}
                        onValueChange={(value) => setRecordScore(value[0])}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className={`text-xs font-bold w-8 text-right ${getScoreColor(recordScore)}`}>
                        {recordScore}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          recordScore >= 80 ? "bg-success" : recordScore >= 50 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${recordScore}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleRecordPerformance}
                    className="w-full bg-white/[0.15] border border-white/[0.2] text-white hover:bg-white/[0.2] h-8 text-[10px]"
                  >
                    Enregistrer la performance
                  </Button>
                </div>
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
    </Card>
  );
};
