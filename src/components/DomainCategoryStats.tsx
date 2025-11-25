import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Check, X, Star, Target, Flame, Trophy } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCategoryStats } from "@/hooks/useCategoryStats";
import { useDomainSlugToId } from "@/hooks/useDomainSlugToId";
import { Skeleton } from "@/components/ui/skeleton";

export const DomainCategoryStats = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  // Convertir slug en domain_id
  const { data: domainId, isLoading: isLoadingDomain } = useDomainSlugToId(slug || "");
  const { data: categories, isLoading: isLoadingStats } = useCategoryStats(domainId || "");
  
  const isLoading = isLoadingDomain || isLoadingStats;

  if (isLoading) {
    return (
      <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] h-full flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-4">Statistiques Catégorie</h3>
        <div className="space-y-4">
          <Skeleton className="h-40 bg-white/[0.05]" />
          <Skeleton className="h-40 bg-white/[0.05]" />
        </div>
      </Card>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] h-full flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-4">Statistiques Catégorie</h3>
        <p className="text-sm text-white/60">Aucune catégorie trouvée pour ce domaine.</p>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">Statistiques Catégorie</h3>
      
      <div className="space-y-6 mb-6">
        {categories.map((cat) => (
          <div key={cat.categoryId} className="space-y-3">
            <h4 className="text-sm font-semibold text-white/90 mb-2">{cat.categoryName}</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center gap-1 mb-0.5">
                  <TrendingUp className="w-2.5 h-2.5 text-white" />
                  <p className="text-[9px] text-white/60 uppercase tracking-wide">Indice 7j</p>
                </div>
                <p className="text-base font-bold text-white">{cat.avgScore7d}</p>
              </div>
              
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center gap-1 mb-0.5">
                  <TrendingUp className="w-2.5 h-2.5 text-white" />
                  <p className="text-[9px] text-white/60 uppercase tracking-wide">Indice 30j</p>
                </div>
                <p className="text-base font-bold text-white">{cat.avgScore30d}</p>
              </div>

              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center gap-1 mb-0.5">
                  <Check className="w-2.5 h-2.5 text-success" />
                  <p className="text-[9px] text-white/60 uppercase tracking-wide">Remplis</p>
                </div>
                <p className="text-base font-bold text-success">{cat.filledDaysPercent}%</p>
              </div>

              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center gap-1 mb-0.5">
                  <X className="w-2.5 h-2.5 text-red-500" />
                  <p className="text-[9px] text-white/60 uppercase tracking-wide">Non remplis</p>
                </div>
                <p className="text-base font-bold text-red-500">{cat.emptyDaysPercent}%</p>
              </div>

              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center gap-1 mb-0.5">
                  <Star className="w-2.5 h-2.5 text-white" />
                  <p className="text-[9px] text-white/60 uppercase tracking-wide">Meilleur</p>
                </div>
                <p className="text-xs font-bold text-white">{cat.bestDay.day} <span className="text-[10px] text-white/60">{cat.bestDay.score}</span></p>
              </div>

              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center gap-1 mb-0.5">
                  <Star className="w-2.5 h-2.5 text-white/60" />
                  <p className="text-[9px] text-white/60 uppercase tracking-wide">Pire</p>
                </div>
                <p className="text-xs font-bold text-white/60">{cat.worstDay.day} <span className="text-[10px] text-white/50">{cat.worstDay.score}</span></p>
              </div>

              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center gap-1 mb-0.5">
                  <Target className="w-2.5 h-2.5 text-white" />
                  <p className="text-[9px] text-white/60 uppercase tracking-wide">Métriques</p>
                </div>
                <p className="text-base font-bold text-white">{cat.metricsCompletionRate}%</p>
              </div>

              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center gap-1 mb-0.5">
                  <Trophy className="w-2.5 h-2.5 text-white" />
                  <p className="text-[9px] text-white/60 uppercase tracking-wide">Perfs notées</p>
                </div>
                <p className="text-base font-bold text-white">{cat.performancesCount}</p>
              </div>

              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.08] col-span-2">
                <div className="flex items-center gap-1 mb-0.5">
                  <Flame className={`w-2.5 h-2.5 ${cat.currentStreak >= 3 ? "text-orange-500" : "text-white/40"}`} />
                  <p className="text-[9px] text-white/60 uppercase tracking-wide">Discipline</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-white/80">
                    Série: <span className={`font-bold ${cat.currentStreak >= 3 ? "text-orange-500" : "text-white/50"}`}>
                      {cat.currentStreak >= 3 ? cat.currentStreak : 0}
                    </span>j
                  </p>
                  <p className="text-xs text-white/80">
                    Max: <span className="font-bold text-white">{cat.maxStreak}</span>j
                  </p>
                  <p className="text-xs text-white/80">
                    Bonus: <span className={`font-bold ${cat.disciplineBonus > 0 ? "text-success" : "text-white/50"}`}>
                      +{cat.disciplineBonus}
                    </span>
                  </p>
                </div>
                {cat.currentStreak > 0 && cat.currentStreak < 3 && (
                  <p className="text-[9px] text-white/40 mt-1">
                    Encore {3 - cat.currentStreak}j pour activer le bonus
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Button
        onClick={() => navigate("/journal")}
        className="w-full backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all text-white gap-2 mt-auto"
      >
        <BookOpen className="w-4 h-4" />
        Aller vers le journal
      </Button>
    </Card>
  );
};
