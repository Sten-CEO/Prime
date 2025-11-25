import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, TrendingUp, Check, X, Flame } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCategoryStats } from "@/hooks/useCategoryStats";
import { useDomainSlugToId } from "@/hooks/useDomainSlugToId";
import { Skeleton } from "@/components/ui/skeleton";

export const DomainCategoryStats = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: domainId, isLoading: isLoadingDomain } = useDomainSlugToId(slug || "");
  const { data: categories, isLoading: isLoadingStats } = useCategoryStats(domainId || "");
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const isLoading = isLoadingDomain || isLoadingStats;

  if (isLoading) {
    return (
      <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] h-full">
        <h3 className="text-lg font-semibold text-white mb-4">Statistiques Catégorie</h3>
        <Skeleton className="h-32 bg-white/[0.05]" />
      </Card>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] h-full">
        <h3 className="text-lg font-semibold text-white mb-4">Statistiques Catégorie</h3>
        <p className="text-sm text-white/60">Aucune catégorie trouvée pour ce domaine.</p>
      </Card>
    );
  }

  const currentCategory = categories[currentIndex];
  const hasMultiple = categories.length > 1;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  };

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Statistiques Catégorie</h3>
        {hasMultiple && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handlePrevious}
              className="h-7 w-7 p-0 hover:bg-white/[0.05]"
            >
              <ChevronLeft className="w-4 h-4 text-white/60" />
            </Button>
            <span className="text-xs text-white/40">{currentIndex + 1}/{categories.length}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleNext}
              className="h-7 w-7 p-0 hover:bg-white/[0.05]"
            >
              <ChevronRight className="w-4 h-4 text-white/60" />
            </Button>
          </div>
        )}
      </div>

      <h4 className="text-base font-semibold text-white/90 mb-4">{currentCategory.categoryName}</h4>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.08]">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3 h-3 text-white" />
            <p className="text-[10px] text-white/60 uppercase tracking-wide">Indice 7j</p>
          </div>
          <p className="text-xl font-bold text-white">{currentCategory.avgScore7d}</p>
        </div>
        
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.08]">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3 h-3 text-white" />
            <p className="text-[10px] text-white/60 uppercase tracking-wide">Indice 30j</p>
          </div>
          <p className="text-xl font-bold text-white">{currentCategory.avgScore30d}</p>
        </div>

        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.08]">
          <div className="flex items-center gap-1.5 mb-1">
            <Check className="w-3 h-3 text-success" />
            <p className="text-[10px] text-white/60 uppercase tracking-wide">Remplis</p>
          </div>
          <p className="text-xl font-bold text-success">{currentCategory.filledDaysPercent}%</p>
        </div>

        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.08]">
          <div className="flex items-center gap-1.5 mb-1">
            <X className="w-3 h-3 text-red-500" />
            <p className="text-[10px] text-white/60 uppercase tracking-wide">Vides</p>
          </div>
          <p className="text-xl font-bold text-red-500">{currentCategory.emptyDaysPercent}%</p>
        </div>

        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] col-span-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Flame className={`w-3 h-3 ${currentCategory.currentStreak >= 3 ? "text-orange-500" : "text-white/40"}`} />
            <p className="text-[10px] text-white/60 uppercase tracking-wide">Discipline</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-white/80">
              Série: <span className={`font-bold ${currentCategory.currentStreak >= 3 ? "text-orange-500" : "text-white/50"}`}>
                {currentCategory.currentStreak >= 3 ? currentCategory.currentStreak : 0}
              </span>j
            </p>
            <p className="text-sm text-white/80">
              Bonus: <span className={`font-bold ${currentCategory.disciplineBonus > 0 ? "text-success" : "text-white/50"}`}>
                +{currentCategory.disciplineBonus}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
