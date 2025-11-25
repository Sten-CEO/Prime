import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { useFreePerformances } from "@/hooks/useFreePerformances";
import { useFreePerformanceRecords } from "@/hooks/useFreePerformanceRecords";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AddFreePerformanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (performance: any) => void;
  domainId?: string;
  categories?: Array<{ id: string; name: string }>;
  editPerformance?: {
    id: string;
    label: string;
    recorded_date: string;
    impact_value: number;
    category_id: string | null;
    domain_id: string;
  } | null;
}

const iconOptions = ["🎯", "⚡", "💪", "🧠", "❤️", "🔥", "✨", "🚀", "📈", "🎨"];

export const AddFreePerformanceModal = ({ open, onOpenChange, onAdd, domainId, categories, editPerformance }: AddFreePerformanceModalProps) => {
  const [name, setName] = useState(editPerformance?.label || "");
  const [selectedIcon, setSelectedIcon] = useState("🎯");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(editPerformance?.category_id || "");
  const [selectedDate, setSelectedDate] = useState<Date>(editPerformance ? new Date(editPerformance.recorded_date) : new Date());
  const [impactValue, setImpactValue] = useState<string>(editPerformance?.impact_value?.toString() || "1");
  
  const { createFreePerformance, updateFreePerformance, deleteFreePerformance } = useFreePerformances(selectedCategoryId || undefined);
  const { createFreePerformanceRecord, deleteFreePerformanceRecord } = useFreePerformanceRecords(domainId, selectedCategoryId);

  const handleSubmit = () => {
    if (!name.trim() || !domainId) return;
    
    if (editPerformance) {
      // For edit, we need to update the record
      // This is simplified - in a real scenario, you'd need to handle the relationship properly
      deleteFreePerformanceRecord(editPerformance.id);
    }

    // Create new record
    if (domainId && categories && categories.length > 0) {
      if (!selectedCategoryId) return;
      
      createFreePerformanceRecord({
        label: name,
        domain_id: domainId,
        category_id: selectedCategoryId,
        recorded_date: format(selectedDate, "yyyy-MM-dd"),
        impact_value: parseFloat(impactValue) || 1,
      });
    } else {
      onAdd({
        title: name,
        date: selectedDate.toISOString(),
        impact: parseFloat(impactValue) || 1,
      });
    }
    
    resetForm();
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (editPerformance && window.confirm("Êtes-vous sûr de vouloir supprimer cette performance ?")) {
      deleteFreePerformanceRecord(editPerformance.id);
      resetForm();
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setName("");
    setSelectedIcon("🎯");
    setSelectedCategoryId("");
    setSelectedDate(new Date());
    setImpactValue("1");
  };

  const showCategorySelector = domainId && categories && categories.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-3xl bg-black/95 border border-white/[0.18] text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">{editPerformance ? "Modifier la Performance" : "Ajouter une Performance Libre"}</DialogTitle>
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

          <div>
            <Label className="text-white/80 text-sm mb-2 block">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-white/[0.05] border-white/[0.12] text-white hover:bg-white/[0.08]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "PPP", { locale: fr })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-black/95 backdrop-blur-xl border-white/[0.12]">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="text-white/80 text-sm">Impact</Label>
            <Input
              type="number"
              step="0.5"
              min="0.5"
              value={impactValue}
              onChange={(e) => setImpactValue(e.target.value)}
              className="bg-white/[0.05] border-white/[0.12] text-white mt-1"
            />
            <p className="text-xs text-white/40 mt-1">Plus l'impact est élevé, plus cette performance pèse dans l'indice du domaine.</p>
          </div>

          <div className="flex gap-2 pt-4">
            {editPerformance && (
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
              {editPerformance ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
