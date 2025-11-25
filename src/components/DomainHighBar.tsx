import { Briefcase, Dumbbell, Users, Heart, GraduationCap, DollarSign, Target, Book, Music, Palette, Code, Coffee, Star, Zap, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDomains } from "@/hooks/useDomains";
import { useState } from "react";
import { CreateDomainModal } from "@/components/modals/CreateDomainModal";

const ICON_MAP: Record<string, any> = {
  "briefcase": Briefcase,
  "dumbbell": Dumbbell,
  "users": Users,
  "heart": Heart,
  "graduation-cap": GraduationCap,
  "dollar-sign": DollarSign,
  "target": Target,
  "book": Book,
  "music": Music,
  "palette": Palette,
  "code": Code,
  "coffee": Coffee,
  "star": Star,
  "zap": Zap,
};

interface DomainHighBarProps {
  currentDomain: string;
}

export const DomainHighBar = ({ currentDomain }: DomainHighBarProps) => {
  const navigate = useNavigate();
  const { domains, isLoading } = useDomains();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center gap-8 mb-8">
        <div className="flex items-center gap-3 backdrop-blur-3xl bg-white/[0.02] border border-white/[0.18] rounded-full px-6 py-3 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)]">
          {isLoading ? (
            <div className="w-40 h-10 animate-pulse bg-white/[0.05] rounded-full" />
          ) : (
            <>
              {domains.map((domain) => {
                const Icon = ICON_MAP[domain.icon || "briefcase"] || Briefcase;
                const isActive = currentDomain === domain.slug;
                return (
                  <button
                    key={domain.id}
                    onClick={() => navigate(`/domaines/${domain.slug}`)}
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
              <div className="w-px h-6 bg-white/[0.1] mx-1" />
              <button
                onClick={() => setShowCreateModal(true)}
                className="group relative w-10 h-10 rounded-full backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all"
                title="Créer un domaine"
              >
                <Plus className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/60 group-hover:text-white/80 transition-all" />
              </button>
            </>
          )}
        </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(`/domaines/${currentDomain}`)}
          className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-all hover:scale-110"
          title="Rester sur domaine"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate(`/domaines/${currentDomain}/categories/principale`)}
          className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-all hover:scale-110"
          title="Vers catégories"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/domaines/${currentDomain}`)}
            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-all hover:scale-110"
            title="Rester sur domaine"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(`/domaines/${currentDomain}/categories/principale`)}
            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-all hover:scale-110"
            title="Vers catégories"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <CreateDomainModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </>
  );
};
