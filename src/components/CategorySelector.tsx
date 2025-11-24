import { Plus, MoreVertical, Edit2, Trash2, Copy } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Category {
  id: string;
  name: string;
  color?: string;
}

interface CategorySelectorProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onAddCategory: () => void;
  onEditCategory: (categoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onDuplicateCategory: (categoryId: string) => void;
}

export const CategorySelector = ({
  categories,
  activeCategory,
  onCategoryChange,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onDuplicateCategory,
}: CategorySelectorProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative group"
          >
            <button
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full backdrop-blur-xl transition-all ${
                activeCategory === category.id
                  ? "bg-white/[0.15] border-2 border-white/[0.3] text-white shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                  : "bg-white/[0.05] border border-white/[0.12] text-white/70 hover:bg-white/[0.08] hover:border-white/[0.2] hover:text-white"
              }`}
            >
              <span className="text-sm font-medium">{category.name}</span>
            </button>
            
            {activeCategory === category.id && (
              <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-6 h-6 flex items-center justify-center rounded-full bg-white/[0.15] border border-white/[0.3] hover:bg-white/[0.2] transition-all">
                      <MoreVertical className="w-3 h-3 text-white" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="backdrop-blur-3xl bg-black/95 border-white/[0.18] text-white">
                    <DropdownMenuItem
                      onClick={() => onEditCategory(category.id)}
                      className="cursor-pointer hover:bg-white/[0.08]"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Renommer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDuplicateCategory(category.id)}
                      className="cursor-pointer hover:bg-white/[0.08]"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Dupliquer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteClick(category.id)}
                      className="cursor-pointer hover:bg-white/[0.08] text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={onAddCategory}
          className="px-4 py-2 rounded-full backdrop-blur-xl bg-white/[0.05] border border-white/[0.12] text-white/70 hover:bg-white/[0.08] hover:border-white/[0.2] hover:text-white transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Nouvelle catégorie</span>
        </button>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="backdrop-blur-3xl bg-black/95 border border-white/[0.18] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette catégorie ?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Cette action est irréversible. Toutes les métriques, performances et données de cette catégorie seront supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/[0.05] border-white/[0.12] text-white hover:bg-white/[0.08]">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500/20 border border-red-500/40 text-red-500 hover:bg-red-500/30"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
