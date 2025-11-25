import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CategoryManualNoteProps {
  categoryName: string;
}

type ImpactLevel = 1 | 2 | 3 | null;

const IMPACT_VALUES = {
  1: 20,
  2: 50,
  3: 80,
};

export const CategoryManualNote = ({ categoryName }: CategoryManualNoteProps) => {
  const [note, setNote] = useState("");
  const [impactLevel, setImpactLevel] = useState<ImpactLevel>(null);

  const handleRecord = () => {
    if (!impactLevel) return;
    // TODO: Enregistrer dans Supabase
    console.log("Recording manual note:", { note, impact: IMPACT_VALUES[impactLevel], categoryName });
  };

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
          <label className="text-xs text-white/60 mb-2 block">
            Impact de la performance
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setImpactLevel(1)}
              className={cn(
                "px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                impactLevel === 1
                  ? "bg-white/[0.15] border-2 border-white/[0.3] text-white"
                  : "bg-white/[0.05] border border-white/[0.1] text-white/60 hover:bg-white/[0.08]"
              )}
            >
              <div className="text-xs mb-1">Impact 1</div>
              <div className="text-[10px] text-white/50">Simple</div>
            </button>
            <button
              onClick={() => setImpactLevel(2)}
              className={cn(
                "px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                impactLevel === 2
                  ? "bg-white/[0.15] border-2 border-white/[0.3] text-white"
                  : "bg-white/[0.05] border border-white/[0.1] text-white/60 hover:bg-white/[0.08]"
              )}
            >
              <div className="text-xs mb-1">Impact 2</div>
              <div className="text-[10px] text-white/50">Avancée</div>
            </button>
            <button
              onClick={() => setImpactLevel(3)}
              className={cn(
                "px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                impactLevel === 3
                  ? "bg-white/[0.15] border-2 border-white/[0.3] text-white"
                  : "bg-white/[0.05] border border-white/[0.1] text-white/60 hover:bg-white/[0.08]"
              )}
            >
              <div className="text-xs mb-1">Impact 3</div>
              <div className="text-[10px] text-white/50">Exceptionnelle</div>
            </button>
          </div>
          {impactLevel && (
            <p className="text-xs text-white/70 mt-2">
              Valeur ajoutée: <span className="font-bold text-success">+{IMPACT_VALUES[impactLevel]}</span>
            </p>
          )}
        </div>

        <button 
          onClick={handleRecord}
          disabled={!impactLevel}
          className="w-full py-2.5 rounded-lg backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] hover:bg-white/[0.12] hover:border-white/[0.25] transition-all text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Enregistrer
        </button>
      </div>
    </Card>
  );
};