import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenLine, ArrowRight, Send } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const recentEntries = [
  { id: 1, date: "24 Nov", preview: "Excellente session de sport ce matin...", full: "Excellente session de sport ce matin. J'ai couru 10km en moins d'une heure, c'est un nouveau record personnel ! Je me sens énergisé et prêt à attaquer la journée." },
  { id: 2, date: "23 Nov", preview: "Réunion productive avec l'équipe...", full: "Réunion productive avec l'équipe aujourd'hui. Nous avons défini les grandes lignes du nouveau projet et l'ambiance était vraiment positive. J'ai hâte de voir les résultats." },
  { id: 3, date: "22 Nov", preview: "Moment de méditation très bénéfique...", full: "Moment de méditation très bénéfique ce matin. 20 minutes de silence m'ont permis de clarifier mes pensées et d'aborder la journée avec plus de sérénité. Je devrais faire ça plus souvent." },
];

export const QuickJournalCard = () => {
  const [showQuickEntry, setShowQuickEntry] = useState(false);
  const [quickEntryText, setQuickEntryText] = useState("");

  const handleQuickEntry = () => {
    if (quickEntryText.trim()) {
      toast({
        title: "Entrée enregistrée",
        description: "Votre note a été ajoutée au journal.",
      });
      setQuickEntryText("");
      setShowQuickEntry(false);
    }
  };

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 relative overflow-hidden shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white drop-shadow-lg">Journal</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.location.href = '/journal'}
            className="text-xs text-white/60 hover:text-white hover:bg-white/[0.08]"
          >
            Voir tout
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        
        {!showQuickEntry ? (
          <Button 
            onClick={() => setShowQuickEntry(true)}
            className="w-full backdrop-blur-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.2] text-white rounded-2xl h-12 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.2)]"
          >
            <PenLine className="w-4 h-4 mr-2" />
            Écrire une entrée rapide
          </Button>
        ) : (
          <div className="space-y-3 animate-accordion-down">
            <Textarea 
              value={quickEntryText}
              onChange={(e) => setQuickEntryText(e.target.value)}
              placeholder="Notez vos pensées du moment..."
              className="min-h-[100px] backdrop-blur-xl bg-white/[0.04] border-white/[0.15] text-white placeholder:text-white/40 resize-none"
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleQuickEntry}
                className="flex-1 backdrop-blur-2xl bg-success/20 hover:bg-success/30 border border-success/40 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
              <Button 
                onClick={() => setShowQuickEntry(false)}
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/[0.08]"
              >
                Annuler
              </Button>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-white/60">Entrées récentes</h3>
          {recentEntries.map((entry) => (
            <Dialog key={entry.id}>
              <DialogTrigger asChild>
                <div 
                  className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-2xl border border-white/[0.12] transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-white/50 min-w-[50px]">{entry.date}</span>
                    <p className="text-sm text-white/80 line-clamp-1">{entry.preview}</p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-xl bg-black/90 border-white/[0.15] text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">Entrée du {entry.date}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-white/90">{entry.full}</p>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 backdrop-blur-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.15] text-white"
                    >
                      Modifier
                    </Button>
                    <Button 
                      className="flex-1 backdrop-blur-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.15] text-white"
                      onClick={() => window.location.href = '/journal'}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Voir dans Journal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </Card>
  );
};

const ExternalLink = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);
