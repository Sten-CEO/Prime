import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2 } from "lucide-react";
import { useDomainColors } from "@/hooks/useDomainColors";
import { useNavigate } from "react-router-dom";

interface InsightCardProps {
  id: string;
  text: string;
  date: string;
  insight_date: string; // Date ISO brute pour le routing
  highlightColor: "pink" | "purple" | "blue";
  category?: string;
  domain_id: string;
  entry_id?: string;
  onDelete?: () => void;
}

export const InsightCard = ({ id, text, date, insight_date, highlightColor, category = "Business", domain_id, entry_id, onDelete }: InsightCardProps) => {
  const navigate = useNavigate();
  const { getDomainColor } = useDomainColors();
  const domainHslColor = getDomainColor(domain_id);
  const [open, setOpen] = useState(false);

  const getJournalUrl = () => {
    // Parse the ISO date string to extract year and month
    const parsedDate = new Date(insight_date);
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1; // +1 because getMonth() returns 0-11
    
    // Tous les domaines, y compris 'general', utilisent le même format d'URL
    return `/journal/${domain_id}/${year}/${month}`;
  };
  
  // Pour le domaine Général, utiliser blanc pur RGB
  const isGeneral = domain_id === 'general';
  
  const highlightStyle = isGeneral ? {
    backgroundColor: `rgba(255, 255, 255, 0.15)`,
    borderColor: `rgba(255, 255, 255, 0.8)`,
    boxShadow: `0 0 20px rgba(255, 255, 255, 0.6)`,
    color: 'rgb(255, 255, 255)',
  } : {
    backgroundColor: `hsl(${domainHslColor} / 0.2)`,
    borderColor: `hsl(${domainHslColor} / 0.4)`,
    boxShadow: `0 0 20px hsl(${domainHslColor} / 0.4)`,
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-4 hover:bg-white/[0.03] hover:border-white/[0.25] transition-all relative overflow-hidden shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] cursor-pointer">
          <div className="space-y-2">
            <p 
              className="text-sm text-white px-2 py-1 rounded-lg border backdrop-blur-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
              style={highlightStyle}
            >
              {text}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/50">{date}</p>
              <span className="text-xs text-white/40">{category}</span>
            </div>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="backdrop-blur-xl bg-black/90 border-white/[0.15] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Insight complet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div 
            className="p-4 rounded-lg border"
            style={highlightStyle}
          >
            <p className="text-white">{text}</p>
          </div>
          <div className="space-y-2">
            <p className="text-white/70 text-sm">
              Cette réflexion a été notée le {date} dans votre journal. Elle fait partie de vos observations 
              les plus importantes concernant votre développement personnel dans le domaine {category}.
            </p>
            <p className="text-white/60 text-sm italic">
              "Continuer à cultiver cette prise de conscience pour progresser durablement."
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="flex-1 backdrop-blur-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.15] text-white"
              onClick={() => {
                const journalUrl = getJournalUrl();
                console.log("Navigating to journal:", journalUrl);
                setOpen(false);
                setTimeout(() => {
                  navigate(journalUrl);
                }, 100);
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Voir dans Journal
            </Button>
            <Button 
              onClick={onDelete}
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-warning hover:bg-warning/10 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
