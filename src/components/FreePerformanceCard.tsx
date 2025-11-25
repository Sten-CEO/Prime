import { Trash2, Pencil } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface FreePerformanceCardProps {
  performance: {
    id: string;
    label: string;
    recorded_date: string;
    impact_value: number;
    category_name?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export const FreePerformanceCard = ({ performance, onEdit, onDelete }: FreePerformanceCardProps) => {
  const date = new Date(performance.recorded_date);
  const formattedDate = format(date, "d MMM yyyy", { locale: fr });

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] transition-all group">
      <div className="flex-1 cursor-pointer" onClick={onEdit}>
        <div className="flex items-center gap-2">
          <span className="text-lg">✨</span>
          <div className="flex-1">
            <p className="text-sm text-white/80 font-medium">{performance.label}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-white/40">{formattedDate}</span>
              <span className="text-xs text-white/40">•</span>
              <span className="text-xs text-white/40">
                {performance.impact_value} impact
              </span>
              {performance.category_name && (
                <>
                  <span className="text-xs text-white/40">•</span>
                  <span className="text-xs text-white/40">{performance.category_name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
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
