import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { useState } from "react";

interface Performance {
  id: string;
  name: string;
  score: number;
}

interface DomainPerformancesProps {
  domainName: string;
  performances: Performance[];
}

export const DomainPerformances = ({ domainName, performances: initialPerformances }: DomainPerformancesProps) => {
  const [performances, setPerformances] = useState(initialPerformances);

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
      <h3 className="text-lg font-semibold text-white mb-4">Performances Libres</h3>
      
      <div className="space-y-3">
        {performances.map((perf) => (
          <div
            key={perf.id}
            className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] transition-all group"
          >
            <span className="text-sm text-white/80">{perf.name}</span>
            
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white">
                {perf.score}<span className="text-white/60">/10</span>
              </span>
              <button
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] transition-all opacity-0 group-hover:opacity-100"
                title="Modifier"
              >
                <Pencil className="w-3.5 h-3.5 text-white/70" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
