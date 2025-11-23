import bgImage from "@/assets/black-shapes-bg.jpg";
import { Home, Award, BookOpen, Target, User, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Accueil = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Glass Sidebar */}
      <div className="absolute left-6 top-6 bottom-6 w-20 z-20">
        <div className="h-full backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center py-6 px-3">
          {/* Prime Logo */}
          <div className="mb-4">
            <span className="text-white font-bold text-lg tracking-tight">Prime.</span>
          </div>
          
          <Separator className="w-10 bg-white/20 mb-8" />
          
          {/* Top Navigation - Home Icon */}
          <div className="flex-none mb-8">
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors">
              <Home className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
          </div>
          
          {/* Middle Navigation Icons */}
          <div className="flex-1 flex flex-col gap-4">
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors">
              <Award className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors">
              <BookOpen className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors">
              <Target className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
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
      
      {/* Content */}
      <div className="relative z-10 ml-32">
        {/* Page d'accueil */}
      </div>
    </div>
  );
};

export default Accueil;
