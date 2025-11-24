import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddMetricModal } from "@/components/modals/AddMetricModal";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type PerformanceLevel = "simple" | "advanced" | "exceptional" | null;

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
  const [performanceLevel, setPerformanceLevel] = useState<PerformanceLevel>(null);
  const [showManualAdjust, setShowManualAdjust] = useState(false);
  const [manualImpact, setManualImpact] = useState<number | null>(null);
  const { toast } = useToast();

  const recordingMetric = metrics.find((m) => m.id === recordingMetricId);

  const toggleMetric = (id: string) => {
    setMetrics(prev =>
      prev.map(m => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const getLevelImpact = (level: PerformanceLevel): number => {
    switch (level) {
      case "simple":
        return 1;
      case "advanced":
        return 2;
      case "exceptional":
        return 3;
      default:
        return 0;
    }
  };

  const getLevelLabel = (level: PerformanceLevel): string => {
    switch (level) {
      case "simple":
        return "Impact léger";
      case "advanced":
        return "Impact important";
      case "exceptional":
        return "Impact exceptionnel";
      default:
        return "";
    }
  };

  const getFinalImpact = (): number => {
    if (manualImpact !== null) return manualImpact;
    return getLevelImpact(performanceLevel);
  };

  const isActiveDayToday = (metricDays: string[]): boolean => {
    const dayMap: { [key: number]: string } = {
      1: "L",
      2: "M",
      3: "M",
      4: "J",
      5: "V",
      6: "S",
      0: "D"
    };
    const today = new Date().getDay();
    return metricDays.includes(dayMap[today]);
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

  const handleDelete = (id: string, name: string) => {
    setMetrics(prev => prev.filter(m => m.id !== id));
    if (expandedId === id) {
      setExpandedId(null);
      setRecordingMetricId(null);
    }
    toast({
      title: "Métrique supprimée",
      description: `${name} a été supprimée avec succès.`,
    });
  };

  const handleRecordPerformance = () => {
    if (!recordingMetric || !performanceLevel) return;
    
    const finalImpact = getFinalImpact();
    
    toast({
      title: "Performance enregistrée",
      description: `${recordingMetric.name}: impact ${finalImpact} le ${format(recordDate, "d MMMM yyyy", { locale: fr })}`,
    });
    
    // Reset
    setRecordingMetricId(null);
    setExpandedId(null);
    setRecordDate(new Date());
    setPerformanceLevel(null);
    setShowManualAdjust(false);
    setManualImpact(null);
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 3) return "text-success";
    if (impact >= 2) return "text-yellow-500";
    return "text-white/70";
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
                    {metric.enabled && expandedId === metric.id ? (
                      <ChevronUp className="w-3 h-3 text-white/40" />
                    ) : metric.enabled ? (
                      <ChevronDown className="w-3 h-3 text-white/40" />
                    ) : null}
                    <p className="text-white text-xs font-medium">{metric.name}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    {metric.days.map((day) => (
                      <span
                        key={day}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.1] text-white/60"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(metric.id, metric.name);
                    }}
                    className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-red-500/20 border border-white/[0.08] hover:border-red-500/30 transition-all group"
                    title="Supprimer la métrique"
                  >
                    <Trash2 className="w-3 h-3 text-white/40 group-hover:text-red-400 transition-colors" />
                  </button>
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
                    className="scale-90"
                  />
                </div>
              </div>
            </div>

            {expandedId === metric.id && recordingMetricId === metric.id && (
              <div
                className="ml-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] border-t-0 rounded-t-none animate-fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="text-xs text-white/80 font-medium mb-3">Enregistrer une performance</h4>

                <div className="space-y-3">
                  {/* Date Selector */}
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
                    {!isActiveDayToday(metric.days) && (
                      <p className="text-[9px] text-white/40 mt-1">Jour non programmé pour cette métrique</p>
                    )}
                  </div>

                  {/* Performance Level Selector */}
                  <div>
                    <label className="text-[10px] text-white/60 mb-1.5 block">Niveau de performance</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          setPerformanceLevel("simple");
                          setManualImpact(null);
                        }}
                        className={cn(
                          "px-2 py-1.5 rounded text-[9px] font-medium transition-all",
                          performanceLevel === "simple"
                            ? "bg-white/[0.15] border-2 border-white/[0.3] text-white"
                            : "bg-white/[0.05] border border-white/[0.1] text-white/60 hover:bg-white/[0.08]"
                        )}
                      >
                        Simple
                      </button>
                      <button
                        onClick={() => {
                          setPerformanceLevel("advanced");
                          setManualImpact(null);
                        }}
                        className={cn(
                          "px-2 py-1.5 rounded text-[9px] font-medium transition-all",
                          performanceLevel === "advanced"
                            ? "bg-white/[0.15] border-2 border-white/[0.3] text-white"
                            : "bg-white/[0.05] border border-white/[0.1] text-white/60 hover:bg-white/[0.08]"
                        )}
                      >
                        Avancée
                      </button>
                      <button
                        onClick={() => {
                          setPerformanceLevel("exceptional");
                          setManualImpact(null);
                        }}
                        className={cn(
                          "px-2 py-1.5 rounded text-[9px] font-medium transition-all",
                          performanceLevel === "exceptional"
                            ? "bg-white/[0.15] border-2 border-white/[0.3] text-white"
                            : "bg-white/[0.05] border border-white/[0.1] text-white/60 hover:bg-white/[0.08]"
                        )}
                      >
                        Exceptionnelle
                      </button>
                    </div>
                    {performanceLevel && (
                      <p className="text-[9px] text-white/70 mt-2">
                        <span className={`font-bold ${getImpactColor(getFinalImpact())}`}>
                          {getLevelLabel(performanceLevel)}
                        </span>
                        {manualImpact !== null && ` (impact: ${manualImpact})`}
                      </p>
                    )}
                  </div>

                  {/* Manual Adjustment (Optional) */}
                  <div>
                    {!showManualAdjust ? (
                      <button
                        onClick={() => setShowManualAdjust(true)}
                        className="text-[9px] text-white/50 hover:text-white/80 underline transition-colors"
                      >
                        Définir un impact personnalisé
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/60 block">Impact personnalisé</label>
                        <div className="flex items-center gap-2.5">
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            value={manualImpact ?? getLevelImpact(performanceLevel)}
                            onChange={(e) => setManualImpact(parseFloat(e.target.value) || 0)}
                            className="flex-1 bg-white/[0.05] border-white/[0.12] text-white h-7 text-xs"
                          />
                          <span className={`text-xs font-bold ${getImpactColor(manualImpact ?? getLevelImpact(performanceLevel))}`}>
                            impact
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setShowManualAdjust(false);
                            setManualImpact(null);
                          }}
                          className="text-[9px] text-white/50 hover:text-white/80 underline transition-colors"
                        >
                          Utiliser le niveau prédéfini
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Record Button */}
                  <Button
                    onClick={handleRecordPerformance}
                    disabled={!performanceLevel}
                    className="w-full bg-white/[0.15] border border-white/[0.2] text-white hover:bg-white/[0.2] h-8 text-[10px] disabled:opacity-40 disabled:cursor-not-allowed"
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
