import bgImage from "@/assets/black-shapes-bg.jpg";
import { Home, Award, BookOpen, Target, User, Settings, Briefcase, Dumbbell, Users, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useLocation } from "react-router-dom";
import { PrimeTargetCard } from "@/components/PrimeTargetCard";
import { DropZone } from "@/components/DropZone";
import { InsightCard } from "@/components/InsightCard";
import { MultiDomainChart } from "@/components/MultiDomainChart";
import { QuickJournalCard } from "@/components/QuickJournalCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OverviewCard } from "@/components/OverviewCard";
import { NavigationButtons } from "@/components/NavigationButtons";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const initialOverviewItems = [
  { name: "Business", icon: Briefcase, score: 85, trend: "+12%" },
  { name: "Sport", icon: Dumbbell, score: 78, trend: "+8%" },
  { name: "Social", icon: Users, score: 69, trend: "-3%" },
  { name: "Santé", icon: Heart, score: 92, trend: "+15%" },
];

const targets = [
  { id: 1, title: "Lancer le nouveau produit", progress: 75, deadline: "30 Nov 2025", status: "in-progress" as const, completed: false },
  { id: 2, title: "Courir un marathon", progress: 45, deadline: "15 Déc 2025", status: "in-progress" as const, completed: false },
  { id: 3, title: "Méditer 30 jours consécutifs", progress: 90, deadline: "28 Nov 2025", status: "in-progress" as const, completed: false },
  { id: 4, title: "Lire 12 livres cette année", progress: 30, deadline: "31 Déc 2025", status: "delayed" as const, completed: false },
];

interface Insight {
  id: string;
  text: string;
  date: string;
  highlightColor: "pink" | "purple" | "blue";
  category: string;
  domain_id: string;
  entry_id?: string;
}

