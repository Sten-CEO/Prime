import { Card } from "@/components/ui/card";

interface InsightCardProps {
  text: string;
  date: string;
  highlightColor: "pink" | "purple" | "blue";
}

export const InsightCard = ({ text, date, highlightColor }: InsightCardProps) => {
  const highlightColors = {
    pink: "bg-aura-pink/15 border-aura-pink/30",
    purple: "bg-aura-purple/15 border-aura-purple/30",
    blue: "bg-aura-blue/15 border-aura-blue/30",
  };

  return (
    <Card className="backdrop-blur-2xl bg-white/[0.02] border border-white/[0.12] rounded-2xl p-4 hover:bg-white/[0.04] hover:border-white/[0.18] transition-all relative overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
      <div className="space-y-2">
        <p className={`text-sm text-white px-2 py-1 rounded-lg border backdrop-blur-md ${highlightColors[highlightColor]}`}>
          {text}
        </p>
        <p className="text-xs text-white/50">{date}</p>
      </div>
    </Card>
  );
};
