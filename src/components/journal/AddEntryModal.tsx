import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AddEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDomain?: string;
  onSuccess?: () => void;
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

export const AddEntryModal = ({ open, onOpenChange, defaultDomain, onSuccess }: AddEntryModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [domain, setDomain] = useState(defaultDomain || "");
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

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
          description: "Vous devez être connecté pour créer une entrée",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("journal_entries").insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        domain_id: domain,
        entry_date: format(date, "yyyy-MM-dd"),
      });

      if (error) throw error;

      toast({
        title: "Entrée créée",
        description: "Votre entrée de journal a été enregistrée",
      });

      setTitle("");
      setContent("");
      setDomain(defaultDomain || "");
      setDate(new Date());
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating entry:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'entrée",
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
            Nouvelle entrée de journal
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

          <div>
            <label className="text-sm text-white/70 mb-2 block">Contenu</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Écrivez votre entrée..."
              className="bg-white/[0.05] border-white/[0.1] text-white min-h-[200px]"
            />
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
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-white/[0.05] border-white/[0.1] text-white hover:bg-white/[0.08]"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "d MMMM yyyy", { locale: fr })}
                  </Button>
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
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/[0.1] text-white hover:bg-white/[0.05]"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
