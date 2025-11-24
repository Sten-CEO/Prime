import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenLine, ArrowRight } from "lucide-react";

const recentEntries = [
  { id: 1, date: "24 Nov", preview: "Excellente session de sport ce matin..." },
  { id: 2, date: "23 Nov", preview: "Réunion productive avec l'équipe..." },
  { id: 3, date: "22 Nov", preview: "Moment de méditation très bénéfique..." },
];

export const QuickJournalCard = () => {
  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 relative overflow-hidden shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white drop-shadow-lg">Journal</h2>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs text-white/60 hover:text-white hover:bg-white/[0.08]"
          >
            Voir tout
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        
        <Button className="w-full backdrop-blur-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.2] text-white rounded-2xl h-12 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.2)]">
          <PenLine className="w-4 h-4 mr-2" />
          Écrire une entrée rapide
        </Button>
        
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-white/60">Entrées récentes</h3>
          {recentEntries.map((entry) => (
            <div 
              key={entry.id}
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-2xl border border-white/[0.12] transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
            >
              <div className="flex items-start gap-3">
                <span className="text-xs text-white/50 min-w-[50px]">{entry.date}</span>
                <p className="text-sm text-white/80 line-clamp-1">{entry.preview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
