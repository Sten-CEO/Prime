import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddFreePerformanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (performance: {
    title: string;
    date: string;
    description?: string;
    score: number;
    impact: "positive" | "neutral" | "negative";
  }) => void;
}

const iconOptions = ["🎯", "⚡", "💪", "🧠", "❤️", "🔥", "✨", "🚀", "📈", "🎨"];

export const AddFreePerformanceModal = ({ open, onOpenChange, onAdd }: AddFreePerformanceModalProps) => {
  const [title, setTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("🎯");
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState("");
  const [score, setScore] = useState(50);
  const [impact, setImpact] = useState<"positive" | "neutral" | "negative">("positive");

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({
      title: `${selectedIcon} ${title}`,
      date: format(date, "yyyy-MM-dd"),
      description: description.trim() || undefined,
      score,
      impact,
    });
    // Reset
    setTitle("");
    setSelectedIcon("🎯");
    setDate(new Date());
    setDescription("");
    setScore(50);
    setImpact("positive");
    onOpenChange(false);
  };

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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: 10 000 pas imprévus"
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/[0.05] border-white/[0.12] text-white hover:bg-white/[0.08] mt-1",
                    !date && "text-white/60"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Choisir une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-black/95 backdrop-blur-xl border-white/[0.12]" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="text-white/80 text-sm">Description (optionnel)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Journée très active, bien au-delà de l'objectif"
              className="bg-white/[0.05] border-white/[0.12] text-white mt-1 resize-none h-20"
            />
          </div>

          <div>
            <Label className="text-white/80 text-sm">Note (0-100)</Label>
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
            <div className="mt-2 h-2 rounded-full bg-white/[0.05] overflow-hidden">
              <div
                className={`h-full transition-all ${
                  score >= 80
                    ? "bg-success"
                    : score >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          <div>
            <Label className="text-white/80 text-sm">Impact</Label>
            <Select value={impact} onValueChange={(value: any) => setImpact(value)}>
              <SelectTrigger className="w-full bg-white/[0.05] border-white/[0.12] text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/95 backdrop-blur-xl border-white/[0.12]">
                <SelectItem value="positive" className="text-white/80">✅ Positif</SelectItem>
                <SelectItem value="neutral" className="text-white/80">➖ Neutre</SelectItem>
                <SelectItem value="negative" className="text-white/80">⚠️ Négatif</SelectItem>
              </SelectContent>
            </Select>
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
              disabled={!title.trim()}
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
