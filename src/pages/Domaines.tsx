import { useParams, useNavigate, useLocation } from "react-router-dom";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { Home, Award, BookOpen, Target, User, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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

  if (!domain) {
    return (
      <div className="relative min-h-screen w-full bg-black">
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="relative z-10 ml-32 min-h-screen flex items-center justify-center">
          <div className="text-white text-2xl">Domaine non trouvé</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Background image - fixed */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Glass Sidebar */}
      <div className="fixed left-6 top-6 bottom-6 w-20 z-20">
        <div className="h-full backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.08] flex flex-col items-center py-6 px-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
          <div className="mb-4">
            <span className="text-white font-bold text-lg tracking-tight">Prime.</span>
          </div>
          
          <Separator className="w-10 bg-white/20 mb-8" />
          
          <div className="flex-none">
            <button 
              onClick={() => navigate("/accueil")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Home className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <Separator className="w-10 bg-white/20 mx-auto my-4" />
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.08] transition-colors">
              <Award className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button 
              onClick={() => navigate("/journal")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button 
              onClick={() => navigate("/prime-targets")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Target className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <Separator className="w-10 bg-white/20 mx-auto my-2" />
          </div>
          
          <div className="flex-none flex flex-col gap-4 mt-8">
            <button 
              onClick={() => navigate("/profil")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <User className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button 
              onClick={() => navigate("/parametres")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Settings className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content - scrollable */}
      <div className="relative z-10 ml-32 min-h-screen">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          {/* High Bar */}
          <DomainHighBar currentDomain={slug || ""} />

          {/* Domain Title */}
          <div className="mb-8 mt-6 flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              {domain.name}
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
              domainName={domain.name}
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
