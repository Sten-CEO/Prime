import { useParams, useNavigate } from "react-router-dom";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/Sidebar";
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
      <Sidebar />
      
      {/* Content */}
      <div className="relative z-10 ml-32 min-h-screen">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          {/* High Bar */}
          <DomainHighBar currentDomain={slug || ""} isPerformancePage={true} />

          {/* Page Title */}
          <div className="mb-8 mt-6">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Performances - {domain.name}
            </h1>
            <p className="text-white/50 text-sm mt-2">
              Gérez toutes vos métriques et performances libres pour ce domaine
            </p>
          </div>

          {/* Two Column Layout: Metrics + Free Performances */}
          <div className="grid grid-cols-2 gap-8">
            {/* Metrics Section */}
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

            {/* Free Performances Section */}
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
        onAdd={() => {}}
        domainId={domain.id}
        categories={categories}
      />

      <AddFreePerformanceModal
        open={showAddPerformanceModal}
        onOpenChange={setShowAddPerformanceModal}
        onAdd={() => {}}
        domainId={domain.id}
        categories={categories}
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

  // Group metrics by week
  const groupedMetrics = groupByWeek(metrics);

  return (
    <div className="space-y-2">
      <p className="text-xs text-white/40 uppercase tracking-wide">{categoryName}</p>
      {groupedMetrics.map((group, groupIndex) => (
        <div key={groupIndex}>
          {group.map((metric) => (
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
          {groupIndex < groupedMetrics.length - 1 && (
            <Separator className="my-3 bg-white/10" />
          )}
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

  // Group performances by week
  const groupedPerformances = groupByWeek(freePerformances);

  return (
    <div className="space-y-2">
      <p className="text-xs text-white/40 uppercase tracking-wide">{categoryName}</p>
      {groupedPerformances.map((group, groupIndex) => (
        <div key={groupIndex}>
          {group.map((perf) => (
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
          {groupIndex < groupedPerformances.length - 1 && (
            <Separator className="my-3 bg-white/10" />
          )}
        </div>
      ))}
    </div>
  );
};

// Utility function to group items by week
function groupByWeek<T extends { created_at: string }>(items: T[]): T[][] {
  if (items.length === 0) return [];

  const sorted = [...items].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const groups: T[][] = [];
  let currentGroup: T[] = [];
  let currentWeek: number | null = null;

  sorted.forEach(item => {
    const itemDate = new Date(item.created_at);
    const weekNumber = getWeekNumber(itemDate);

    if (currentWeek === null || currentWeek === weekNumber) {
      currentGroup.push(item);
      currentWeek = weekNumber;
    } else {
      groups.push(currentGroup);
      currentGroup = [item];
      currentWeek = weekNumber;
    }
  });

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

// Get ISO week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export default DomainPerformances;
