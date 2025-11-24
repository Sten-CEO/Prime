import { useParams, useNavigate, useLocation } from "react-router-dom";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { Home, Award, BookOpen, Target, User, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DomainHighBar } from "@/components/DomainHighBar";
import { DomainScoreChart } from "@/components/DomainScoreChart";
import { DomainPerformances } from "@/components/DomainPerformances";
import { DomainTrends } from "@/components/DomainTrends";
import { DomainObjectives } from "@/components/DomainObjectives";

const domainData = {
  business: {
    name: "Business",
    score: 85,
    variation: "+12% cette semaine",
    performances: [
      { id: "p1", name: "Productivité", score: 82 },
      { id: "p2", name: "Stratégie", score: 78 },
      { id: "p3", name: "Focus", score: 91 },
    ],
    trends: [
      { period: "Semaine", value: "+12%", type: "up" as const, tooltip: "Basé sur la moyenne mobile du domaine sur 7 jours" },
      { period: "Mois", value: "+8%", type: "up" as const, tooltip: "Basé sur la moyenne mobile du domaine sur 30 jours" },
      { period: "Année", value: "+15%", type: "up" as const, tooltip: "Basé sur la moyenne mobile du domaine sur 365 jours" },
    ],
    objectives: [
      { 
        id: 1, 
        title: "Lancer le nouveau produit", 
        progress: 75, 
        deadline: "30 Nov 2025", 
        status: "in-progress" as const, 
        completed: false,
        notes: "Sprint final en cours. Besoin de finaliser les tests avant le lancement.",
        subObjectives: [
          "Finaliser les tests utilisateurs",
          "Préparer le plan marketing",
          "Former l'équipe support"
        ],
        history: [
          { date: "20 Nov", progress: 65 },
          { date: "18 Nov", progress: 55 },
          { date: "15 Nov", progress: 50 }
        ]
      },
      { 
        id: 2, 
        title: "Atteindre 10k utilisateurs", 
        progress: 45, 
        deadline: "15 Déc 2025", 
        status: "in-progress" as const, 
        completed: false,
        notes: "Croissance régulière. Focus sur l'acquisition organique.",
        subObjectives: [
          "Optimiser le SEO",
          "Lancer campagne réseaux sociaux",
          "Programme de parrainage"
        ],
        history: [
          { date: "20 Nov", progress: 40 },
          { date: "15 Nov", progress: 35 },
          { date: "10 Nov", progress: 30 }
        ]
      },
    ],
  },
  sport: {
    name: "Sport",
    score: 78,
    variation: "+8% cette semaine",
    performances: [
      { id: "p1", name: "Cardio", score: 85 },
      { id: "p2", name: "Force", score: 72 },
      { id: "p3", name: "Régularité", score: 76 },
    ],
    trends: [
      { period: "Semaine", value: "+8%", type: "up" as const, tooltip: "Basé sur la moyenne mobile du domaine sur 7 jours" },
      { period: "Mois", value: "+5%", type: "up" as const, tooltip: "Basé sur la moyenne mobile du domaine sur 30 jours" },
      { period: "Année", value: "+10%", type: "up" as const, tooltip: "Basé sur la moyenne mobile du domaine sur 365 jours" },
    ],
    objectives: [
      { 
        id: 1, 
        title: "Courir un marathon", 
        progress: 45, 
        deadline: "15 Déc 2025", 
        status: "in-progress" as const, 
        completed: false,
        notes: "Entraînement régulier 4x/semaine. Attention aux blessures.",
        subObjectives: [
          "Augmenter distance hebdomadaire",
          "Travail spécifique vitesse",
          "Nutrition adaptée"
        ],
        history: [
          { date: "20 Nov", progress: 42 },
          { date: "15 Nov", progress: 38 },
          { date: "10 Nov", progress: 35 }
        ]
      },
    ],
  },
  social: {
    name: "Social",
    score: 69,
    variation: "-3% cette semaine",
    performances: [
      { id: "p1", name: "Connexions", score: 65 },
      { id: "p2", name: "Communication", score: 70 },
      { id: "p3", name: "Empathie", score: 72 },
    ],
    trends: [
      { period: "Semaine", value: "-3%", type: "down" as const, tooltip: "Basé sur la moyenne mobile du domaine sur 7 jours" },
      { period: "Mois", value: "+2%", type: "stable" as const, tooltip: "Basé sur la moyenne mobile du domaine sur 30 jours" },
      { period: "Année", value: "+5%", type: "up" as const, tooltip: "Basé sur la moyenne mobile du domaine sur 365 jours" },
    ],
    objectives: [],
  },
  sante: {
    name: "Santé",
    score: 92,
    variation: "+15% cette semaine",
    performances: [
      { id: "p1", name: "Sommeil", score: 95 },
      { id: "p2", name: "Nutrition", score: 88 },
      { id: "p3", name: "Énergie", score: 93 },
    ],
    trends: [
      { period: "Semaine", value: "+15%", type: "up" as const, tooltip: "Basé sur la moyenne mobile du domaine sur 7 jours" },
      { period: "Mois", value: "+12%", type: "up" as const, tooltip: "Basé sur la moyenne mobile du domaine sur 30 jours" },
      { period: "Année", value: "+18%", type: "up" as const, tooltip: "Basé sur la moyenne mobile du domaine sur 365 jours" },
    ],
    objectives: [
      { 
        id: 1, 
        title: "Méditer 30 jours consécutifs", 
        progress: 90, 
        deadline: "28 Nov 2025", 
        status: "in-progress" as const, 
        completed: false,
        notes: "Excellent progrès. Méditation quotidienne ancrée dans la routine.",
        subObjectives: [
          "Maintenir la régularité",
          "Approfondir la pratique",
          "Varier les techniques"
        ],
        history: [
          { date: "20 Nov", progress: 87 },
          { date: "15 Nov", progress: 80 },
          { date: "10 Nov", progress: 73 }
        ]
      },
    ],
  },
};

const Domaines = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const domain = slug ? domainData[slug as keyof typeof domainData] : null;

  if (!domain) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Domaine non trouvé</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Background image - fixed */}
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
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Home className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <Separator className="w-10 bg-white/20 mx-auto my-4" />
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.08] transition-colors">
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
      
      {/* Content - scrollable */}
      <div className="relative z-10 ml-32 min-h-screen">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          {/* High Bar */}
          <DomainHighBar currentDomain={slug || ""} />

          {/* Score + Chart + Trends */}
          <div className="grid grid-cols-[1fr_auto] gap-8 mb-8">
            <DomainScoreChart
              domainName={domain.name}
              score={domain.score}
              variation={domain.variation}
            />
            <div className="w-[400px]">
              <DomainTrends trends={domain.trends} />
            </div>
          </div>

          {/* Performances */}
          <div className="mb-8">
            <DomainPerformances
              domainName={domain.name}
              performances={domain.performances}
            />
          </div>

          {/* Objectives */}
          {domain.objectives.length > 0 && (
            <DomainObjectives objectives={domain.objectives} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Domaines;
