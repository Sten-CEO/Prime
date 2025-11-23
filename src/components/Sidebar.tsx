import { Home, Award, BookOpen, Target, User, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed left-6 top-6 bottom-6 w-20 z-20">
      <div className="h-full backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center py-6 px-3">
        {/* Prime Logo */}
        <div className="mb-4">
          <span className="text-white font-bold text-lg tracking-tight">Prime.</span>
        </div>
        
        <Separator className="w-10 bg-white/20 mb-8" />
        
        {/* Top Navigation - Home Icon */}
        <div className="flex-none">
          <button 
            onClick={() => navigate("/accueil")}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${
              isActive("/accueil") ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <Home className={`w-5 h-5 ${isActive("/accueil") ? "text-white" : "text-gray-400 opacity-70"}`} />
          </button>
          <Separator className="w-10 bg-white/20 mx-auto my-4" />
        </div>
        
        {/* Middle Navigation Icons */}
        <div className="flex-1 flex flex-col gap-4">
          <button 
            onClick={() => navigate("/domaines")}
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${
              isActive("/domaines") || location.pathname.startsWith("/categories") ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <Award className={`w-5 h-5 ${isActive("/domaines") || location.pathname.startsWith("/categories") ? "text-white" : "text-gray-400 opacity-70"}`} />
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors">
            <BookOpen className="w-5 h-5 text-gray-400 opacity-70" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors">
            <Target className="w-5 h-5 text-gray-400 opacity-70" />
          </button>
          <Separator className="w-10 bg-white/20 mx-auto my-2" />
        </div>
        
        {/* Bottom Navigation Icons */}
        <div className="flex-none flex flex-col gap-4 mt-8">
          <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors">
            <User className="w-5 h-5 text-gray-400 opacity-70" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5 text-gray-400 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
};
