import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Check, X, Star, Target, Flame, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CategoryStat {
  categoryId: string;
  categoryName: string;
  avgScore7d: number;
  avgScore30d: number;
  filledDaysPercent: number;
  emptyDaysPercent: number;
  bestDay: { day: string; score: number };
  worstDay: { day: string; score: number };
  metricsCompletionRate: number;
  performancesCount: number;
  currentStreak: number;
  maxStreak: number;
  disciplineBonus: number;
}

export const DomainCategoryStats = () => {
  const navigate = useNavigate();

  // TODO: Remplacer par données réelles depuis Supabase
  const categories: CategoryStat[] = [
    {
      categoryId: "strategie",
      categoryName: "Stratégie",
      avgScore7d: 142,
      avgScore30d: 138,
      filledDaysPercent: 86,
      emptyDaysPercent: 14,
      bestDay: { day: "Lun", score: 180 },
      worstDay: { day: "Mer", score: 95 },
      metricsCompletionRate: 92,
      performancesCount: 8,
      currentStreak: 5,
      maxStreak: 12,
      disciplineBonus: 2,
    },
    {
      categoryId: "execution",
      categoryName: "Exécution",
      avgScore7d: 165,
      avgScore30d: 158,
      filledDaysPercent: 93,
      emptyDaysPercent: 7,
      bestDay: { day: "Mar", score: 200 },
      worstDay: { day: "Sam", score: 110 },
      metricsCompletionRate: 88,
      performancesCount: 12,
      currentStreak: 7,
      maxStreak: 15,
      disciplineBonus: 4,
    },
  ];

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
                  <Flame className="w-2.5 h-2.5 text-orange-500" />
                  <p className="text-[9px] text-white/60 uppercase tracking-wide">Discipline</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-white/80">
                    Série: <span className="font-bold text-orange-500">{cat.currentStreak >= 3 ? cat.currentStreak : 0}</span>j
                  </p>
                  <p className="text-xs text-white/80">
                    Max: <span className="font-bold text-white">{cat.maxStreak}</span>j
                  </p>
                  <p className="text-xs text-white/80">
                    Bonus: <span className="font-bold text-success">+{cat.disciplineBonus}</span>
                  </p>
                </div>
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
