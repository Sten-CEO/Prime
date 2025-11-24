import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Check, X, Star, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DomainCategoryStats = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Score moyen 7j", value: "84", suffix: "/100", icon: TrendingUp, color: "text-white" },
    { label: "Score moyen 30j", value: "81", suffix: "/100", icon: TrendingUp, color: "text-white" },
    { label: "Jours remplis", value: "73", suffix: "%", icon: Check, color: "text-success" },
    { label: "Jours non remplis", value: "27", suffix: "%", icon: X, color: "text-red-500" },
    { label: "Meilleur jour", value: "Lun", suffix: " 92/100", icon: Star, color: "text-white" },
    { label: "Pire jour", value: "Mer", suffix: " 68/100", icon: Star, color: "text-white/60" },
    { label: "Progression", value: "+12", suffix: "%", icon: TrendingUp, color: "text-success" },
    { label: "Métriques complètes", value: "85", suffix: "%", icon: Target, color: "text-white" },
  ];

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">Statistiques Catégorie</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`w-3 h-3 ${stat.color}`} />
                <p className="text-[10px] text-white/60 uppercase tracking-wide">{stat.label}</p>
              </div>
              <p className={`text-xl font-bold ${stat.color}`}>
                {stat.value}<span className="text-sm text-white/60">{stat.suffix}</span>
              </p>
            </div>
          );
        })}
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
