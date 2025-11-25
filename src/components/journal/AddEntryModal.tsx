import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles, Bold, Italic, Underline, Strikethrough } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useDomains } from "@/hooks/useDomains";

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

export const AddEntryModal = ({ 
  open, 
  onOpenChange, 
  defaultDomain, 
  onSuccess,
  editMode = false,
  entryId,
  initialData 
}: AddEntryModalProps) => {
  const { domains: dbDomains, isLoading: isLoadingDomains } = useDomains();
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [domain, setDomain] = useState(initialData?.domain_id || defaultDomain || "general");
  const [date, setDate] = useState<Date>(
    initialData?.entry_date ? new Date(initialData.entry_date) : new Date()
  );
  const [loading, setLoading] = useState(false);
  const [insightMode, setInsightMode] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showInsightPopup, setShowInsightPopup] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [tempInsights, setTempInsights] = useState<string[]>([]);
  const [formatStates, setFormatStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false
  });
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens with initial data
  useEffect(() => {
    if (open && initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setDomain(initialData.domain_id);
      setDate(new Date(initialData.entry_date));
      if (contentRef.current) {
        contentRef.current.innerHTML = initialData.content;
      }
    } else if (open && !initialData) {
      setTitle("");
      setContent("");
      setDomain(defaultDomain || "");
      setDate(new Date());
      setTempInsights([]);
      setInsightMode(false);
      setSelectedText("");
      setShowInsightPopup(false);
      if (contentRef.current) {
        contentRef.current.innerHTML = "";
      }
    }
  }, [open, initialData, defaultDomain]);

  const applyFormat = (command: string) => {
    document.execCommand(command, false);
    contentRef.current?.focus();
    updateFormatStates();
  };

  const updateFormatStates = () => {
    setFormatStates({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough')
    });
  };

  const handleTextSelection = () => {
    console.log('handleTextSelection called, insightMode:', insightMode);
    
    if (!insightMode) {
      console.log('insightMode is false, returning');
      return;
    }
    
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    
    console.log('Selected text:', text, 'length:', text?.length);

    if (text && text.length > 0) {
      console.log('Setting showInsightPopup to true');
      setSelectedText(text);
      setShowInsightPopup(true);
    } else {
      console.log('No text selected or empty');
    }
  };

  const handleConfirmInsight = () => {
    if (selectedText && !tempInsights.includes(selectedText)) {
      setTempInsights(prev => [...prev, selectedText]);
      
      // Wrap selected text with insight span
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'insight-highlight';
        span.textContent = selectedText;
        range.deleteContents();
        range.insertNode(span);
      }
      
      toast({
        title: "Insight ajouté",
        description: "Le texte a été ajouté aux insights",
      });
    }
    setShowInsightPopup(false);
    setSelectedText("");
    setInsightMode(false);
    window.getSelection()?.removeAllRanges();
  };

  const handleCancelInsight = () => {
    setShowInsightPopup(false);
    setSelectedText("");
    setInsightMode(false);
    window.getSelection()?.removeAllRanges();
  };

  const handleSubmit = async () => {
    const contentText = contentRef.current?.innerText || "";
    
    if (!title.trim() || !contentText.trim() || !domain) {
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
            content: contentText.trim(),
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
            content: contentText.trim(),
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
              <div className="flex items-center gap-2">
                {/* Formatting toolbar */}
                <div className="flex items-center gap-1 backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-lg px-2 py-1">
                  <button
                    type="button"
                    onClick={() => applyFormat('bold')}
                    className={`p-1.5 rounded transition-all ${
                      formatStates.bold
                        ? 'bg-white/[0.12] border border-white/[0.1] shadow-[0_0_10px_rgba(255,255,255,0.15)]'
                        : 'hover:bg-white/[0.08]'
                    }`}
                    title="Gras"
                  >
                    <Bold className={`w-3.5 h-3.5 transition-colors ${
                      formatStates.bold ? 'text-white' : 'text-white/60 hover:text-white/90'
                    }`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('italic')}
                    className={`p-1.5 rounded transition-all ${
                      formatStates.italic
                        ? 'bg-white/[0.12] border border-white/[0.1] shadow-[0_0_10px_rgba(255,255,255,0.15)]'
                        : 'hover:bg-white/[0.08]'
                    }`}
                    title="Italique"
                  >
                    <Italic className={`w-3.5 h-3.5 transition-colors ${
                      formatStates.italic ? 'text-white' : 'text-white/60 hover:text-white/90'
                    }`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('underline')}
                    className={`p-1.5 rounded transition-all ${
                      formatStates.underline
                        ? 'bg-white/[0.12] border border-white/[0.1] shadow-[0_0_10px_rgba(255,255,255,0.15)]'
                        : 'hover:bg-white/[0.08]'
                    }`}
                    title="Souligner"
                  >
                    <Underline className={`w-3.5 h-3.5 transition-colors ${
                      formatStates.underline ? 'text-white' : 'text-white/60 hover:text-white/90'
                    }`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('strikeThrough')}
                    className={`p-1.5 rounded transition-all ${
                      formatStates.strikeThrough
                        ? 'bg-white/[0.12] border border-white/[0.1] shadow-[0_0_10px_rgba(255,255,255,0.15)]'
                        : 'hover:bg-white/[0.08]'
                    }`}
                    title="Barrer"
                  >
                    <Strikethrough className={`w-3.5 h-3.5 transition-colors ${
                      formatStates.strikeThrough ? 'text-white' : 'text-white/60 hover:text-white/90'
                    }`} />
                  </button>
                </div>
                
                {/* Insight button */}
                <button
                  type="button"
                  id="insight-button"
                  onClick={() => {
                    const newMode = !insightMode;
                    console.log('Insight button clicked, new mode:', newMode);
                    setInsightMode(newMode);
                  }}
                  className={`group flex items-center justify-center w-9 h-9 rounded-lg transition-all ${
                    insightMode 
                      ? 'backdrop-blur-xl bg-white/[0.12] border border-white/[0.15] shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_24px_rgba(255,255,255,0.25)]' 
                      : 'backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.12]'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 transition-all ${
                    insightMode ? 'text-white' : 'text-white/50 group-hover:text-white/70'
                  }`} />
                </button>
              </div>
            </div>
            <div
              ref={contentRef}
              contentEditable
              onMouseUp={(e) => {
                console.log('onMouseUp event triggered');
                handleTextSelection();
                updateFormatStates();
              }}
              onKeyUp={updateFormatStates}
              onTouchEnd={() => {
                console.log('onTouchEnd event triggered');
                handleTextSelection();
              }}
              onInput={(e) => setContent(e.currentTarget.innerText)}
              className={`bg-white/[0.05] border border-white/[0.1] text-white min-h-[200px] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-white/20 ${
                insightMode ? 'cursor-text' : ''
              }`}
              style={{ whiteSpace: 'pre-wrap' }}
            />
            
            {showInsightPopup && insightMode && createPortal(
              <div className="fixed right-8 top-8 z-[9999] animate-scale-in pointer-events-auto">
                <div className="backdrop-blur-2xl bg-gradient-to-br from-white/20 to-white/10 border border-white/[0.15] rounded-2xl px-5 py-4 shadow-[0_8px_32px_rgba(255,255,255,0.15)] min-w-[240px]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-white text-sm font-medium">Ajouter en Insight ?</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleConfirmInsight();
                      }}
                      className="flex-1 backdrop-blur-xl bg-white/[0.12] hover:bg-white/[0.18] border border-white/[0.2] hover:border-white/[0.25] text-white text-sm font-medium px-4 py-2 rounded-xl transition-all hover:shadow-[0_0_16px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 cursor-pointer"
                    >
                      Confirmer
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCancelInsight();
                      }}
                      className="flex-1 backdrop-blur-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.15] text-white/70 hover:text-white text-sm px-4 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>,
              document.body
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
                  <SelectItem value="general" className="text-white">
                    Général
                  </SelectItem>
                  {isLoadingDomains ? (
                    <SelectItem value="loading" disabled className="text-white/50">
                      Chargement...
                    </SelectItem>
                  ) : (
                    dbDomains.map((d) => (
                      <SelectItem key={d.id} value={d.slug} className="text-white">
                        {d.name}
                      </SelectItem>
                    ))
                  )}
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
