import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DomainPerformanceNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  performanceName: string;
  onSave: (score: number, note: string) => void;
}

export const DomainPerformanceNoteDialog = ({
  open,
  onOpenChange,
  performanceName,
  onSave,
}: DomainPerformanceNoteDialogProps) => {
  const [score, setScore] = useState(50);
  const [note, setNote] = useState("");

  const handleSave = () => {
    onSave(score, note);
    setScore(50);
    setNote("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-3xl bg-black/95 border-white/[0.18] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Noter : {performanceName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <p className="text-white/60 text-sm mb-3">Score du jour</p>
            <div className="flex items-center gap-4">
              <Slider
                value={[score]}
                onValueChange={(value) => setScore(value[0])}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-white text-lg font-semibold w-16 text-right">
                {score}/100
              </span>
            </div>
          </div>

          <div>
            <p className="text-white/60 text-sm mb-3">Note rapide (optionnelle)</p>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ajouter une note..."
              className="bg-white/[0.05] border-white/[0.12] text-white placeholder:text-white/40 resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-white/60 hover:text-white hover:bg-white/[0.08]"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            className="bg-white/[0.12] hover:bg-white/[0.18] text-white border border-white/[0.2]"
          >
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
