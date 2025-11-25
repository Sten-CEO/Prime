import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { Sidebar } from "@/components/Sidebar";
import { CategoryHighBar } from "@/components/CategoryHighBar";
import { CategoryMetrics } from "@/components/CategoryMetrics";
import { CategoryPerformances } from "@/components/CategoryPerformances";
import { CategoryManualNote } from "@/components/CategoryManualNote";
import { CategorySelector } from "@/components/CategorySelector";
import { AddCategoryModal } from "@/components/modals/AddCategoryModal";
import { CategoryStatsBlock } from "@/components/CategoryStatsBlock";
import { useToast } from "@/hooks/use-toast";
import { useDomainSlugToId } from "@/hooks/useDomainSlugToId";
import { useCategories } from "@/hooks/useCategories";

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
  
  const { data: domainIdData } = useDomainSlugToId(slug || "");
  const { categories, isLoading: categoriesLoading, createCategory, updateCategory, deleteCategory } = useCategories(domainIdData || undefined);
  
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; color?: string } | null>(null);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories.length]);

  const activeCategoryData = categories.find(c => c.id === activeCategory);

  if (!slug || !domainIdData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Domaine non trouvé</p>
      </div>
    );
  }

  const hasCategories = categories.length > 0;
  const isLoading = categoriesLoading;

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowAddModal(true);
  };

  const handleEditCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setEditingCategory({ id: category.id, name: category.name, color: category.color || undefined });
      setShowAddModal(true);
    }
  };

  const handleSaveCategory = (name: string, color: string) => {
    if (!domainIdData) return;
    
    if (editingCategory) {
      // Renommer
      updateCategory({
        id: editingCategory.id,
        name,
        color,
      });
    } else {
      // Créer
      createCategory({
        name,
        color,
        domain_id: domainIdData,
      });
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (categories.length <= 1) {
      toast({ 
        title: "Impossible de supprimer", 
        description: "Il doit rester au moins une catégorie.",
        variant: "destructive"
      });
      return;
    }

    deleteCategory(categoryId);

    if (activeCategory === categoryId && categories.length > 1) {
      const otherCategory = categories.find(c => c.id !== categoryId);
      if (otherCategory) {
        setActiveCategory(otherCategory.id);
      }
    }
  };

  const handleDuplicateCategory = (categoryId: string) => {
    if (!domainIdData) return;
    
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      createCategory({
        name: `${category.name} (copie)`,
        color: category.color || undefined,
        domain_id: domainIdData,
      });
    }
  };

  const computeStats = () => {
    // TODO: Calculer les vraies statistiques depuis Supabase
    return {
      avgScore7d: "-",
      avgScore30d: "-",
      filledDaysPercent: "-",
      emptyDaysPercent: "-",
      activeMetricsCount: "-",
      metricsCompletionRate: "-",
      performancesRatedCount: "-",
      trend: "stable" as const,
      trendMessage: "Aucune donnée enregistrée",
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
      <Sidebar />
      
      {/* Content */}
      <div className="relative z-10 ml-32 min-h-screen">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          <CategoryHighBar currentDomain={slug || "business"} currentCategory={activeCategory} />
          
          {isLoading ? (
            <div className="py-8">
              <div className="h-12 bg-white/[0.02] border border-white/[0.08] rounded-2xl animate-pulse" />
            </div>
          ) : (
            <CategorySelector
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              onAddCategory={handleAddCategory}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
              onDuplicateCategory={handleDuplicateCategory}
            />
          )}
          
          {!hasCategories ? (
            <div className="mt-12 text-center">
              <div className="backdrop-blur-3xl bg-white/[0.01] border border-white/[0.18] rounded-2xl p-12 max-w-md mx-auto">
                <p className="text-white/60 text-lg mb-2">Aucune catégorie pour ce domaine</p>
                <p className="text-white/40 text-sm">Créez votre première catégorie pour commencer</p>
              </div>
            </div>
          ) : activeCategoryData ? (
            <>
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
                  categoryId={activeCategoryData.id}
                  domainId={domainIdData || ""}
                />
                <CategoryMetrics 
                  categoryId={activeCategoryData.id}
                  domainId={domainIdData || ""}
                />
              </div>

              <CategoryManualNote categoryName={activeCategoryData.name} />
            </>
          ) : null}
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
