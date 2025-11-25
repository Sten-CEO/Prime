import { useParams, useNavigate } from "react-router-dom";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DomainHighBar } from "@/components/DomainHighBar";
import { useDomains } from "@/hooks/useDomains";
import { useMetrics, type Metric } from "@/hooks/useMetrics";
import { useCategories } from "@/hooks/useCategories";
import { useFreePerformanceRecords } from "@/hooks/useFreePerformanceRecords";
import { useState } from "react";
import { AddMetricModal } from "@/components/modals/AddMetricModal";
import { AddFreePerformanceModal } from "@/components/modals/AddFreePerformanceModal";
import { MetricCard } from "@/components/MetricCard";
import { FreePerformanceCard } from "@/components/FreePerformanceCard";
import { Skeleton } from "@/components/ui/skeleton";

const DomainPerformances = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { domains, isLoading: domainsLoading } = useDomains();
  const domain = domains.find(d => d.slug === slug);
  const { categories, isLoading: categoriesLoading } = useCategories(domain?.id);
  
  const [showAddMetricModal, setShowAddMetricModal] = useState(false);
  const [showAddPerformanceModal, setShowAddPerformanceModal] = useState(false);
  const [editingMetric, setEditingMetric] = useState<any>(null);
  const [editingPerformance, setEditingPerformance] = useState<any>(null);

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

  // Allow page to render even if domain data hasn't loaded yet
  const domainName = domain?.name || (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Domaine");

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
              Performances - {domainName}
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
                    <p className="text-white/30 text-xs mt-1">Créez des catégories pour ce domaine</p>
                    <button
                      onClick={() => navigate(`/domaines/${slug}/categories`)}
                      className="mt-4 backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] rounded-xl px-4 py-2 hover:bg-white/[0.08] transition-all text-white text-xs"
                    >
                      Gérer les catégories
                    </button>
                  </div>
                ) : (
                  categories.map(category => (
                    <CategoryMetricsSection 
                      key={category.id}
                      categoryId={category.id}
                      categoryName={category.name}
                      domainId={domain?.id || ""}
                      onEditMetric={setEditingMetric}
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
                    <p className="text-white/30 text-xs mt-1">Créez des catégories pour ce domaine</p>
                    <button
                      onClick={() => navigate(`/domaines/${slug}/categories`)}
                      className="mt-4 backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] rounded-xl px-4 py-2 hover:bg-white/[0.08] transition-all text-white text-xs"
                    >
                      Gérer les catégories
                    </button>
                  </div>
                ) : (
                  categories.map(category => (
                    <CategoryPerformancesSection 
                      key={category.id}
                      categoryId={category.id}
                      categoryName={category.name}
                      domainId={domain?.id || ""}
                      onEditPerformance={setEditingPerformance}
                    />
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {domain && (
        <>
          <AddMetricModal
            open={showAddMetricModal || !!editingMetric}
            onOpenChange={(open) => {
              setShowAddMetricModal(open);
              if (!open) setEditingMetric(null);
            }}
            onAdd={() => {}}
            domainId={domain.id}
            categories={categories}
            editMetric={editingMetric}
          />

          <AddFreePerformanceModal
            open={showAddPerformanceModal || !!editingPerformance}
            onOpenChange={(open) => {
              setShowAddPerformanceModal(open);
              if (!open) setEditingPerformance(null);
            }}
            onAdd={() => {}}
            domainId={domain.id}
            categories={categories}
            editPerformance={editingPerformance}
          />
        </>
      )}
    </div>
  );
};

// Helper component for rendering metrics per category
const CategoryMetricsSection = ({ 
  categoryId, 
  categoryName, 
  domainId,
  onEditMetric 
}: { 
  categoryId: string; 
  categoryName: string; 
  domainId: string;
  onEditMetric: (metric: any) => void;
}) => {
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
            <MetricCard
              key={metric.id}
              metric={{
                ...metric,
                category_name: categoryName,
              }}
              onEdit={() => onEditMetric({
                ...metric,
                category_name: categoryName,
              })}
              onDelete={() => deleteMetric(metric.id)}
              onToggleActive={() => updateMetric({ id: metric.id, is_active: !metric.is_active })}
            />
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
const CategoryPerformancesSection = ({ 
  categoryId, 
  categoryName, 
  domainId,
  onEditPerformance 
}: { 
  categoryId: string; 
  categoryName: string; 
  domainId: string;
  onEditPerformance: (performance: any) => void;
}) => {
  const { freePerformanceRecords, isLoading, deleteFreePerformanceRecord } = useFreePerformanceRecords(domainId, categoryId);

  if (isLoading) {
    return <Skeleton className="h-20 bg-white/5" />;
  }

  if (freePerformanceRecords.length === 0) {
    return null;
  }

  // Group performances by week
  const groupedPerformances = groupByWeek(freePerformanceRecords.map(r => ({
    ...r,
    created_at: r.created_at
  })));

  return (
    <div className="space-y-2">
      <p className="text-xs text-white/40 uppercase tracking-wide">{categoryName}</p>
      {groupedPerformances.map((group, groupIndex) => (
        <div key={groupIndex}>
          {group.map((perf) => (
            <FreePerformanceCard
              key={perf.id}
              performance={{
                ...perf,
                category_name: categoryName,
              }}
              onEdit={() => onEditPerformance({
                ...perf,
                category_name: categoryName,
              })}
              onDelete={() => deleteFreePerformanceRecord(perf.id)}
            />
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
