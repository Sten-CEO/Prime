import { Card } from "@/components/ui/card";

interface InsightCardProps {
  text: string;
  date: string;
  highlightColor: "pink" | "purple" | "blue";
}

export const InsightCard = ({ text, date, highlightColor }: InsightCardProps) => {
  const highlightColors = {
    pink: "bg-aura-pink/20 border-aura-pink/40 shadow-[0_0_15px_rgba(244,114,182,0.3)]",
    purple: "bg-aura-purple/20 border-aura-purple/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
    blue: "bg-aura-blue/20 border-aura-blue/40 shadow-[0_0_15px_rgba(96,165,250,0.3)]",
  };

  return (
    <Card className="backdrop-blur-xl bg-white/[0.03] border-white/[0.15] rounded-2xl p-4 hover:bg-white/[0.05] transition-all relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      <div className="space-y-2">
        <p className={`text-sm text-white px-2 py-1 rounded-lg border backdrop-blur-sm ${highlightColors[highlightColor]}`}>
          {text}
        </p>
        <p className="text-xs text-white/50">{date}</p>
      </div>
    </Card>
  );
};
