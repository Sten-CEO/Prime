import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface RatePerformanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  performanceName: string;
  onRate: (score: number, note: string) => void;
}

export const RatePerformanceModal = ({ open, onOpenChange, performanceName, onRate }: RatePerformanceModalProps) => {
  const [score, setScore] = useState(5);
  const [note, setNote] = useState("");

  const handleRate = () => {
    onRate(score * 10, note);
    setScore(5);
    setNote("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-3xl bg-black/95 border border-white/[0.18] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Noter aujourd'hui : {performanceName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-sm">Note</span>
              <span className="text-white font-bold text-2xl">{score}/10</span>
            </div>
            <Slider
              value={[score]}
              onValueChange={(value) => setScore(value[0])}
              max={10}
              step={0.5}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-white/80 text-sm block mb-2">Note rapide (facultatif)</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Comment s'est passée cette performance aujourd'hui ?"
              className="bg-white/[0.05] border-white/[0.12] text-white min-h-[100px]"
            />
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
              onClick={handleRate}
              className="flex-1 bg-white/[0.15] border border-white/[0.2] text-white hover:bg-white/[0.2]"
            >
              Valider
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
