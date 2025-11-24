import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, color: string) => void;
  editingCategory?: { id: string; name: string; color?: string } | null;
}

const accentColors = [
  { name: "Blanc", value: "rgba(255,255,255,0.15)" },
  { name: "Cyan", value: "rgba(34,211,238,0.15)" },
  { name: "Violet", value: "rgba(168,85,247,0.15)" },
  { name: "Rose", value: "rgba(236,72,153,0.15)" },
  { name: "Vert", value: "rgba(34,197,94,0.15)" },
  { name: "Orange", value: "rgba(251,146,60,0.15)" },
];

export const AddCategoryModal = ({ open, onOpenChange, onSave, editingCategory }: AddCategoryModalProps) => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(accentColors[0].value);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setSelectedColor(editingCategory.color || accentColors[0].value);
    } else {
      setName("");
      setSelectedColor(accentColors[0].value);
    }
  }, [editingCategory, open]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name, selectedColor);
    setName("");
    setSelectedColor(accentColors[0].value);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-3xl bg-black/95 border border-white/[0.18] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {editingCategory ? "Renommer la catégorie" : "Nouvelle catégorie"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-white/80 text-sm">Nom de la catégorie</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Stratégie"
              className="bg-white/[0.05] border-white/[0.12] text-white mt-1"
              autoFocus
            />
          </div>

          <div>
            <Label className="text-white/80 text-sm mb-2 block">Couleur d'accent</Label>
            <div className="flex gap-2 flex-wrap">
              {accentColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-12 h-12 rounded-lg transition-all ${
                    selectedColor === color.value
                      ? "border-2 border-white/[0.5] shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-110"
                      : "border border-white/[0.12] hover:border-white/[0.25] hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
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
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex-1 bg-white/[0.15] border border-white/[0.2] text-white hover:bg-white/[0.2]"
            >
              {editingCategory ? "Enregistrer" : "Créer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
