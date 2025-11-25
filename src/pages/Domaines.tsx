import { useParams, useNavigate, useLocation } from "react-router-dom";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { Award, BookOpen } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { DomainHighBar } from "@/components/DomainHighBar";
import { DomainScoreChart } from "@/components/DomainScoreChart";
import { DomainPerformances } from "@/components/DomainPerformances";
import { DomainCategoryStats } from "@/components/DomainCategoryStats";
import { DomainMetrics } from "@/components/DomainMetrics";
import { DomainObjectives } from "@/components/DomainObjectives";
import { CreateTargetModal } from "@/components/targets/CreateTargetModal";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useDomains } from "@/hooks/useDomains";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

const Domaines = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { domains, isLoading } = useDomains();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const domain = domains.find(d => d.slug === slug);
  const { categories } = useCategories(domain?.id);

  // Map categories to the format expected by DomainScoreChart
  const mappedCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    color: cat.color || undefined,
    score: 0,
  }));

  const handleCreateTarget = (target: any) => {
    toast({
      title: "Objectif créé",
      description: "Le nouvel objectif a été ajouté avec succès",
    });
    setShowCreateModal(false);
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen w-full bg-black">
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="relative z-10 ml-32 min-h-screen flex items-center justify-center">
          <Skeleton className="w-64 h-8 bg-white/10" />
        </div>
      </div>
    );
  }

  // Allow page to render even if domain data hasn't loaded yet
  const domainName = domain?.name || (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Domaine");

  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Background image - fixed */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Glass Sidebar */}
      <Sidebar />
      
      {/* Content - scrollable */}
      <div className="relative z-10 ml-32 min-h-screen">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          {/* High Bar */}
          <DomainHighBar currentDomain={slug || ""} />

          {/* Domain Title */}
          <div className="mb-8 mt-6 flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              {domainName}
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/domaines/${slug}/performances`)}
                className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl px-6 py-3 hover:bg-white/[0.04] hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-white/70" />
                <span className="text-white text-sm font-medium">Performances</span>
              </button>
              <button
                onClick={() => navigate(`/journal/${slug}`)}
                className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl px-6 py-3 hover:bg-white/[0.04] hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-white/70" />
                <span className="text-white text-sm font-medium">Aller vers le journal</span>
              </button>
            </div>
          </div>

          {/* Objectives */}
          <div className="mb-8">
            <DomainObjectives 
              domainSlug={slug || ""}
              onAddObjective={() => setShowCreateModal(true)}
            />
          </div>

          {/* Score + Chart + Category Stats */}
          <div className="grid grid-cols-[1fr_auto] gap-8">
            <DomainScoreChart
              domainName={domainName}
              domainSlug={slug || ""}
              score={0}
              variation="+0%"
              categories={mappedCategories}
            />
            <div className="w-[400px]">
              <DomainCategoryStats />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de création d'objectif */}
      <CreateTargetModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSave={handleCreateTarget}
        defaultDomain={slug}
      />
    </div>
  );
};

export default Domaines;
