import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useFreePerformances } from "@/hooks/useFreePerformances";

interface AddFreePerformanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (performance: any) => void;
  domainId?: string;
  categories?: Array<{ id: string; name: string }>;
}

const iconOptions = ["🎯", "⚡", "💪", "🧠", "❤️", "🔥", "✨", "🚀", "📈", "🎨"];

export const AddFreePerformanceModal = ({ open, onOpenChange, onAdd, domainId, categories }: AddFreePerformanceModalProps) => {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("🎯");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  
  const { createFreePerformance } = useFreePerformances(selectedCategoryId || undefined);

  const handleAdd = () => {
    if (!name.trim()) return;
    
    const performanceData = {
      title: `${selectedIcon} ${name}`,
      date: new Date().toISOString(),
      level: "advanced",
      impact: 2,
      impactType: "positive",
    };
    
    // If domainId and categories are provided, use the hook to create
    if (domainId && categories && categories.length > 0) {
      if (!selectedCategoryId) return;
      
      createFreePerformance({
        name: `${selectedIcon} ${name}`,
        category_id: selectedCategoryId,
        domain_id: domainId,
      });
    } else {
      // Otherwise, use the callback (for category-level components)
      onAdd(performanceData);
    }
    
    // Reset form
    setName("");
    setSelectedIcon("🎯");
    setSelectedCategoryId("");
    onOpenChange(false);
  };

  const showCategorySelector = domainId && categories && categories.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-3xl bg-black/95 border border-white/[0.18] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Ajouter une Performance Libre</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-white/80 text-sm">Titre</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Séance intense"
              className="bg-white/[0.05] border-white/[0.12] text-white mt-1"
            />
          </div>

          {showCategorySelector && (
            <div>
              <Label className="text-white/80 text-sm">Catégorie</Label>
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                <SelectTrigger className="w-full bg-white/[0.05] border-white/[0.12] text-white mt-1">
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 backdrop-blur-xl border-white/[0.12]">
                  {categories!.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="text-white/80">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
              disabled={!name.trim() || (showCategorySelector && !selectedCategoryId)}
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
