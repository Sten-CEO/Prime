import bgImage from "@/assets/black-shapes-bg.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
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
import { useOverviewData } from "@/hooks/useOverviewData";
import { useDomains } from "@/hooks/useDomains";

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
  insight_date: string; // Date ISO brute pour le routing
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
  const { data: overviewItems = [], isLoading: isLoadingOverview } = useOverviewData();
  const { domains: dbDomains, isLoading: isLoadingDomains } = useDomains();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [primeTargets, setPrimeTargets] = useState(targets);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const itemsPerPage = 5;
  
  // Construire dynamiquement les filtres d'insights
  const filters = ["Tous", ...dbDomains.map(d => d.name)];

  const getDomainLabel = (domainId: string) => {
    const domain = dbDomains.find(d => d.slug === domainId);
    return domain?.name || domainId;
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
        insight_date: insight.insight_date, // Date ISO brute
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
    if (dbDomains.length > 0) {
      fetchInsights();
    }
  }, [dbDomains]);

  const handleToggleFavorite = (name: string) => {
    setFavorites(prev => 
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };

  const handleReorderItems = () => {
    // Reorder functionality disabled when using real-time data
    // Items are ordered by domain configuration
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
      <Sidebar />
      
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
                isLoading={isLoadingOverview}
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
                {!isLoadingDomains && filters.map((filter) => (
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
