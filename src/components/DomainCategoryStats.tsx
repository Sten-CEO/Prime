import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DomainCategoryStats = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-6 shadow-[inset_0_2px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.25] transition-all">
        <h3 className="text-lg font-semibold text-white text-center py-12">
          Statistiques catégorie
        </h3>
      </Card>

      <Button
        onClick={() => navigate("/journal")}
        className="w-full backdrop-blur-3xl bg-white/[0.05] border border-white/[0.18] rounded-xl hover:bg-white/[0.08] hover:border-white/[0.25] transition-all text-white"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Aller vers le journal
      </Button>
    </div>
  );
};
