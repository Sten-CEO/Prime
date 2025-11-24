import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Search } from "lucide-react";

interface AddPerformanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (performance: { name: string; icon: string; score: number }) => void;
}

const iconOptions = ["🎯", "⚡", "💪", "🧠", "❤️", "🔥", "✨", "🚀", "📈", "🎨"];

export const AddPerformanceModal = ({ open, onOpenChange, onAdd }: AddPerformanceModalProps) => {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("🎯");
  const [score, setScore] = useState(50);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({ name, icon: selectedIcon, score });
    setName("");
    setSelectedIcon("🎯");
    setScore(50);
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
            <Label className="text-white/80 text-sm">Note initiale (facultative)</Label>
            <div className="flex items-center gap-4 mt-2">
              <Slider
                value={[score]}
                onValueChange={(value) => setScore(value[0])}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-white font-medium w-12 text-right">{score}</span>
            </div>
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
