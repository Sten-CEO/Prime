import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { ChevronLeft } from "lucide-react";
import { HighBar } from "@/components/HighBar";

const Categories = () => {
  const navigate = useNavigate();
  const { domainId } = useParams();
  const [isSliding, setIsSliding] = useState(false);

  const handleNavigateBack = () => {
    setIsSliding(true);
    setTimeout(() => {
      navigate("/domaines");
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
          isSliding ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Navigation Arrow */}
          <button
            onClick={handleNavigateBack}
            className="absolute top-32 left-12 w-12 h-12 flex items-center justify-center rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white/70" />
          </button>

          {/* Top Large Block - Score & Courbe Catégorie */}
          <div className="mb-6">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl w-[80%]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-white">Catégorie Business</h2>
                  <p className="text-white/60 text-sm mt-1">Stratégie & Croissance</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-white mb-1">92</div>
                  <div className="text-sm text-white/60">Score Catégorie</div>
                </div>
              </div>
              
              {/* Chart Area */}
              <div className="h-48 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-6">
                <div className="flex items-end justify-between h-full gap-2">
                  {[70, 75, 73, 80, 85, 88, 92].map((value, index) => (
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
              {/* Métriques Block */}
              <div className="flex-1">
                <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/20 p-8 shadow-2xl h-64">
                  <h3 className="text-xl font-semibold text-white mb-4">Métriques Clés</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/70 text-sm">Chiffre d'affaires</span>
                        <span className="text-white font-semibold">95%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full" style={{ width: '95%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/70 text-sm">Acquisitions clients</span>
                        <span className="text-white font-semibold">88%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full" style={{ width: '88%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/70 text-sm">Innovation</span>
                        <span className="text-white font-semibold">92%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Journal Block */}
              <div className="flex-1">
                <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/20 p-8 shadow-2xl h-64">
                  <h3 className="text-xl font-semibold text-white mb-4">Journal</h3>
                  <div className="space-y-3">
                    <div className="backdrop-blur-md bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="text-white/90 text-sm mb-1">Réunion stratégique Q1</div>
                      <div className="text-white/50 text-xs">Il y a 2 heures</div>
                    </div>
                    <div className="backdrop-blur-md bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="text-white/90 text-sm mb-1">Analyse marché concurrentiel</div>
                      <div className="text-white/50 text-xs">Hier</div>
                    </div>
                    <div className="backdrop-blur-md bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="text-white/90 text-sm mb-1">Lancement campagne marketing</div>
                      <div className="text-white/50 text-xs">Il y a 3 jours</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Vertical Block */}
            <div className="w-64">
              <div className="backdrop-blur-md bg-white/5 rounded-3xl border border-white/10 p-6 shadow-xl h-64">
                <h3 className="text-lg font-semibold text-white mb-4">Performances Libres</h3>
                <div className="space-y-4">
                  <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-white/90 font-semibold mb-1">Négociation</div>
                    <div className="text-3xl font-bold text-white">A+</div>
                  </div>
                  <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-white/90 font-semibold mb-1">Networking</div>
                    <div className="text-3xl font-bold text-white">A</div>
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

export default Categories;
