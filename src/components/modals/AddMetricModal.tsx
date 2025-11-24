import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface AddMetricModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (metric: { name: string; icon: string; days: string[] }) => void;
}

const iconOptions = ["💧", "🏃", "📚", "🧘", "🥗", "😴", "☕", "🎵", "🌞", "🌙"];
const allDays = ["L", "M", "M", "J", "V", "S", "D"];

export const AddMetricModal = ({ open, onOpenChange, onAdd }: AddMetricModalProps) => {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("💧");
  const [selectedDays, setSelectedDays] = useState<string[]>(["L", "M", "M", "J", "V"]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleAdd = () => {
    if (!name.trim() || selectedDays.length === 0) return;
    onAdd({ name, icon: selectedIcon, days: selectedDays });
    setName("");
    setSelectedIcon("💧");
    setSelectedDays(["L", "M", "M", "J", "V"]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-3xl bg-black/95 border border-white/[0.18] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Ajouter une Métrique</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-white/80 text-sm">Titre</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Hydratation"
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
            <Label className="text-white/80 text-sm mb-2 block">Jours actifs</Label>
            <div className="flex gap-2">
              {allDays.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    selectedDays.includes(day)
                      ? "bg-white/[0.15] border border-white/[0.3] text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                      : "bg-white/[0.05] border border-white/[0.12] text-white/50 hover:bg-white/[0.08]"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <p className="text-xs text-white/50 mt-2">
              {selectedDays.length} jour(s) sélectionné(s)
            </p>
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
              disabled={!name.trim() || selectedDays.length === 0}
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
