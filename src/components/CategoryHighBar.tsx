import { ChevronLeft, ChevronRight, Briefcase, Dumbbell, Users, Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDomains } from "@/hooks/useDomains";
import * as LucideIcons from "lucide-react";

const ICON_MAP: Record<string, any> = {
  briefcase: Briefcase,
  dumbbell: Dumbbell,
  users: Users,
  heart: Heart,
  sparkles: Sparkles,
};

interface CategoryHighBarProps {
  currentDomain: string;
  currentCategory: string;
}

export const CategoryHighBar = ({ currentDomain, currentCategory }: CategoryHighBarProps) => {
  const navigate = useNavigate();
  const { domains, isLoading } = useDomains();

  const getDomainIcon = (iconName?: string) => {
    if (!iconName) return Sparkles;
    const icon = ICON_MAP[iconName.toLowerCase()] || (LucideIcons as any)[iconName];
    return icon || Sparkles;
  };

  if (isLoading) {
    return <div className="h-16" />;
  }

  return (
    <div className="flex items-center justify-center gap-8 mb-8">
      <div className="flex items-center gap-3 backdrop-blur-3xl bg-white/[0.02] border border-white/[0.18] rounded-full px-6 py-3 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)]">
        {domains.map((domain) => {
          const Icon = getDomainIcon(domain.icon || undefined);
          const isActive = currentDomain === domain.slug;
          return (
            <button
              key={domain.id}
              onClick={() => navigate(`/domaines/${domain.slug}/categories/principale`)}
              className={`group relative w-10 h-10 rounded-full backdrop-blur-xl transition-all ${
                isActive
                  ? "bg-white/[0.15] border border-white/[0.3] shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  : "bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2]"
              }`}
              title={domain.name}
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
          onClick={() => navigate(`/domaines/${currentDomain}`)}
          className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-all hover:scale-110"
          title="Vers domaine"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate(`/domaines/${currentDomain}/categories/${currentCategory}`)}
          className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-all hover:scale-110"
          title="Rester sur catégorie"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};