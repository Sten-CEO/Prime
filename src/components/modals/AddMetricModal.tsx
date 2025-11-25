import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useMetrics } from "@/hooks/useMetrics";

interface AddMetricModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (metric: { name: string; icon: string; days: string[] }) => void;
  domainId?: string;
  categories?: Array<{ id: string; name: string }>;
  editMetric?: {
    id: string;
    name: string;
    icon: string | null;
    impact_weight: number | null;
    scheduled_days: string[] | null;
    category_id: string | null;
  } | null;
}

const iconOptions = ["💧", "🏃", "📚", "🧘", "🥗", "😴", "☕", "🎵", "🌞", "🌙"];
const weekDays = ["L", "M", "M", "J", "V", "S", "D"];
const weekDaysMap: Record<string, string> = {
  "L": "LUNDI",
  "M": "MARDI",
  "M2": "MERCREDI",
  "J": "JEUDI",
  "V": "VENDREDI",
  "S": "SAMEDI",
  "D": "DIMANCHE"
};

export const AddMetricModal = ({ open, onOpenChange, onAdd, domainId, categories, editMetric }: AddMetricModalProps) => {
  const [name, setName] = useState(editMetric?.name || "");
  const [selectedIcon, setSelectedIcon] = useState(editMetric?.icon || "💧");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(editMetric?.category_id || "");
  const [impactWeight, setImpactWeight] = useState<string>(editMetric?.impact_weight?.toString() || "1");
  const [selectedDays, setSelectedDays] = useState<string[]>(editMetric?.scheduled_days || []);
  
  const { createMetric, updateMetric, deleteMetric } = useMetrics(selectedCategoryId || undefined);

  const toggleDay = (dayIndex: number) => {
    const dayKey = dayIndex === 2 ? "M2" : weekDays[dayIndex];
    const dayValue = weekDaysMap[dayKey];
    
    if (selectedDays.includes(dayValue)) {
      setSelectedDays(selectedDays.filter(d => d !== dayValue));
    } else {
      setSelectedDays([...selectedDays, dayValue]);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    const metricData = {
      name,
      icon: selectedIcon,
      category_id: selectedCategoryId,
      domain_id: domainId!,
      impact_weight: parseFloat(impactWeight) || 1,
      scheduled_days: selectedDays,
    };

    if (editMetric) {
      // Update existing metric
      updateMetric({
        id: editMetric.id,
        ...metricData,
      });
    } else {
      // Create new metric
      if (domainId && categories && categories.length > 0) {
        if (!selectedCategoryId) return;
        createMetric(metricData);
      } else {
        onAdd({
          name,
          icon: selectedIcon,
          days: selectedDays,
        });
      }
    }
    
    // Reset form
    resetForm();
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (editMetric && window.confirm("Êtes-vous sûr de vouloir supprimer cette métrique ?")) {
      deleteMetric(editMetric.id);
      resetForm();
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setName("");
    setSelectedIcon("💧");
    setSelectedCategoryId("");
    setImpactWeight("1");
    setSelectedDays([]);
  };

  const showCategorySelector = domainId && categories && categories.length > 0;
  const isRegular = selectedDays.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-3xl bg-black/95 border border-white/[0.18] text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">{editMetric ? "Modifier la Métrique" : "Ajouter une Métrique"}</DialogTitle>
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

          <div>
            <Label className="text-white/80 text-sm">Impact standard</Label>
            <Input
              type="number"
              step="0.5"
              min="0.5"
              value={impactWeight}
              onChange={(e) => setImpactWeight(e.target.value)}
              className="bg-white/[0.05] border-white/[0.12] text-white mt-1"
            />
            <p className="text-xs text-white/40 mt-1">Plus l'impact est élevé, plus cette métrique pèse dans le score du domaine.</p>
          </div>

          <div>
            <Label className="text-white/80 text-sm mb-2 block">Jours concernés</Label>
            <div className="flex gap-2">
              {weekDays.map((day, index) => {
                const dayKey = index === 2 ? "M2" : day;
                const dayValue = weekDaysMap[dayKey];
                const isSelected = selectedDays.includes(dayValue);
                
                return (
                  <button
                    key={`${day}-${index}`}
                    onClick={() => toggleDay(index)}
                    className={`flex-1 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-white/[0.15] border-2 border-white/[0.3] shadow-[0_0_10px_rgba(255,255,255,0.2)] text-white"
                        : "bg-white/[0.05] border border-white/[0.12] text-white/50 hover:bg-white/[0.08] hover:text-white/70"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            {isRegular && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.08] border border-white/[0.15]">
                <span className="text-xs text-white/60">Régulière</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            {editMetric && (
              <Button
                onClick={handleDelete}
                variant="outline"
                className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
              >
                Supprimer
              </Button>
            )}
            <Button
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              variant="outline"
              className="flex-1 bg-white/[0.05] border-white/[0.12] text-white hover:bg-white/[0.08]"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!name.trim() || (showCategorySelector && !selectedCategoryId)}
              className="flex-1 bg-white/[0.15] border border-white/[0.2] text-white hover:bg-white/[0.2]"
            >
              {editMetric ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
