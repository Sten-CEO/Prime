import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface QuickNote {
  id: string;
  content: string;
  created_at: string;
}

export const QuickJournalCard = () => {
  const navigate = useNavigate();
  const [quickNote, setQuickNote] = useState("");
  const [recentNotes, setRecentNotes] = useState<QuickNote[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecentNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from("quick_notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;

      setRecentNotes(data || []);
    } catch (error) {
      console.error("Error fetching quick notes:", error);
    }
  };

  useEffect(() => {
    fetchRecentNotes();
  }, []);

  const handleSubmit = async () => {
    if (!quickNote.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une note",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
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

      const { error } = await supabase.from("quick_notes").insert({
        user_id: user.id,
        content: quickNote.trim(),
      });

      if (error) throw error;

      toast({
        title: "Note ajoutée",
        description: "Votre note a été enregistrée avec succès",
      });

      setQuickNote("");
      fetchRecentNotes();
    } catch (error) {
      console.error("Error adding quick note:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la note",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-3xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Journal rapide</h2>
        <Button
          onClick={() => navigate("/quick-notes")}
          variant="ghost"
          className="text-white/60 hover:text-white text-sm"
        >
          Voir tout
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="flex gap-3 mb-6">
        <Input
          value={quickNote}
          onChange={(e) => setQuickNote(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Écrire une note rapide..."
          className="flex-1 backdrop-blur-xl bg-white/[0.04] border border-white/[0.12] text-white placeholder:text-white/40 h-12 rounded-xl"
          disabled={loading}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-xl px-5 hover:bg-white/[0.12] hover:border-white/[0.2] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white/60 mb-3">Entrées récentes</h3>
        {recentNotes.length === 0 ? (
          <p className="text-white/40 text-sm text-center py-8">
            Aucune note pour le moment
          </p>
        ) : (
          recentNotes.map((note) => (
            <div
              key={note.id}
              className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
            >
              <p className="text-white/70 text-sm mb-2">{note.content}</p>
              <p className="text-white/40 text-xs">
                {format(new Date(note.created_at), "d MMM", { locale: fr })}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
