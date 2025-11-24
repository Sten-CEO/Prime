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
    <Card className="backdrop-blur-xl bg-glass-bg/20 border-glass-border/10 rounded-3xl p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Journal</h2>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs text-foreground/60 hover:text-foreground hover:bg-glass-bg/20"
          >
            Voir tout
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        
        <Button className="w-full backdrop-blur-xl bg-glass-bg/30 hover:bg-glass-bg/40 border border-glass-border/20 text-foreground rounded-2xl h-12">
          <PenLine className="w-4 h-4 mr-2" />
          Écrire une entrée rapide
        </Button>
        
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-foreground/60">Entrées récentes</h3>
          {recentEntries.map((entry) => (
            <div 
              key={entry.id}
              className="p-3 rounded-xl bg-glass-bg/10 hover:bg-glass-bg/20 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <span className="text-xs text-foreground/50 min-w-[50px]">{entry.date}</span>
                <p className="text-sm text-foreground/80 line-clamp-1">{entry.preview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
