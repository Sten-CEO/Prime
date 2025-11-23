import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HighBar } from "@/components/HighBar";
import { Sidebar } from "@/components/Sidebar";

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
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* High Bar Navigation */}
      <HighBar />
      
      {/* Navigation Arrows - Above main content */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        <button
          onClick={handleNavigateBack}
          className="text-white/70 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => {}}
          className="text-white/70 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content with slide animation */}
      <div
        className={`relative z-10 px-20 pt-24 pb-8 transition-transform duration-300 ease-out ${
          isSliding ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          {/* Top Large Block - Score & Courbe Catégorie */}
          <div className="mb-5">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
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
              <div className="h-40 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-6">
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

          {/* Bottom Row - Three Blocks */}
          <div className="flex gap-5">
            {/* Métriques Block */}
            <div className="flex-1">
              <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/20 p-8 shadow-2xl h-56">
                <h3 className="text-lg font-semibold text-white mb-6">Métriques Clés</h3>
                <div className="space-y-3">
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
              <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/20 p-8 shadow-2xl h-56">
                <h3 className="text-lg font-semibold text-white mb-6">Journal</h3>
                <div className="space-y-3">
                  <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-white/90 text-sm mb-1">Réunion stratégique Q1</div>
                    <div className="text-white/50 text-xs">Il y a 2 heures</div>
                  </div>
                  <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-white/90 text-sm mb-1">Analyse marché concurrentiel</div>
                    <div className="text-white/50 text-xs">Hier</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performances Libres Block */}
            <div className="w-48">
              <div className="backdrop-blur-md bg-white/5 rounded-3xl border border-white/10 p-6 shadow-xl h-56">
                <h3 className="text-base font-semibold text-white mb-6">Performances Libres</h3>
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
