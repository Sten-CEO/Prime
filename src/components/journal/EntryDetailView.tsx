import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Highlighter, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EntryDetailViewProps {
  id: string;
  title: string;
  content: string;
  domain: string;
  date: Date;
  onBack: () => void;
  onDeleted?: () => void;
}

export const EntryDetailView = ({
  id,
  title,
  content,
  domain,
  date,
  onBack,
  onDeleted,
}: EntryDetailViewProps) => {
  const [selectedText, setSelectedText] = useState("");
  const [showHighlightButton, setShowHighlightButton] = useState(false);
  const [highlightPosition, setHighlightPosition] = useState({ x: 0, y: 0 });

  const getDomainLabel = (domainId: string) => {
    const domains: Record<string, string> = {
      business: "Business",
      sport: "Sport",
      social: "Social",
      sante: "Santé",
      developpement: "Développement",
      finance: "Finance",
    };
    return domains[domainId] || domainId;
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 0) {
      setSelectedText(text);
      
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      
      if (rect) {
        setHighlightPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 50,
        });
        setShowHighlightButton(true);
      }
    } else {
      setShowHighlightButton(false);
    }
  };

  const handleHighlight = async () => {
    if (!selectedText) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Non authentifié",
          description: "Vous devez être connecté",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("insights").insert({
        user_id: user.id,
        entry_id: id,
        domain_id: domain,
        phrase: selectedText,
        insight_date: format(date, "yyyy-MM-dd"),
      });

      if (error) throw error;

      toast({
        title: "Insight créé",
        description: "Le texte a été surligné et enregistré comme insight",
      });

      setShowHighlightButton(false);
      window.getSelection()?.removeAllRanges();
    } catch (error) {
      console.error("Error creating insight:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'insight",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer cette entrée ?")) return;

    try {
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Entrée supprimée",
        description: "L'entrée a été supprimée avec succès",
      });

      onDeleted?.();
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'entrée",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-white/70 hover:text-white hover:bg-white/[0.05]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/[0.05]"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-red-500/70 hover:text-red-500 hover:bg-red-500/[0.05]"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              {getDomainLabel(domain)}
            </span>
            <span className="text-sm text-white/40">
              {format(date, "d MMMM yyyy", { locale: fr })}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white">{title}</h1>

          <div className="relative">
            <div
              className="text-white/80 leading-relaxed whitespace-pre-wrap"
              onMouseUp={handleTextSelection}
              onTouchEnd={handleTextSelection}
            >
              {content}
            </div>

            {showHighlightButton && (
              <div
                className="fixed z-50 animate-scale-in"
                style={{
                  left: `${highlightPosition.x}px`,
                  top: `${highlightPosition.y}px`,
                  transform: "translateX(-50%)",
                }}
              >
                <Button
                  onClick={handleHighlight}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 shadow-lg"
                >
                  <Highlighter className="w-4 h-4 mr-2" />
                  Surligner comme Insight
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