const Accueil = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [insightFilter, setInsightFilter] = useState<string>("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const [overviewItems, setOverviewItems] = useState(initialOverviewItems);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [primeTargets, setPrimeTargets] = useState(targets);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const itemsPerPage = 5;

  const getDomainLabel = (domainId: string) => {
    const domains: Record<string, string> = {
      general: "Général",
      business: "Business",
      sport: "Sport",
      social: "Social",
      sante: "Santé",
      developpement: "Développement",
      finance: "Finance",
    };
    return domains[domainId] || domainId;
  };

  const fetchInsights = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Non authentifié",
          description: "Vous devez être connecté",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("insights")
        .select("*")
        .eq("user_id", user.id)
        .eq("hidden_from_home", false)
        .order("insight_date", { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedInsights: Insight[] = (data || []).map(insight => ({
        id: insight.id,
        text: insight.phrase,
        date: format(new Date(insight.insight_date), "d MMM", { locale: fr }),
        highlightColor: "blue" as const, // Non utilisé maintenant, couleur dynamique dans InsightCard
        category: getDomainLabel(insight.domain_id),
        domain_id: insight.domain_id,
        entry_id: insight.entry_id,
      }));

      setInsights(formattedInsights);
    } catch (error) {
      console.error("Error fetching insights:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les insights",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleToggleFavorite = (name: string) => {
    setFavorites(prev => 
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };

  const handleReorderItems = (newOrder: typeof initialOverviewItems) => {
    setOverviewItems(newOrder);
  };

  const handleDeleteInsight = async (insightId: string) => {
    try {
      const { error } = await supabase
        .from("insights")
        .update({ hidden_from_home: true })
        .eq("id", insightId);

      if (error) throw error;

      setInsights(prev => prev.filter(insight => insight.id !== insightId));

      toast({
        title: "Insight masqué",
        description: "L'insight a été retiré de l'accueil mais reste dans votre entrée de journal",
      });
    } catch (error) {
      console.error("Error hiding insight:", error);
      toast({
        title: "Erreur",
        description: "Impossible de masquer l'insight",
        variant: "destructive",
      });
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null) return;
    
    const newTargets = [...primeTargets];
    const draggedItem = newTargets[draggedIndex];
    
    // Remove the dragged item
    newTargets.splice(draggedIndex, 1);
    
    // Insert at the new position
    // If we're dropping after the original position, we need to adjust
    const insertIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
    newTargets.splice(insertIndex, 0, draggedItem);
    
    setPrimeTargets(newTargets);
    setDraggedIndex(null);
  };

  const filters = ["Tous", "Business", "Sport", "Social", "Santé"];

  const filteredInsights = insightFilter === "Tous" 
    ? insights 
    : insights.filter(insight => insight.category === insightFilter);

  const totalPages = Math.ceil(filteredInsights.length / itemsPerPage);
  const paginatedInsights = filteredInsights.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.08] transition-colors">
              <Home className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <Separator className="w-10 bg-white/20 mx-auto my-4" />
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            <button 
              onClick={() => navigate("/domaines/business")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Award className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button 
              onClick={() => navigate("/journal")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button 
              onClick={() => navigate("/prime-targets")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Target className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <Separator className="w-10 bg-white/20 mx-auto my-2" />
          </div>
          
          <div className="flex-none flex flex-col gap-4 mt-8">
            <button 
              onClick={() => navigate("/profil")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <User className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button 
              onClick={() => navigate("/parametres")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Settings className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content - scrollable */}
      <div className="relative z-10 ml-32 min-h-screen">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          {/* Top Row: Multi-Domain Chart + Overview */}
          <div className="grid grid-cols-[1fr_auto] gap-8 mb-6">
            <MultiDomainChart />
            <div className="w-[400px]">
              <OverviewCard 
                items={overviewItems} 
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onReorderItems={handleReorderItems}
              />
            </div>
          </div>
          
          {/* Left Column: Navigation Buttons + Prime Targets */}
          <div className="grid grid-cols-[1fr_auto] gap-8 mb-8">
            <div className="space-y-6">
              <NavigationButtons />
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white ml-2">Prime Targets</h2>
                <div className="space-y-1">
                  {primeTargets.map((target, index) => (
                    <div key={target.id}>
                      <DropZone index={index} onDrop={handleDrop} />
                      <PrimeTargetCard 
                        {...target} 
                        index={index}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        isDragging={draggedIndex === index}
                      />
                    </div>
                  ))}
                  <DropZone index={primeTargets.length} onDrop={handleDrop} />
                </div>
              </div>
            </div>
            
            {/* Right Column: Insights */}
            <div className="w-[400px] space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white ml-2">Insights</h2>
              </div>
              
              {/* Filter buttons */}
              <div className="flex gap-2 flex-wrap">
                {filters.map((filter) => (
                  <Button
                    key={filter}
                    onClick={() => {
                      setInsightFilter(filter);
                      setCurrentPage(1);
                    }}
                    variant="ghost"
                    size="sm"
                    className={`text-xs transition-all ${
                      insightFilter === filter
                        ? "bg-white/[0.15] text-white border border-white/[0.2]"
                        : "text-white/60 hover:text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    {filter}
                  </Button>
                ))}
              </div>

              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center text-white/60 py-12">
                      Chargement des insights...
                    </div>
                  ) : paginatedInsights.length === 0 ? (
                    <div className="text-center text-white/60 py-12">
                      Aucun insight pour le moment. Créez des entrées de journal avec des insights pour les voir ici.
                    </div>
                  ) : (
                    paginatedInsights.map((insight) => (
                      <InsightCard 
                        key={insight.id} 
                        {...insight} 
                        onDelete={() => handleDeleteInsight(insight.id)}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white disabled:opacity-30"
                  >
                    ←
                  </Button>
                  <span className="text-white/60 text-xs">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white disabled:opacity-30"
                  >
                    →
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Journal - Full Width */}
          <div className="mb-8">
            <QuickJournalCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accueil;
