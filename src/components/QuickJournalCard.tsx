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
    <Card className="backdrop-blur-xl bg-white/[0.03] border-white/[0.15] rounded-2xl p-6 relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Journal</h2>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs text-white/60 hover:text-white hover:bg-white/10"
          >
            Voir tout
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        
        <Button className="w-full backdrop-blur-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/20 text-white rounded-2xl h-12">
          <PenLine className="w-4 h-4 mr-2" />
          Écrire une entrée rapide
        </Button>
        
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-white/60">Entrées récentes</h3>
          {recentEntries.map((entry) => (
            <div 
              key={entry.id}
              className="p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-sm border border-white/5 transition-all cursor-pointer"
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
