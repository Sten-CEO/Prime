import { Switch } from "@/components/ui/switch";
import { Trash2, Pencil } from "lucide-react";
import { useMetricRecords } from "@/hooks/useMetricRecords";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState, useEffect } from "react";

interface MetricCardProps {
  metric: {
    id: string;
    name: string;
    icon: string | null;
    is_active: boolean;
    category_id: string | null;
    category_name?: string;
    domain_id: string;
    impact_weight: number | null;
    scheduled_days: string[] | null;
  };
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

const dayMap: Record<string, string> = {
  "LUNDI": "L",
  "MARDI": "M",
  "MERCREDI": "M",
  "JEUDI": "J",
  "VENDREDI": "V",
  "SAMEDI": "S",
  "DIMANCHE": "D"
};

const getCurrentDayName = (): string => {
  const days = ["DIMANCHE", "LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI"];
  return days[new Date().getDay()];
};

export const MetricCard = ({ metric, onEdit, onDelete, onToggleActive }: MetricCardProps) => {
  const { recordMetricCompletion, deleteMetricRecord, metricRecords, isLoading } = useMetricRecords(
    metric.domain_id,
    format(new Date(), "yyyy-MM-dd"),
    format(new Date(), "yyyy-MM-dd")
  );
  
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const today = format(new Date(), "yyyy-MM-dd");
  const currentDay = getCurrentDayName();
  
  // Check if today is in scheduled days
  const isScheduledToday = !metric.scheduled_days || 
    metric.scheduled_days.length === 0 || 
    metric.scheduled_days.includes(currentDay);
  
  const isRegular = metric.scheduled_days && metric.scheduled_days.length > 0;

  // Check if completed today
  useEffect(() => {
    const todayRecord = metricRecords.find(
      r => r.metric_id === metric.id && r.recorded_date === today
    );
    setIsCompletedToday(!!todayRecord);
  }, [metricRecords, metric.id, today]);

  const handleToggleComplete = () => {
    if (!isScheduledToday) return;
    
    const todayRecord = metricRecords.find(
      r => r.metric_id === metric.id && r.recorded_date === today
    );
    
    if (todayRecord) {
      // Delete the existing record (uncheck)
      deleteMetricRecord(todayRecord.id);
    } else {
      // Create new record (check)
      recordMetricCompletion({
        metric_id: metric.id,
        recorded_date: today,
        custom_impact: metric.impact_weight || undefined,
      });
    }
  };

  const displayedDays = metric.scheduled_days && metric.scheduled_days.length > 0
    ? metric.scheduled_days.map(day => dayMap[day]).join(" ")
    : "";

  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-lg border transition-all group ${
        isScheduledToday
          ? "bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04]"
          : "bg-white/[0.01] border-white/[0.04] opacity-50"
      }`}
    >
      <div className="flex-1 cursor-pointer" onClick={onEdit}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{metric.icon || "📊"}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm text-white/80 font-medium">{metric.name}</p>
              {isRegular && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.08] border border-white/[0.15] text-white/60">
                  Régulière
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {metric.category_name && (
                <span className="text-xs text-white/40">{metric.category_name}</span>
              )}
              <span className="text-xs text-white/40">•</span>
              <span className="text-xs text-white/40">
                impact {metric.impact_weight || 1}
              </span>
              {displayedDays && (
                <>
                  <span className="text-xs text-white/40">•</span>
                  <span className="text-xs text-white/30">{displayedDays}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Switch
          checked={isCompletedToday && isScheduledToday}
          onCheckedChange={handleToggleComplete}
          disabled={!isScheduledToday || isLoading}
          className="data-[state=checked]:bg-white/20"
        />
        <button
          onClick={onEdit}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/[0.05]"
        >
          <Pencil className="w-3.5 h-3.5 text-white/60" />
        </button>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/[0.05]"
        >
          <Trash2 className="w-3.5 h-3.5 text-white/60" />
        </button>
      </div>
    </div>
  );
};
