import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { useDomains } from "@/hooks/useDomains";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ManageDomainsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManageDomainsModal = ({ open, onOpenChange }: ManageDomainsModalProps) => {
  const { domains, isLoading, deleteDomain } = useDomains();
  const [domainToDelete, setDomainToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (domainToDelete) {
      deleteDomain(domainToDelete);
      setDomainToDelete(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-black/95 border-white/[0.08] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Gérer les domaines</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-4 max-h-[500px] overflow-y-auto">
            {isLoading ? (
              <>
                <Skeleton className="h-16 bg-white/[0.05]" />
                <Skeleton className="h-16 bg-white/[0.05]" />
                <Skeleton className="h-16 bg-white/[0.05]" />
              </>
            ) : domains.length === 0 ? (
              <div className="text-center py-8 text-white/50">
                Aucun domaine créé
              </div>
            ) : (
              domains.map((domain) => (
                <div
                  key={domain.id}
                  className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl hover:bg-white/[0.05] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `hsl(${domain.color || "210 100% 60%"})` }}
                    >
                      <span className="text-white font-semibold">
                        {domain.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{domain.name}</p>
                      <p className="text-white/50 text-xs">/{domain.slug}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDomainToDelete(domain.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!domainToDelete} onOpenChange={() => setDomainToDelete(null)}>
        <AlertDialogContent className="bg-black/95 border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Supprimer ce domaine ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Cette action est irréversible. Toutes les données associées (métriques, performances, catégories, journaux) seront définitivement supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/[0.05] border-white/[0.1] text-white hover:bg-white/[0.08]">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
