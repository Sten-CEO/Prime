import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type PerformanceLevel = "simple" | "advanced" | "exceptional";

interface AddPerformanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (performance: { name: string; icon: string; level: PerformanceLevel; impact: number; date: string }) => void;
}

const iconOptions = ["🎯", "⚡", "💪", "🧠", "❤️", "🔥", "✨", "🚀", "📈", "🎨"];

export const AddPerformanceModal = ({ open, onOpenChange, onAdd }: AddPerformanceModalProps) => {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("🎯");
  const [performanceLevel, setPerformanceLevel] = useState<PerformanceLevel>("advanced");
  const [showManualImpact, setShowManualImpact] = useState(false);
  const [manualImpact, setManualImpact] = useState<number | null>(null);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const getLevelImpact = (level: PerformanceLevel): number => {
    switch (level) {
      case "simple":
        return 1;
      case "advanced":
        return 2;
      case "exceptional":
        return 3;
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
    }
  };

  const getFinalImpact = (): number => {
    if (manualImpact !== null) return manualImpact;
    return getLevelImpact(performanceLevel);
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({ 
      name, 
      icon: selectedIcon, 
      level: performanceLevel,
      impact: getFinalImpact(),
      date 
    });
    setName("");
    setSelectedIcon("🎯");
    setPerformanceLevel("advanced");
    setShowManualImpact(false);
    setManualImpact(null);
    setDate(format(new Date(), "yyyy-MM-dd"));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-3xl bg-black/95 border border-white/[0.18] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Ajouter une Performance Libre</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-white/80 text-sm">Titre</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Créativité"
              className="bg-white/[0.05] border-white/[0.12] text-white mt-1"
            />
          </div>

          <div>
            <Label className="text-white/80 text-sm mb-2 block">Icône</Label>
            <div className="flex gap-2 flex-wrap">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
                    selectedIcon === icon
                      ? "bg-white/[0.15] border-2 border-white/[0.3] shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                      : "bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08]"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-white/80 text-sm">Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white/[0.05] border-white/[0.12] text-white mt-1"
            />
          </div>

          <div>
            <Label className="text-white/80 text-sm mb-2 block">Niveau de performance</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setPerformanceLevel("simple");
                  setManualImpact(null);
                }}
                className={cn(
                  "px-3 py-2 rounded text-xs font-medium transition-all",
                  performanceLevel === "simple"
                    ? "bg-white/[0.15] border-2 border-white/[0.3] text-white"
                    : "bg-white/[0.05] border border-white/[0.1] text-white/60 hover:bg-white/[0.08]"
                )}
              >
                Simple
              </button>
              <button
                type="button"
                onClick={() => {
                  setPerformanceLevel("advanced");
                  setManualImpact(null);
                }}
                className={cn(
                  "px-3 py-2 rounded text-xs font-medium transition-all",
                  performanceLevel === "advanced"
                    ? "bg-white/[0.15] border-2 border-white/[0.3] text-white"
                    : "bg-white/[0.05] border border-white/[0.1] text-white/60 hover:bg-white/[0.08]"
                )}
              >
                Avancée
              </button>
              <button
                type="button"
                onClick={() => {
                  setPerformanceLevel("exceptional");
                  setManualImpact(null);
                }}
                className={cn(
                  "px-3 py-2 rounded text-xs font-medium transition-all",
                  performanceLevel === "exceptional"
                    ? "bg-white/[0.15] border-2 border-white/[0.3] text-white"
                    : "bg-white/[0.05] border border-white/[0.1] text-white/60 hover:bg-white/[0.08]"
                )}
              >
                Exceptionnelle
              </button>
            </div>
            <p className="text-xs text-white/70 mt-2">
              {getLevelLabel(performanceLevel)}
              {manualImpact !== null && ` (impact: ${manualImpact})`}
            </p>
          </div>

          <div>
            {!showManualImpact ? (
              <button
                type="button"
                onClick={() => setShowManualImpact(true)}
                className="text-xs text-white/50 hover:text-white/80 underline transition-colors"
              >
                Définir un impact personnalisé
              </button>
            ) : (
              <div className="space-y-2">
                <Label className="text-white/80 text-sm">Impact personnalisé</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={manualImpact ?? getLevelImpact(performanceLevel)}
                  onChange={(e) => setManualImpact(parseFloat(e.target.value) || 0)}
                  className="bg-white/[0.05] border-white/[0.12] text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowManualImpact(false);
                    setManualImpact(null);
                  }}
                  className="text-xs text-white/50 hover:text-white/80 underline transition-colors"
                >
                  Utiliser le niveau prédéfini
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 bg-white/[0.05] border-white/[0.12] text-white hover:bg-white/[0.08]"
            >
              Annuler
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!name.trim()}
              className="flex-1 bg-white/[0.15] border border-white/[0.2] text-white hover:bg-white/[0.2]"
            >
              Ajouter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};