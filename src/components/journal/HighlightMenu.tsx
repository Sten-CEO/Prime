import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";

interface HighlightMenuProps {
  position: { x: number; y: number };
  selectedText: string;
  onSave: (text: string, domain: string) => void;
  onCancel: () => void;
  defaultDomain?: string;
}

const domains = [
  { id: "general", label: "Général", icon: "📝" },
  { id: "business", label: "Business", icon: "💼" },
  { id: "sport", label: "Sport", icon: "🥊" },
  { id: "social", label: "Social", icon: "👥" },
  { id: "sante", label: "Santé", icon: "❤️" },
  { id: "developpement", label: "Développement", icon: "📚" },
  { id: "finance", label: "Finance", icon: "💰" },
];

export const HighlightMenu = ({ position, selectedText, onSave, onCancel, defaultDomain }: HighlightMenuProps) => {
  const [domain, setDomain] = useState(defaultDomain || "general");

  const handleSave = () => {
    onSave(selectedText, domain);
    onCancel();
  };

  return (
    <div
      className="fixed z-50 backdrop-blur-2xl bg-black/80 border border-white/[0.15] rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] p-4 animate-scale-in"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -120%)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>Ajouter à Insights</span>
        </div>

        <div className="text-xs text-white/60 max-w-[250px] line-clamp-2">
          "{selectedText}"
        </div>

        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Domaine</label>
          <Select value={domain} onValueChange={setDomain}>
            <SelectTrigger className="bg-white/[0.05] border-white/[0.1] text-white h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/95 backdrop-blur-xl border-white/[0.1]">
              {domains.map((d) => (
                <SelectItem key={d.id} value={d.id} className="text-white text-sm">
                  <span className="flex items-center gap-2">
                    <span>{d.icon}</span>
                    <span>{d.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-white/70 bg-white/[0.02] border border-white/[0.08] rounded-lg hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-3 py-1.5 text-xs font-semibold text-white bg-white/[0.12] border border-white/[0.15] rounded-lg hover:bg-white/[0.15] hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};
