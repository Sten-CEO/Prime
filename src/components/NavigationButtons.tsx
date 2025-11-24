import { Card } from "@/components/ui/card";
import { Target, BookOpen, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NavigationButtons = () => {
  const navigate = useNavigate();
  
  const buttons = [
    { label: "Domaines", icon: Target, path: "/domaines" },
    { label: "Journal", icon: BookOpen, path: "/journal" },
    { label: "Prime History", icon: Clock, path: "/prime-history" },
  ];

  return (
    <div className="flex gap-4">
      {buttons.map((button) => {
        const Icon = button.icon;
        return (
          <Card 
            key={button.label}
            onClick={() => navigate(button.path)}
            className="flex-1 backdrop-blur-xl bg-white/[0.01] border border-white/[0.08] rounded-2xl px-6 py-3 hover:bg-white/[0.02] hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
          >
            <div className="flex items-center justify-center gap-2">
              <Icon className="w-4 h-4 text-white/70" />
              <span className="text-white text-sm font-medium">{button.label}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
