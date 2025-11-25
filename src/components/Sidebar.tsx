import { Home, Award, BookOpen, Target, User, Settings, LayoutGrid, List, Gauge } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

export const Sidebar = () => {
  const navigate = useNavigate();
  const [isAttributMenuOpen, setIsAttributMenuOpen] = useState(false);

  const attributMenuItems = [
    { 
      icon: LayoutGrid, 
      label: "Domaines", 
      onClick: () => navigate("/domaines/business") 
    },
    { 
      icon: List, 
      label: "Catégories", 
      onClick: () => navigate("/categories/business") 
    },
    { 
      icon: Gauge, 
      label: "Performances", 
      onClick: () => navigate("/domaines/business/performances") 
    },
  ];

  return (
    <div className="fixed left-6 top-6 bottom-6 w-20 z-20">
      <div className="h-full backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.08] flex flex-col items-center py-6 px-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
        <div className="mb-4">
          <span className="text-white font-bold text-lg tracking-tight">Prime.</span>
        </div>
        
        <Separator className="w-10 bg-white/20 mb-8" />
        
        <div className="flex-none">
          <button 
            onClick={() => navigate("/")}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.08] transition-colors"
          >
            <Home className="w-5 h-5 text-gray-400 opacity-70" />
          </button>
          <Separator className="w-10 bg-white/20 mx-auto my-4" />
        </div>
        
        <div className="flex-1 flex flex-col gap-4">
          <Popover open={isAttributMenuOpen} onOpenChange={setIsAttributMenuOpen}>
            <PopoverTrigger asChild>
              <button 
                onClick={() => navigate("/domaines/business")}
                onMouseEnter={() => setIsAttributMenuOpen(true)}
                onMouseLeave={() => setIsAttributMenuOpen(false)}
                className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <Award className="w-5 h-5 text-gray-400 opacity-70" />
              </button>
            </PopoverTrigger>
            <PopoverContent 
              side="right" 
              align="start"
              sideOffset={12}
              className="w-56 p-0 border-0 bg-transparent shadow-none"
              onMouseEnter={() => setIsAttributMenuOpen(true)}
              onMouseLeave={() => setIsAttributMenuOpen(false)}
            >
              <div className="backdrop-blur-2xl bg-white/[0.08] rounded-2xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
                {attributMenuItems.map((item, index) => (
                  <div key={item.label}>
                    <button
                      onClick={() => {
                        item.onClick();
                        setIsAttributMenuOpen(false);
                      }}
                      className="w-full px-4 py-3.5 flex items-center gap-3 text-white/90 hover:bg-white/[0.1] transition-all duration-200 group"
                    >
                      <item.icon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                    {index < attributMenuItems.length - 1 && (
                      <Separator className="bg-white/[0.08]" />
                    )}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
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
  );
};
