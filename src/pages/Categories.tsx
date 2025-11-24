import { useParams, useNavigate, useLocation } from "react-router-dom";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { Home, Award, BookOpen, Target, User, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CategoryHighBar } from "@/components/CategoryHighBar";
import { CategoryScoreChart } from "@/components/CategoryScoreChart";
import { CategoryMetrics } from "@/components/CategoryMetrics";
import { CategoryPerformances } from "@/components/CategoryPerformances";
import { CategoryManualNote } from "@/components/CategoryManualNote";

const categoryData = {
  business: {
    principale: {
      name: "Productivité",
      score: 82,
      variation: "+6% cette semaine",
      metrics: [
        { id: "1", name: "Focus matinal", enabled: true, days: ["L", "M", "M", "J", "V"] },
        { id: "2", name: "Deep Work 2h", enabled: true, days: ["L", "M", "M", "J", "V"] },
        { id: "3", name: "Planning quotidien", enabled: true, days: ["L", "M", "M", "J", "V", "S", "D"] },
      ],
      performances: [
        { id: "1", name: "Efficacité", score: 85 },
        { id: "2", name: "Concentration", score: 78 },
        { id: "3", name: "Organisation", score: 89 },
      ],
    },
  },
  sport: {
    principale: {
      name: "Entraînement",
      score: 78,
      variation: "+8% cette semaine",
      metrics: [
        { id: "1", name: "Cardio 30min", enabled: true, days: ["L", "M", "V"] },
        { id: "2", name: "Musculation", enabled: true, days: ["M", "J", "S"] },
        { id: "3", name: "Étirements", enabled: true, days: ["L", "M", "M", "J", "V", "S", "D"] },
      ],
      performances: [
        { id: "1", name: "Endurance", score: 75 },
        { id: "2", name: "Force", score: 82 },
        { id: "3", name: "Souplesse", score: 70 },
      ],
    },
  },
  social: {
    principale: {
      name: "Relations",
      score: 69,
      variation: "-3% cette semaine",
      metrics: [
        { id: "1", name: "Appel famille", enabled: true, days: ["M", "S"] },
        { id: "2", name: "Sortie amis", enabled: true, days: ["V", "S"] },
        { id: "3", name: "Message quotidien", enabled: true, days: ["L", "M", "M", "J", "V", "S", "D"] },
      ],
      performances: [
        { id: "1", name: "Écoute", score: 72 },
        { id: "2", name: "Présence", score: 65 },
        { id: "3", name: "Empathie", score: 71 },
      ],
    },
  },
  sante: {
    principale: {
      name: "Bien-être",
      score: 92,
      variation: "+15% cette semaine",
      metrics: [
        { id: "1", name: "Sommeil 8h", enabled: true, days: ["L", "M", "M", "J", "V", "S", "D"] },
        { id: "2", name: "Hydratation 2L", enabled: true, days: ["L", "M", "M", "J", "V", "S", "D"] },
        { id: "3", name: "Méditation 10min", enabled: true, days: ["L", "M", "M", "J", "V"] },
      ],
      performances: [
        { id: "1", name: "Énergie", score: 90 },
        { id: "2", name: "Humeur", score: 95 },
        { id: "3", name: "Vitalité", score: 91 },
      ],
    },
  },
};

const Categories = () => {
  const { slug, category } = useParams<{ slug: string; category: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const categoryInfo = slug && category 
    ? categoryData[slug as keyof typeof categoryData]?.[category as keyof typeof categoryData[keyof typeof categoryData]]
    : null;

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Catégorie non trouvée</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Background image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Glass Sidebar */}
      <div className="fixed left-6 top-6 bottom-6 w-20 z-20">
        <div className="h-full backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.08] flex flex-col items-center py-6 px-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
          <div className="mb-4">
            <span className="text-white font-bold text-lg tracking-tight">Prime.</span>
          </div>
          
          <Separator className="w-10 bg-white/20 mb-8" />
          
          <div className="flex-none">
            <button 
              onClick={() => navigate("/accueil")}
              className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                location.pathname === "/accueil" ? "bg-white/[0.08]" : "hover:bg-white/[0.08]"
              }`}
            >
              <Home className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <Separator className="w-10 bg-white/20 mx-auto my-4" />
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            <button 
              onClick={() => navigate("/domaines/business")}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Award className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors">
              <BookOpen className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors">
              <Target className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <Separator className="w-10 bg-white/20 mx-auto my-2" />
          </div>
          
          <div className="flex-none flex flex-col gap-4 mt-8">
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors">
              <User className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors">
              <Settings className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 ml-32 min-h-screen">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          <CategoryHighBar currentDomain={slug || "business"} currentCategory={category || "principale"} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CategoryScoreChart 
              categoryName={categoryInfo.name}
              score={categoryInfo.score}
              variation={categoryInfo.variation}
            />
            <CategoryMetrics metrics={categoryInfo.metrics} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CategoryPerformances 
              categoryName={categoryInfo.name}
              performances={categoryInfo.performances}
            />
            <CategoryManualNote categoryName={categoryInfo.name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;