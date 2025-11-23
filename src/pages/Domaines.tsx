import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { ChevronRight } from "lucide-react";
import { HighBar } from "@/components/HighBar";

const Domaines = () => {
  const navigate = useNavigate();
  const [isSliding, setIsSliding] = useState(false);

  const handleNavigateToCategory = () => {
    setIsSliding(true);
    setTimeout(() => {
      navigate("/categories/business");
    }, 300);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* High Bar Navigation */}
      <HighBar />
      
      {/* Main Content with slide animation */}
      <div 
        className={`relative z-10 px-8 pt-28 pb-8 transition-transform duration-300 ease-out ${
          isSliding ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Navigation Arrow */}
          <button
            onClick={handleNavigateToCategory}
            className="absolute top-32 right-12 w-12 h-12 flex items-center justify-center rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white/70" />
          </button>

          {/* Top Large Block - Score & Courbe */}
          <div className="mb-6">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl w-[80%]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-white">Business</h2>
                <div className="text-right">
                  <div className="text-5xl font-bold text-white mb-1">87</div>
                  <div className="text-sm text-white/60">Score Global</div>
                </div>
              </div>
              
              {/* Chart Area */}
              <div className="h-48 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-6">
                <div className="flex items-end justify-between h-full gap-2">
                  {[65, 72, 68, 75, 82, 79, 87].map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col justify-end">
                      <div 
                        className="bg-gradient-to-t from-indigo-500/60 to-fuchsia-500/60 rounded-t-lg backdrop-blur-sm"
                        style={{ height: `${value}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Two Medium Blocks + Vertical Block */}
          <div className="flex gap-6">
            {/* Left Side - Two Blocks */}
            <div className="flex-1 flex gap-6">
              {/* Performances Libres Block */}
              <div className="flex-1">
                <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/20 p-8 shadow-2xl h-64">
                  <h3 className="text-xl font-semibold text-white mb-4">Performances Libres</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Productivité</span>
                      <span className="text-white font-semibold">92%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Créativité</span>
                      <span className="text-white font-semibold">85%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Leadership</span>
                      <span className="text-white font-semibold">78%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty Block / Other Content */}
              <div className="flex-1">
                <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/20 p-8 shadow-2xl h-64">
                  <h3 className="text-xl font-semibold text-white mb-4">Objectifs Actifs</h3>
                  <div className="space-y-3">
                    <div className="backdrop-blur-md bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="text-white/90 text-sm">Augmenter le CA de 20%</div>
                      <div className="text-white/50 text-xs mt-1">En cours</div>
                    </div>
                    <div className="backdrop-blur-md bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="text-white/90 text-sm">Lancer nouveau produit</div>
                      <div className="text-white/50 text-xs mt-1">En cours</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Vertical Block */}
            <div className="w-64">
              <div className="backdrop-blur-md bg-white/5 rounded-3xl border border-white/10 p-6 shadow-xl h-64">
                <h3 className="text-lg font-semibold text-white mb-4">Tendances</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-white/60 text-sm mb-1">Semaine</div>
                    <div className="text-2xl font-bold text-white">+12%</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm mb-1">Mois</div>
                    <div className="text-2xl font-bold text-white">+24%</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm mb-1">Année</div>
                    <div className="text-2xl font-bold text-white">+68%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Domaines;
