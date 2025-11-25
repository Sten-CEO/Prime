import { useParams, useNavigate } from "react-router-dom";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { Home, Award, BookOpen, Target, User, Settings, Plus, PenSquare, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { DomainHighBar } from "@/components/DomainHighBar";
import { useDomains } from "@/hooks/useDomains";
import { useMetrics } from "@/hooks/useMetrics";
import { useFreePerformances } from "@/hooks/useFreePerformances";
import { useCategories } from "@/hooks/useCategories";
import { useState } from "react";
import { AddMetricModal } from "@/components/modals/AddMetricModal";
import { AddFreePerformanceModal } from "@/components/modals/AddFreePerformanceModal";
import { Skeleton } from "@/components/ui/skeleton";

const DomainPerformances = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { domains, isLoading: domainsLoading } = useDomains();
  const domain = domains.find(d => d.slug === slug);
  const { categories, isLoading: categoriesLoading } = useCategories(domain?.id);
  
  // Get all metrics for this domain
  const [showAddMetricModal, setShowAddMetricModal] = useState(false);
  const [showAddPerformanceModal, setShowAddPerformanceModal] = useState(false);

  // We'll fetch all metrics/performances for all categories in this domain
  const allMetrics: any[] = [];
  const allPerformances: any[] = [];

  const isLoading = domainsLoading || categoriesLoading;

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
      {/* Background image */}
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
      
      {/* Content */}
      <div className="relative z-10 ml-32 min-h-screen">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          {/* High Bar */}
          <DomainHighBar currentDomain={slug || ""} />

          {/* Page Title */}
          <div className="mb-8 mt-6">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Performances - {domain.name}
            </h1>
            <p className="text-white/50 text-sm mt-2">
              Gérez toutes vos métriques et performances libres pour ce domaine
            </p>
          </div>

          {/* Metrics Section */}
          <div className="mb-8">
            <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Métriques Programmées</h3>
                <Button
                  size="sm"
                  onClick={() => setShowAddMetricModal(true)}
                  className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all text-white h-8 px-3"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {categories.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-white/40 text-sm">Aucune catégorie créée</p>
                    <p className="text-white/30 text-xs mt-1">Créez d'abord des catégories pour ce domaine</p>
                  </div>
                ) : (
                  categories.map(category => (
                    <CategoryMetricsSection 
                      key={category.id}
                      categoryId={category.id}
                      categoryName={category.name}
                      domainId={domain.id}
                    />
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Free Performances Section */}
          <div className="mb-8">
            <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Performances Libres</h3>
                <Button
                  size="sm"
                  onClick={() => setShowAddPerformanceModal(true)}
                  className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all text-white h-8 px-3"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {categories.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-white/40 text-sm">Aucune catégorie créée</p>
                    <p className="text-white/30 text-xs mt-1">Créez d'abord des catégories pour ce domaine</p>
                  </div>
                ) : (
                  categories.map(category => (
                    <CategoryPerformancesSection 
                      key={category.id}
                      categoryId={category.id}
                      categoryName={category.name}
                      domainId={domain.id}
                    />
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <AddMetricModal
        open={showAddMetricModal}
        onOpenChange={setShowAddMetricModal}
        onAdd={(data) => {
          // This will need to be implemented with category selection
          console.log("Add metric:", data);
        }}
      />

      <AddFreePerformanceModal
        open={showAddPerformanceModal}
        onOpenChange={setShowAddPerformanceModal}
        onAdd={(data) => {
          // This will need to be implemented with category selection
          console.log("Add performance:", data);
        }}
      />
    </div>
  );
};

// Helper component for rendering metrics per category
const CategoryMetricsSection = ({ categoryId, categoryName, domainId }: { categoryId: string; categoryName: string; domainId: string }) => {
  const { metrics, isLoading, updateMetric, deleteMetric } = useMetrics(categoryId);

  if (isLoading) {
    return <Skeleton className="h-20 bg-white/5" />;
  }

  if (metrics.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-white/40 uppercase tracking-wide">{categoryName}</p>
      {metrics.map((metric) => (
        <div key={metric.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] transition-all group">
          <div className="flex-1">
            <p className="text-sm text-white/80">{metric.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={metric.is_active}
              onCheckedChange={() => updateMetric({ id: metric.id, is_active: !metric.is_active })}
            />
            <button
              onClick={() => deleteMetric(metric.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/[0.05]"
            >
              <Trash2 className="w-3.5 h-3.5 text-white/60" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper component for rendering free performances per category
const CategoryPerformancesSection = ({ categoryId, categoryName, domainId }: { categoryId: string; categoryName: string; domainId: string }) => {
  const { freePerformances, isLoading, deleteFreePerformance } = useFreePerformances(categoryId);

  if (isLoading) {
    return <Skeleton className="h-20 bg-white/5" />;
  }

  if (freePerformances.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-white/40 uppercase tracking-wide">{categoryName}</p>
      {freePerformances.map((perf) => (
        <div key={perf.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] transition-all group">
          <div className="flex-1">
            <p className="text-sm text-white/80">{perf.name}</p>
          </div>
          <button
            onClick={() => deleteFreePerformance(perf.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/[0.05]"
          >
            <Trash2 className="w-3.5 h-3.5 text-white/60" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default DomainPerformances;
