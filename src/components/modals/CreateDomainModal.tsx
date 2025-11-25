import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Briefcase, Dumbbell, Users, Heart, GraduationCap, DollarSign, 
  Target, Book, Music, Palette, Code, Coffee, Star, Zap 
} from "lucide-react";
import { useDomains } from "@/hooks/useDomains";

const ICON_OPTIONS = [
  { name: "briefcase", icon: Briefcase, label: "Business" },
  { name: "dumbbell", icon: Dumbbell, label: "Sport" },
  { name: "users", icon: Users, label: "Social" },
  { name: "heart", icon: Heart, label: "Santé" },
  { name: "graduation-cap", icon: GraduationCap, label: "Éducation" },
  { name: "dollar-sign", icon: DollarSign, label: "Finance" },
  { name: "target", icon: Target, label: "Objectifs" },
  { name: "book", icon: Book, label: "Lecture" },
  { name: "music", icon: Music, label: "Musique" },
  { name: "palette", icon: Palette, label: "Créativité" },
  { name: "code", icon: Code, label: "Tech" },
  { name: "coffee", icon: Coffee, label: "Lifestyle" },
  { name: "star", icon: Star, label: "Excellence" },
  { name: "zap", icon: Zap, label: "Énergie" },
];

const COLOR_OPTIONS = [
  { name: "Bleu", value: "210 100% 60%" },
  { name: "Vert", value: "142 90% 55%" },
  { name: "Violet", value: "271 100% 72%" },
  { name: "Rose", value: "330 100% 70%" },
  { name: "Orange", value: "25 100% 60%" },
  { name: "Cyan", value: "180 100% 60%" },
  { name: "Rouge", value: "0 100% 65%" },
  { name: "Jaune", value: "45 100% 60%" },
  { name: "Indigo", value: "240 100% 70%" },
  { name: "Turquoise", value: "165 100% 60%" },
  { name: "Magenta", value: "300 100% 70%" },
  { name: "Lime", value: "80 90% 55%" },
];

interface CreateDomainModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateDomainModal = ({ open, onOpenChange }: CreateDomainModalProps) => {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("briefcase");
  const [selectedColor, setSelectedColor] = useState("210 100% 60%");
  const { createDomain } = useDomains();

  const handleSave = () => {
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    // Ensure slug is not empty
    if (!slug) {
      console.error("Cannot create domain: slug is empty after sanitization");
      return;
    }
    
    createDomain({
      name: name.trim(),
      slug,
      icon: selectedIcon,
      color: selectedColor,
    });

    setName("");
    setSelectedIcon("briefcase");
    setSelectedColor("210 100% 60%");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border-white/[0.08] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Créer un nouveau domaine</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Nom */}
          <div>
            <Label className="text-white/70 text-sm">Nom du domaine</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Développement personnel"
              className="bg-white/[0.05] border-white/[0.1] text-white mt-2"
            />
          </div>

          {/* Icône */}
          <div>
            <Label className="text-white/70 text-sm mb-3 block">Icône</Label>
            <div className="grid grid-cols-7 gap-2">
              {ICON_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.name}
                    onClick={() => setSelectedIcon(option.name)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      selectedIcon === option.name
                        ? "bg-white/[0.15] border-2 border-white/[0.3]"
                        : "bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.08]"
                    }`}
                    title={option.label}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Couleur */}
          <div>
            <Label className="text-white/70 text-sm mb-3 block">Couleur</Label>
            <div className="grid grid-cols-6 gap-3">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.value)}
                  className={`h-10 rounded-lg transition-all ${
                    selectedColor === color.value
                      ? "ring-2 ring-white/[0.5] ring-offset-2 ring-offset-black scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: `hsl(${color.value})` }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-white/[0.05] border-white/[0.1] text-white hover:bg-white/[0.08]"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex-1 bg-white/[0.1] border-white/[0.15] text-white hover:bg-white/[0.15]"
            >
              Créer le domaine
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
