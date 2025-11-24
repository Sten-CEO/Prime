import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { format } from "date-fns";

interface RecordMetricModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metricName: string;
  onRecord: (data: { date: string; score: number; note?: string }) => void;
}

export const RecordMetricModal = ({ open, onOpenChange, metricName, onRecord }: RecordMetricModalProps) => {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [score, setScore] = useState(50);
  const [note, setNote] = useState("");

  const handleRecord = () => {
    onRecord({ date, score, note: note.trim() || undefined });
    setDate(format(new Date(), "yyyy-MM-dd"));
    setScore(50);
    setNote("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-3xl bg-black/95 border border-white/[0.18] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Enregistrer : {metricName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
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
            <Label className="text-white/80 text-sm">Score du jour (0-100)</Label>
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

          <div>
            <Label className="text-white/80 text-sm">Note rapide (optionnel)</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex: Très bonne session, beaucoup d'énergie"
              className="bg-white/[0.05] border-white/[0.12] text-white mt-1 resize-none h-20"
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
              onClick={handleRecord}
              className="flex-1 bg-white/[0.15] border border-white/[0.2] text-white hover:bg-white/[0.2]"
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
