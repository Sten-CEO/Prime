import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Highlighter, ArrowLeft, Edit, Trash2, Sparkles } from "lucide-react";
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
  const [insights, setInsights] = useState<string[]>([]);

  const fetchInsights = async () => {
    try {
      const { data, error } = await supabase
        .from("insights")
        .select("phrase")
        .eq("entry_id", id);

      if (error) throw error;

      setInsights(data?.map(i => i.phrase) || []);
    } catch (error) {
      console.error("Error fetching insights:", error);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [id]);

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

  const highlightInsights = (text: string) => {
    if (insights.length === 0) return text;

    let highlightedText = text;
    insights.forEach((insight, index) => {
      const escapedInsight = insight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedInsight})`, 'gi');
      highlightedText = highlightedText.replace(
        regex,
        `<mark class="bg-primary/20 text-white rounded px-1 shadow-[0_0_8px_rgba(139,92,246,0.3)]">$1</mark>`
      );
    });

    return highlightedText;
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
        <button
          onClick={onBack}
          className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl px-4 py-2 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-white/70" />
          <span className="text-white/70 text-sm">Retour</span>
        </button>

        <div className="flex gap-2">
          <button className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-xl w-10 h-10 flex items-center justify-center hover:bg-white/[0.04] hover:border-white/[0.12] transition-all cursor-pointer">
            <Edit className="w-4 h-4 text-white/70" />
          </button>
          <button 
            onClick={handleDelete}
            className="backdrop-blur-xl bg-red-500/[0.05] border border-red-500/[0.2] rounded-xl w-10 h-10 flex items-center justify-center hover:bg-red-500/[0.1] hover:border-red-500/[0.3] transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-red-500/70" />
          </button>
        </div>
      </div>

      <Card className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              {getDomainLabel(domain)}
            </span>
            {insights.length > 0 && (
              <span className="text-xs font-medium text-primary/80 px-3 py-1 rounded-full bg-primary/5 border border-primary/15 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Insight
              </span>
            )}
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
              dangerouslySetInnerHTML={{ __html: highlightInsights(content) }}
            />

            {showHighlightButton && (
              <div
                className="fixed z-50 animate-scale-in"
                style={{
                  left: `${highlightPosition.x}px`,
                  top: `${highlightPosition.y}px`,
                  transform: "translateX(-50%)",
                }}
              >
                <button
                  onClick={handleHighlight}
                  className="backdrop-blur-xl bg-primary/20 border border-primary/30 rounded-2xl px-4 py-2 hover:bg-primary/30 hover:border-primary/40 transition-all cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center gap-2"
                >
                  <Highlighter className="w-4 h-4 text-primary" />
                  <span className="text-white text-sm font-medium">Surligner comme Insight</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
