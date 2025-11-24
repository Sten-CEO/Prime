import { Card } from "@/components/ui/card";

interface InsightCardProps {
  text: string;
  date: string;
  highlightColor: "pink" | "purple" | "blue";
}

export const InsightCard = ({ text, date, highlightColor }: InsightCardProps) => {
  const highlightColors = {
    pink: "bg-aura-pink/25 border-aura-pink/40",
    purple: "bg-aura-purple/25 border-aura-purple/40",
    blue: "bg-aura-blue/25 border-aura-blue/40",
  };

  return (
    <Card className="backdrop-blur-xl bg-glass-bg/5 border-glass-border/10 rounded-2xl p-4 hover:bg-glass-bg/10 transition-all">
      <div className="space-y-2">
        <p className={`text-sm text-white px-2 py-1 rounded-lg border ${highlightColors[highlightColor]}`}>
          {text}
        </p>
        <p className="text-xs text-white/50">{date}</p>
      </div>
    </Card>
  );
};
