import { Card } from "@/components/ui/card";
import { Briefcase, Dumbbell, Users, Heart, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DomainHighBarProps {
  currentDomain: string;
  showCategoryNavigation?: boolean;
  onNavigateToCategory?: () => void;
}

export const DomainHighBar = ({ currentDomain, showCategoryNavigation = false, onNavigateToCategory }: DomainHighBarProps) => {
  const navigate = useNavigate();

  const domains = [
    { slug: "business", icon: Briefcase, label: "Business" },
    { slug: "sport", icon: Dumbbell, label: "Sport" },
    { slug: "social", icon: Users, label: "Social" },
    { slug: "sante", icon: Heart, label: "Santé" },
  ];

  return (
    <div className="mb-8 flex items-center justify-center gap-4">
      <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-4 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] inline-flex gap-6">
        {domains.map((domain) => {
          const Icon = domain.icon;
          const isActive = currentDomain === domain.slug;
          
          return (
            <button
              key={domain.slug}
              onClick={() => navigate(`/domaines/${domain.slug}`)}
              className={`flex flex-col items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? "bg-white/[0.12] border border-white/[0.2]"
                  : "hover:bg-white/[0.05] border border-transparent"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-white/60"}`} />
              <span className={`text-xs ${isActive ? "text-white" : "text-white/60"}`}>
                {domain.label}
              </span>
            </button>
          );
        })}
      </Card>

      {showCategoryNavigation && (
        <button
          onClick={onNavigateToCategory}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-all text-white/60 hover:text-white"
          title="Voir les catégories"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
