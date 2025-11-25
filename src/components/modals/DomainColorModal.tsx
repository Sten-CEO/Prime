import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDomainColors, COLOR_PALETTE, DomainKey } from "@/hooks/useDomainColors";
import { toast } from "@/hooks/use-toast";

interface DomainColorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DomainColorModal = ({ open, onOpenChange }: DomainColorModalProps) => {
  const { getAllDomains, setDomainColor } = useDomainColors();
  const [step, setStep] = useState<'select-domain' | 'select-color'>('select-domain');
  const [selectedDomain, setSelectedDomain] = useState<DomainKey | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');

  const handleDomainSelect = (domain: DomainKey, currentColor: string) => {
    setSelectedDomain(domain);
    setSelectedColor(currentColor);
    setStep('select-color');
  };

  const handleSave = () => {
    if (selectedDomain && selectedColor) {
      setDomainColor(selectedDomain, selectedColor);
      toast({
        title: "Couleur mise à jour",
        description: "La couleur du domaine a été modifiée",
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setStep('select-domain');
    setSelectedDomain(null);
    setSelectedColor('');
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep('select-domain');
    setSelectedDomain(null);
  };

  const domains = getAllDomains();
  const currentDomain = domains.find(d => d.domain === selectedDomain);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-black/95 backdrop-blur-xl border border-white/[0.1] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            {step === 'select-domain' ? 'Choisir un domaine' : `Choisir une couleur`}
          </DialogTitle>
          {step === 'select-color' && currentDomain && (
            <p className="text-white/50 text-sm">{currentDomain.label}</p>
          )}
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 'select-domain' ? (
            <div className="space-y-2">
              {domains.map((domain) => (
                <button
                  key={domain.domain}
                  onClick={() => handleDomainSelect(domain.domain, domain.color)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all group"
                >
                  <span className="text-white font-medium">{domain.label}</span>
                  <div
                    className="w-8 h-8 rounded-lg border-2 border-white/20 group-hover:border-white/40 transition-all"
                    style={{ backgroundColor: `hsl(${domain.color})` }}
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-2">
                {COLOR_PALETTE.map((colorOption) => (
                  <button
                    key={colorOption.name}
                    onClick={() => setSelectedColor(colorOption.value)}
                    className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] ${
                      selectedColor === colorOption.value
                        ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-105'
                        : 'border-white/20'
                    }`}
                    style={{ backgroundColor: `hsl(${colorOption.value})` }}
                    title={colorOption.name}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 bg-white/[0.03] border-white/[0.08] text-white hover:bg-white/[0.08]"
                >
                  Retour
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-white/[0.08] border border-white/[0.12] text-white hover:bg-white/[0.12] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
