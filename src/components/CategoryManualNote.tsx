import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { TrendingUp } from "lucide-react";
import { useState } from "react";

interface CategoryManualNoteProps {
  categoryName: string;
}

export const CategoryManualNote = ({ categoryName }: CategoryManualNoteProps) => {
  const [note, setNote] = useState("");
  const [score, setScore] = useState([75]);
  const [impactsCurve, setImpactsCurve] = useState(true);

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
      <h3 className="text-lg font-semibold text-white mb-4">Notage Manuel Libre</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs text-white/60 mb-2 block">
            Décris ta performance du jour
          </label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Exemple: Excellente séance de sport, j'ai dépassé mes objectifs..."
            className="min-h-[100px] bg-white/[0.02] border-white/[0.12] text-white placeholder:text-white/30 focus:border-white/[0.3] resize-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-white/60">
              Note de performance
            </label>
            <span className="text-sm font-medium text-white">
              {score[0].toFixed(0)}<span className="text-white/60">/100</span>
            </span>
          </div>
          <Slider
            value={score}
            onValueChange={setScore}
            max={100}
            step={1}
            className="mb-1"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.08]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm text-white/80">Impact sur la courbe du jour</span>
          </div>
          <button
            onClick={() => setImpactsCurve(!impactsCurve)}
            className={`w-10 h-5 rounded-full transition-all ${
              impactsCurve 
                ? "bg-success/30 border border-success/50" 
                : "bg-white/[0.05] border border-white/[0.12]"
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow-lg transition-transform ${
              impactsCurve ? "translate-x-5" : "translate-x-0"
            }`} />
          </button>
        </div>

        <button className="w-full py-2.5 rounded-lg backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] hover:bg-white/[0.12] hover:border-white/[0.25] transition-all text-white text-sm font-medium">
          Enregistrer
        </button>
      </div>
    </Card>
  );
};