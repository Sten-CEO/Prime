import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useObjectives } from "@/hooks/useObjectives";
import { useDomainSlugToId } from "@/hooks/useDomainSlugToId";
import { useDomains } from "@/hooks/useDomains";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PrimeTarget {
  id: string;
  title: string;
  description: string;
  domain: string;
  category?: string;
  startDate: string;
  deadline: string;
  progress: number;
  importance: "low" | "normal" | "crucial";
  status: "on-track" | "at-risk" | "late" | "completed" | "archived";
  showOnHome: boolean;
  completedAt?: string;
  archivedAt?: string;
}

interface CreateTargetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (target: Omit<PrimeTarget, "id" | "status"> | PrimeTarget) => void;
  editingTarget?: PrimeTarget | null;
  defaultDomain?: string;
  defaultCategory?: string;
}

export const CreateTargetModal = ({
  open,
  onOpenChange,
  onSave,
  editingTarget,
  defaultDomain,
  defaultCategory,
}: CreateTargetModalProps) => {
  const { createObjective, updateObjective, calculateStatus } = useObjectives();
  const { domains: dbDomains, isLoading: isLoadingDomains } = useDomains();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState(defaultDomain || "");
  const [category, setCategory] = useState(defaultCategory || "");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState(0);
  const [importance, setImportance] = useState<"low" | "normal" | "crucial">("normal");
  const [showOnHome, setShowOnHome] = useState(false);
  
  const { data: domainId } = useDomainSlugToId(domain);

  useEffect(() => {
    if (editingTarget) {
      setTitle(editingTarget.title);
      setDescription(editingTarget.description);
      setDomain(editingTarget.domain);
      setCategory(editingTarget.category || "");
      setStartDate(editingTarget.startDate);
      setDeadline(editingTarget.deadline);
      setProgress(editingTarget.progress);
      setImportance(editingTarget.importance);
      setShowOnHome(editingTarget.showOnHome);
    } else {
      // Reset form
      setTitle("");
      setDescription("");
      setDomain(defaultDomain || "");
      setCategory(defaultCategory || "");
      setStartDate("");
      setDeadline("");
      setProgress(0);
      setImportance("normal");
      setShowOnHome(false);
    }
  }, [editingTarget, defaultDomain, defaultCategory, open]);

  const handleSubmit = () => {
    if (!title.trim() || !domain || !startDate || !deadline) return;

    if (!domainId) {
      console.error("Domain ID not found for slug:", domain);
      return;
    }

    const status = calculateStatus(progress, deadline);

    const objectiveData = {
      title: title.trim(),
      description: description.trim(),
      domain_id: domainId,
      category_id: null, // TODO: Map category to ID
      start_date: startDate,
      deadline,
      progress,
      importance,
      status,
      show_on_home: showOnHome,
      notes: null,
    };

    if (editingTarget) {
      // Update existing objective
      const targetData = {
        title: title.trim(),
        description: description.trim(),
        domain,
        category: category || undefined,
        startDate,
        deadline,
        progress,
        importance,
        showOnHome,
      };
      onSave({ ...editingTarget, ...targetData });
    } else {
      // Create new objective
      createObjective(objectiveData);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-xl bg-black/80 border border-white/[0.08] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editingTarget ? "Éditer l'objectif" : "Nouvel objectif Prime"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Titre */}
          <div>
            <Label className="text-xs text-white/70 mb-2 block">Titre de l'objectif *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Lancer mon entreprise SaaS"
              className="bg-white/[0.05] border-white/[0.1] text-white"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-xs text-white/70 mb-2 block">Description / Pourquoi</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décris ton objectif et pourquoi il est important..."
              className="bg-white/[0.05] border-white/[0.1] text-white min-h-[100px]"
            />
          </div>

          {/* Domaine et Catégorie */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-white/70 mb-2 block">Domaine *</Label>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger className="bg-white/[0.05] border-white/[0.1] text-white">
                  <SelectValue placeholder="Choisir un domaine" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/[0.1]">
                  {isLoadingDomains ? (
                    <SelectItem value="" disabled className="text-white/50">
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
              <Label className="text-xs text-white/70 mb-2 block">Catégorie (optionnel)</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Entrepreneuriat"
                className="bg-white/[0.05] border-white/[0.1] text-white"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-white/70 mb-2 block">Date de début *</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white/[0.05] border-white/[0.1] text-white"
              />
            </div>

            <div>
              <Label className="text-xs text-white/70 mb-2 block">Deadline *</Label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-white/[0.05] border-white/[0.1] text-white"
              />
            </div>
          </div>

          {/* Progression */}
          <div>
            <Label className="text-xs text-white/70 mb-2 block">Progression actuelle: {progress}%</Label>
            <Slider
              value={[progress]}
              onValueChange={(value) => setProgress(value[0])}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>

          {/* Importance */}
          <div>
            <Label className="text-xs text-white/70 mb-2 block">Importance</Label>
            <Select value={importance} onValueChange={(v) => setImportance(v as any)}>
              <SelectTrigger className="bg-white/[0.05] border-white/[0.1] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/[0.1]">
                <SelectItem value="low" className="text-white">Faible</SelectItem>
                <SelectItem value="normal" className="text-white">Normal</SelectItem>
                <SelectItem value="crucial" className="text-white">Crucial ⭐</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Afficher sur l'accueil */}
          <div className="flex items-center justify-between py-3 backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-xl px-4">
            <div>
              <Label className="text-sm text-white font-medium">Afficher sur l'accueil</Label>
              <p className="text-xs text-white/50 mt-1">Cet objectif apparaîtra dans le bloc Prime Targets de l'accueil</p>
            </div>
            <Switch checked={showOnHome} onCheckedChange={setShowOnHome} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => onOpenChange(false)}
              className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-xl px-6 py-2.5 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all cursor-pointer text-white text-sm font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !domain || !startDate || !deadline}
              className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-xl px-6 py-2.5 hover:bg-white/[0.12] hover:border-white/[0.15] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all cursor-pointer text-white text-sm font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {editingTarget ? "Enregistrer les modifications" : "Créer l'objectif"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
