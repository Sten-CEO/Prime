import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { Home, Award, BookOpen, Target, User, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CategoryHighBar } from "@/components/CategoryHighBar";
import { CategoryScoreChart } from "@/components/CategoryScoreChart";
import { CategoryMetrics } from "@/components/CategoryMetrics";
import { CategoryPerformances } from "@/components/CategoryPerformances";
import { CategoryManualNote } from "@/components/CategoryManualNote";
import { CategorySelector } from "@/components/CategorySelector";
import { AddCategoryModal } from "@/components/modals/AddCategoryModal";
import { CategoryStatsBlock } from "@/components/CategoryStatsBlock";
import { useToast } from "@/hooks/use-toast";

interface Metric {
  id: string;
  name: string;
  enabled: boolean;
  days: string[];
}

interface Performance {
  id: string;
  name: string;
  score: number;
}

interface CategoryData {
  id: string;
  name: string;
  color?: string;
  score: number;
  variation: string;
  metrics: Metric[];
  performances: Performance[];
}

interface DomainCategories {
  [domainKey: string]: CategoryData[];
}

const initialCategoriesData: DomainCategories = {
  business: [
    {
      id: "strategie",
      name: "Stratégie",
      score: 85,
      variation: "+8% cette semaine",
      metrics: [
        { id: "1", name: "Planning stratégique", enabled: true, days: ["L", "V"] },
        { id: "2", name: "Analyse marché", enabled: true, days: ["M", "J"] },
      ],
      performances: [
        { id: "1", name: "Vision", score: 88 },
        { id: "2", name: "Décision", score: 82 },
      ],
    },
    {
      id: "execution",
      name: "Exécution",
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
  ],
  sport: [
    {
      id: "entrainement",
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
  ],
  social: [
    {
      id: "relations",
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
  ],
  sante: [
    {
      id: "bienetre",
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
  ],
};

const domainNames: { [key: string]: string } = {
  business: "Business",
  sport: "Sport",
  social: "Social",
  sante: "Santé",
};

const Categories = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [categoriesData, setCategoriesData] = useState<DomainCategories>(initialCategoriesData);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; color?: string } | null>(null);

  const currentDomainCategories = slug ? categoriesData[slug] || [] : [];

  useEffect(() => {
    if (currentDomainCategories.length > 0 && !activeCategory) {
      setActiveCategory(currentDomainCategories[0].id);
    }
  }, [slug, currentDomainCategories.length]);

  const activeCategoryData = currentDomainCategories.find(c => c.id === activeCategory);

  if (!slug || !activeCategoryData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Domaine non trouvé ou aucune catégorie disponible</p>
      </div>
    );
  }

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowAddModal(true);
  };

  const handleEditCategory = (categoryId: string) => {
    const category = currentDomainCategories.find(c => c.id === categoryId);
    if (category) {
      setEditingCategory({ id: category.id, name: category.name, color: category.color });
      setShowAddModal(true);
    }
  };

  const handleSaveCategory = (name: string, color: string) => {
    if (editingCategory) {
      // Renommer
      setCategoriesData(prev => ({
        ...prev,
        [slug]: prev[slug].map(c =>
          c.id === editingCategory.id ? { ...c, name, color } : c
        ),
      }));
      toast({ title: "Catégorie renommée", description: `La catégorie a été renommée en "${name}".` });
    } else {
      // Créer
      const newCategory: CategoryData = {
        id: `category_${Date.now()}`,
        name,
        color,
        score: 0,
        variation: "N/A",
        metrics: [],
        performances: [],
      };
      setCategoriesData(prev => ({
        ...prev,
        [slug]: [...prev[slug], newCategory],
      }));
      setActiveCategory(newCategory.id);
      toast({ title: "Catégorie créée", description: `"${name}" a été ajoutée avec succès.` });
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (currentDomainCategories.length === 1) {
      toast({ 
        title: "Impossible de supprimer", 
        description: "Il doit rester au moins une catégorie.",
        variant: "destructive"
      });
      return;
    }

    setCategoriesData(prev => ({
      ...prev,
      [slug]: prev[slug].filter(c => c.id !== categoryId),
    }));

    if (activeCategory === categoryId) {
      setActiveCategory(currentDomainCategories[0].id !== categoryId 
        ? currentDomainCategories[0].id 
        : currentDomainCategories[1].id);
    }

    toast({ title: "Catégorie supprimée", description: "La catégorie a été supprimée avec succès." });
  };

  const handleDuplicateCategory = (categoryId: string) => {
    const category = currentDomainCategories.find(c => c.id === categoryId);
    if (category) {
      const duplicated: CategoryData = {
        ...category,
        id: `category_${Date.now()}`,
        name: `${category.name} (copie)`,
        score: 0,
        variation: "N/A",
      };
      setCategoriesData(prev => ({
        ...prev,
        [slug]: [...prev[slug], duplicated],
      }));
      setActiveCategory(duplicated.id);
      toast({ title: "Catégorie dupliquée", description: `"${duplicated.name}" a été créée.` });
    }
  };

  const computeStats = () => {
    const activeMetricsCount = activeCategoryData.metrics.filter(m => m.enabled).length;
    const performancesRatedCount = activeCategoryData.performances.length;
    
    return {
      avgScore7d: Math.floor(Math.random() * 20 + 75),
      avgScore30d: Math.floor(Math.random() * 20 + 70),
      filledDaysPercent: Math.floor(Math.random() * 30 + 65),
      emptyDaysPercent: Math.floor(Math.random() * 35 + 5),
      activeMetricsCount,
      metricsCompletionRate: Math.floor(Math.random() * 30 + 65),
      performancesRatedCount,
      trend: activeCategoryData.variation.startsWith("+") ? "up" as const : activeCategoryData.variation.startsWith("-") ? "down" as const : "stable" as const,
      trendMessage: activeCategoryData.variation.startsWith("+") 
        ? "Catégorie en forte progression" 
        : activeCategoryData.variation.startsWith("-")
        ? "Catégorie en baisse, attention"
        : "Catégorie stable",
    };
  };

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
          <CategoryHighBar currentDomain={slug || "business"} currentCategory={activeCategory} />
          
          <CategorySelector
            categories={currentDomainCategories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onDuplicateCategory={handleDuplicateCategory}
          />
          
          <div className="mb-6">
            <CategoryScoreChart
              categoryName={`${domainNames[slug]} – ${activeCategoryData.name}`}
              score={activeCategoryData.score}
              variation={activeCategoryData.variation}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <CategoryStatsBlock
                categoryName={activeCategoryData.name}
                domainName={domainNames[slug]}
                stats={computeStats()}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CategoryPerformances 
              categoryName={activeCategoryData.name}
              performances={activeCategoryData.performances}
            />
            <CategoryMetrics metrics={activeCategoryData.metrics} />
          </div>

          <CategoryManualNote categoryName={activeCategoryData.name} />
        </div>
      </div>

      <AddCategoryModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
      />
    </div>
  );
};

export default Categories;
