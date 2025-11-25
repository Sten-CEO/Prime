import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { HighlightMenu } from "./HighlightMenu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DayEditorProps {
  domain?: string;
  onInsightCreated?: () => void;
}

export const DayEditor = ({ domain, onInsightCreated }: DayEditorProps) => {
  const [content, setContent] = useState("");
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const today = new Date();

  useEffect(() => {
    // Load today's entry if exists
    loadTodayEntry();
  }, [domain]);

  const loadTodayEntry = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const todayDate = format(today, "yyyy-MM-dd");
      
      const query = supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("entry_date", todayDate);

      if (domain) {
        query.eq("domain_id", domain);
      }

      const { data, error } = await query.single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setContent(data.content);
      }
    } catch (error) {
      console.error("Error loading today's entry:", error);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 0) {
      const range = selection!.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelectedText(text);
      setMenuPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
      setShowHighlightMenu(true);
    } else {
      setShowHighlightMenu(false);
    }
  };

  const handleSaveInsight = async (text: string, insightDomain: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Non authentifié",
          description: "Vous devez être connecté pour créer un insight",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("insights").insert({
        user_id: user.id,
        phrase: text,
        domain_id: insightDomain,
        insight_date: format(today, "yyyy-MM-dd"),
      });

      if (error) throw error;

      toast({
        title: "Insight créé",
        description: "Votre insight a été ajouté avec succès",
      });

      onInsightCreated?.();
    } catch (error) {
      console.error("Error saving insight:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'insight",
        variant: "destructive",
      });
    }
  };

  const handleSaveEntry = async () => {
    if (!content.trim()) {
      toast({
        title: "Contenu vide",
        description: "Écrivez quelque chose avant d'enregistrer",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Non authentifié",
          description: "Vous devez être connecté pour enregistrer",
          variant: "destructive",
        });
        return;
      }

      const todayDate = format(today, "yyyy-MM-dd");
      const entryDomain = domain || "general";

      // Check if entry exists
      const { data: existingEntry } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("entry_date", todayDate)
        .eq("domain_id", entryDomain)
        .single();

      if (existingEntry) {
        // Update existing
        const { error } = await supabase
          .from("journal_entries")
          .update({ content: content.trim() })
          .eq("id", existingEntry.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase.from("journal_entries").insert({
          user_id: user.id,
          title: `Journal du ${format(today, "d MMMM yyyy", { locale: fr })}`,
          content: content.trim(),
          domain_id: entryDomain,
          entry_date: todayDate,
        });

        if (error) throw error;
      }

      toast({
        title: "Journal enregistré",
        description: "Votre page du jour a été sauvegardée",
      });
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'entrée",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">
          {format(today, "EEEE d MMMM yyyy", { locale: fr })}
        </h2>
        <p className="text-sm text-white/50">Page du jour</p>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onMouseUp={handleTextSelection}
        onInput={(e) => setContent(e.currentTarget.textContent || "")}
        className="min-h-[400px] w-full p-4 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white leading-relaxed focus:outline-none focus:border-white/[0.1] transition-all"
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      >
        {content}
      </div>

      {showHighlightMenu && (
        <HighlightMenu
          position={menuPosition}
          selectedText={selectedText}
          onSave={handleSaveInsight}
          onCancel={() => setShowHighlightMenu(false)}
          defaultDomain={domain}
        />
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveEntry}
          disabled={saving}
          className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-xl px-8 py-3 hover:bg-white/[0.12] hover:border-white/[0.15] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all cursor-pointer text-white text-sm font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {saving ? "Enregistrement..." : "Enregistrer la page du jour"}
        </button>
      </div>
    </div>
  );
};
