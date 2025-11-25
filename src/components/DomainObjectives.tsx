import { PrimeTargetCard } from "@/components/targets/PrimeTargetCard";
import { Plus, Loader2 } from "lucide-react";
import { useObjectives } from "@/hooks/useObjectives";
import { useDomainSlugToId } from "@/hooks/useDomainSlugToId";

interface DomainObjectivesProps {
  domainSlug: string;
  onAddObjective?: () => void;
}

export const DomainObjectives = ({ domainSlug, onAddObjective }: DomainObjectivesProps) => {
  const { data: domainId } = useDomainSlugToId(domainSlug);
  const { objectives, isLoading, updateObjective, deleteObjective } = useObjectives(domainId || undefined);

  const getDomainLabel = (slug: string) => {
    const domains: Record<string, string> = {
      business: "Business",
      sport: "Sport",
      social: "Social",
      sante: "Santé",
    };
    return domains[slug] || slug;
  };

  // Filter only active objectives (not completed or archived)
  const activeObjectives = objectives.filter(
    obj => !["completed", "archived"].includes(obj.status)
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white ml-2">Objectifs Actifs</h3>
        </div>
        <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-xl p-8 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-white/40 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white ml-2">Objectifs Actifs</h3>
        <button 
          onClick={onAddObjective}
          className="flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all text-white/70 hover:text-white text-sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {activeObjectives.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-xl p-8 text-center">
          <p className="text-white/40 mb-4">Aucun objectif actif pour ce domaine</p>
          <button 
            onClick={onAddObjective}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all text-white/70 hover:text-white text-sm"
          >
            <Plus className="w-4 h-4" />
            Créer un objectif
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {activeObjectives.map((objective) => (
            <PrimeTargetCard
              key={objective.id}
              target={{
                id: objective.id,
                title: objective.title,
                description: objective.description || "",
                domain: domainSlug,
                category: objective.category_id || undefined,
                startDate: objective.start_date,
                deadline: objective.deadline,
                progress: objective.progress,
                importance: objective.importance,
                status: objective.status as any,
                showOnHome: objective.show_on_home,
              }}
              onView={() => {}}
              onComplete={() => {
                updateObjective({
                  id: objective.id,
                  progress: 100,
                  status: "completed",
                  completed_at: new Date().toISOString(),
                });
              }}
              onArchive={() => {
                updateObjective({
                  id: objective.id,
                  status: "archived",
                  archived_at: new Date().toISOString(),
                });
              }}
              onDelete={() => deleteObjective(objective.id)}
              onEdit={() => {}}
              getDomainLabel={getDomainLabel}
            />
          ))}
        </div>
      )}
    </div>
  );
};
