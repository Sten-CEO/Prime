import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AddEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDomain?: string;
  onSuccess?: () => void;
  editMode?: boolean;
  entryId?: string;
  initialData?: {
    title: string;
    content: string;
    domain_id: string;
    entry_date: string;
  };
}

const domains = [
  { id: "general", label: "Général" },
  { id: "business", label: "Business" },
  { id: "sport", label: "Sport" },
  { id: "social", label: "Social" },
  { id: "sante", label: "Santé" },
  { id: "developpement", label: "Développement" },
  { id: "finance", label: "Finance" },
];

export const AddEntryModal = ({ 
  open, 
  onOpenChange, 
  defaultDomain, 
  onSuccess,
  editMode = false,
  entryId,
  initialData 
}: AddEntryModalProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [domain, setDomain] = useState(initialData?.domain_id || defaultDomain || "");
  const [date, setDate] = useState<Date>(
    initialData?.entry_date ? new Date(initialData.entry_date) : new Date()
  );
  const [loading, setLoading] = useState(false);
  const [insightMode, setInsightMode] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showInsightPopup, setShowInsightPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [insights, setInsights] = useState<string[]>([]);
  const [tempInsights, setTempInsights] = useState<string[]>([]);

  // Reset form when modal opens with initial data
  useEffect(() => {
    if (open && initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setDomain(initialData.domain_id);
      setDate(new Date(initialData.entry_date));
    } else if (open && !initialData) {
      setTitle("");
      setContent("");
      setDomain(defaultDomain || "");
      setDate(new Date());
      setTempInsights([]);
    }
  }, [open, initialData, defaultDomain]);

  const handleTextSelection = () => {
    if (!insightMode) return;
    
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 0) {
      setSelectedText(text);
      setShowInsightPopup(true);
    }
  };

  const handleConfirmInsight = () => {
    if (selectedText && !tempInsights.includes(selectedText)) {
      setTempInsights(prev => [...prev, selectedText]);
    }
    setShowInsightPopup(false);
    setSelectedText("");
    window.getSelection()?.removeAllRanges();
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !domain) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
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
          description: editMode ? "Vous devez être connecté pour modifier une entrée" : "Vous devez être connecté pour créer une entrée",
          variant: "destructive",
        });
        return;
      }

      if (editMode && entryId) {
        // Update existing entry
        const { error: entryError } = await supabase
          .from("journal_entries")
          .update({
            title: title.trim(),
            content: content.trim(),
            domain_id: domain,
            entry_date: format(date, "yyyy-MM-dd"),
            has_insight: tempInsights.length > 0,
          })
          .eq("id", entryId);

        if (entryError) throw entryError;

        // Handle insights for edit mode
        if (tempInsights.length > 0) {
          const insightRecords = tempInsights.map(phrase => ({
            user_id: user.id,
            entry_id: entryId,
            domain_id: domain,
            phrase,
            insight_date: format(date, "yyyy-MM-dd"),
          }));

          const { error: insightsError } = await supabase
            .from("insights")
            .insert(insightRecords);

          if (insightsError) throw insightsError;
        }

        toast({
          title: "Entrée modifiée",
          description: "Votre entrée a été mise à jour avec succès",
        });
      } else {
        // Create new entry
        const { data: entryData, error: entryError } = await supabase
          .from("journal_entries")
          .insert({
            user_id: user.id,
            title: title.trim(),
            content: content.trim(),
            domain_id: domain,
            entry_date: format(date, "yyyy-MM-dd"),
            has_insight: tempInsights.length > 0,
          })
          .select()
          .single();

        if (entryError) throw entryError;

        // Insert insights if any
        if (tempInsights.length > 0 && entryData) {
          const insightRecords = tempInsights.map(phrase => ({
            user_id: user.id,
            entry_id: entryData.id,
            domain_id: domain,
            phrase,
            insight_date: format(date, "yyyy-MM-dd"),
          }));

          const { error: insightsError } = await supabase
            .from("insights")
            .insert(insightRecords);

          if (insightsError) throw insightsError;
        }

        toast({
          title: "Entrée créée",
          description: tempInsights.length > 0 
            ? `Votre entrée avec ${tempInsights.length} insight(s) a été enregistrée`
            : "Votre entrée de journal a été enregistrée",
        });
      }

      setTitle("");
      setContent("");
      setDomain(defaultDomain || "");
      setDate(new Date());
      setInsightMode(false);
      setSelectedText("");
      setShowInsightPopup(false);
      setTempInsights([]);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Erreur",
        description: editMode ? "Impossible de modifier l'entrée" : "Impossible de créer l'entrée",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-xl bg-black/80 border border-white/[0.08] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editMode ? "Modifier l'entrée" : "Nouvelle entrée de journal"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm text-white/70 mb-2 block">Titre</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'entrée..."
              className="bg-white/[0.05] border-white/[0.1] text-white"
            />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-white/70">Contenu</label>
              <button
                type="button"
                id="insight-button"
                onClick={() => setInsightMode(!insightMode)}
                className={`text-xs px-4 py-2 rounded-xl transition-all font-medium ${
                  insightMode 
                    ? 'bg-white text-black border border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_24px_rgba(255,255,255,0.5)]' 
                    : 'bg-white/[0.05] text-white/60 border border-white/[0.1] hover:bg-white/[0.08] hover:text-white/80'
                }`}
              >
                ✨ Insight
              </button>
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onMouseUp={handleTextSelection}
              onTouchEnd={handleTextSelection}
              placeholder="Écrivez votre entrée..."
              className={`bg-white/[0.05] border-white/[0.1] text-white min-h-[200px] ${
                insightMode ? 'cursor-text ring-1 ring-primary/30' : ''
              }`}
            />
            
            {showInsightPopup && insightMode && (
              <div className="fixed right-8 top-32 z-[100] animate-scale-in">
                <div className="backdrop-blur-2xl bg-gradient-to-br from-primary/25 to-primary/15 border border-primary/40 rounded-2xl px-5 py-4 shadow-[0_8px_32px_rgba(139,92,246,0.4)] min-w-[240px]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-white text-sm font-medium">Ajouter en Insight ?</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleConfirmInsight}
                      className="flex-1 backdrop-blur-xl bg-primary/40 hover:bg-primary/50 border border-primary/50 hover:border-primary/60 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all hover:shadow-[0_0_16px_rgba(139,92,246,0.5)] hover:-translate-y-0.5"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => {
                        setShowInsightPopup(false);
                        setSelectedText("");
                        window.getSelection()?.removeAllRanges();
                      }}
                      className="flex-1 backdrop-blur-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.15] text-white/70 hover:text-white text-sm px-4 py-2 rounded-xl transition-all"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Domaine</label>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger className="bg-white/[0.05] border-white/[0.1] text-white">
                  <SelectValue placeholder="Choisir un domaine" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/[0.1]">
                  {domains.map((d) => (
                    <SelectItem key={d.id} value={d.id} className="text-white">
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="w-full justify-start text-left font-normal bg-white/[0.05] border border-white/[0.1] text-white hover:bg-white/[0.08] rounded-md px-3 py-2 flex items-center transition-colors"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "d MMMM yyyy", { locale: fr })}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black/90 border-white/[0.1]">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    locale={fr}
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => onOpenChange(false)}
              className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-xl px-6 py-2.5 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all cursor-pointer text-white text-sm font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-xl px-6 py-2.5 hover:bg-white/[0.12] hover:border-white/[0.15] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all cursor-pointer text-white text-sm font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
