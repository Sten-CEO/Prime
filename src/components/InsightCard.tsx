import { Card } from "@/components/ui/card";

interface InsightCardProps {
  text: string;
  date: string;
  highlightColor: "pink" | "purple" | "blue";
}

export const InsightCard = ({ text, date, highlightColor }: InsightCardProps) => {
  const highlightColors = {
    pink: "bg-aura-pink/20 border-aura-pink/40 shadow-[0_0_20px_rgba(244,114,182,0.4)]",
    purple: "bg-aura-purple/20 border-aura-purple/40 shadow-[0_0_20px_rgba(168,85,247,0.4)]",
    blue: "bg-aura-cyan/20 border-aura-cyan/40 shadow-[0_0_20px_rgba(34,211,238,0.4)]",
  };

  return (
    <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-4 hover:bg-white/[0.03] hover:border-white/[0.25] transition-all relative overflow-hidden shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)]">
      <div className="space-y-2">
        <p className={`text-sm text-white px-2 py-1 rounded-lg border backdrop-blur-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ${highlightColors[highlightColor]}`}>
          {text}
        </p>
        <p className="text-xs text-white/50">{date}</p>
      </div>
    </Card>
  );
};
