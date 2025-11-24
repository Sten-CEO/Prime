import { Briefcase, Dumbbell, Users, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const domains = [
  { name: "business", icon: Briefcase, label: "Business" },
  { name: "sport", icon: Dumbbell, label: "Sport" },
  { name: "social", icon: Users, label: "Social" },
  { name: "sante", icon: Heart, label: "Santé" },
];

interface DomainHighBarProps {
  currentDomain: string;
}

export const DomainHighBar = ({ currentDomain }: DomainHighBarProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center gap-8 mb-8">
      <div className="flex items-center gap-3 backdrop-blur-3xl bg-white/[0.02] border border-white/[0.18] rounded-full px-6 py-3 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)]">
        {domains.map((domain) => {
          const Icon = domain.icon;
          const isActive = currentDomain === domain.name;
          return (
            <button
              key={domain.name}
              onClick={() => navigate(`/domaines/${domain.name}`)}
              className={`group relative w-10 h-10 rounded-full backdrop-blur-xl transition-all ${
                isActive
                  ? "bg-white/[0.15] border border-white/[0.3] shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  : "bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2]"
              }`}
              title={domain.label}
            >
              <Icon
                className={`w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ${
                  isActive ? "text-white" : "text-white/60 group-hover:text-white/80"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(`/accueil`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] text-white/60 hover:text-white transition-all text-xs"
          title="Retour à l'accueil"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Accueil</span>
        </button>
        <button
          onClick={() => navigate(`/domaines/${currentDomain}/categories/strategie`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] text-white/60 hover:text-white transition-all text-xs"
          title="Voir les catégories"
        >
          <span>Catégories</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
