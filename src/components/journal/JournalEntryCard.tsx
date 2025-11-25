import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface JournalEntryCardProps {
  id: string;
  title: string;
  content: string;
  domain: string;
  date: Date;
  onClick: () => void;
  hasInsight?: boolean;
}

export const JournalEntryCard = ({
  title,
  content,
  domain,
  date,
  onClick,
  hasInsight = false,
}: JournalEntryCardProps) => {
  const truncatedContent = content.length > 120 ? content.substring(0, 120) + "..." : content;
  
  const getDomainLabel = (domainId: string) => {
    const domains: Record<string, string> = {
      business: "Business",
      sport: "Sport",
      social: "Social",
      sante: "Santé",
      developpement: "Développement",
      finance: "Finance",
    };
    return domains[domainId] || domainId;
  };

  return (
    <Card
      onClick={onClick}
      className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-semibold text-white px-4 py-1.5 rounded-full bg-gradient-to-br from-white/[0.15] to-white/[0.08] border border-white/[0.25] shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-sm">
              {getDomainLabel(domain)}
            </span>
            {hasInsight && (
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
            )}
            <span className="text-xs text-white/40">
              {format(date, "d MMMM yyyy", { locale: fr })}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
            {title}
          </h3>
          
          <p className="text-sm text-white/60 line-clamp-2">
            {truncatedContent}
          </p>
        </div>
        
        <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
    </Card>
  );
};
