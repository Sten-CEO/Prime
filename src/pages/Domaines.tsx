import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { HighBar } from "@/components/HighBar";
import { Sidebar } from "@/components/Sidebar";
import { domains, performancesLibres, chartData } from "@/data/mockData";

const Domaines = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSliding, setIsSliding] = useState(false);
  const selectedDomainId = searchParams.get("domain") || "business";
  const selectedDomain = domains.find((d) => d.id === selectedDomainId) || domains[0];

  const handleNavigateToCategory = () => {
    setIsSliding(true);
    setTimeout(() => {
      navigate(`/categories/${selectedDomainId}`);
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
          onClick={() => {}}
          className="text-white/70 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNavigateToCategory}
          className="text-white/70 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content with slide animation */}
      <div
        className={`relative z-10 px-20 pt-24 pb-8 transition-transform duration-300 ease-out ${
          isSliding ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          {/* Top Large Block - Score & Courbe */}
          <div className="mb-5 relative">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-10 shadow-2xl">

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">{selectedDomain.name}</h2>
                <div className="text-right">
                  <div className="text-5xl font-bold text-white mb-1">{selectedDomain.score}</div>
                  <div className="text-sm text-white/60">Score Global</div>
                </div>
              </div>
              
              {/* Chart Area */}
              <div className="h-40 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-6">
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

          {/* Bottom Row - Three Blocks */}
          <div className="flex gap-5">
            {/* Performances Libres Block */}
            <div className="flex-1">
              <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/20 p-8 shadow-2xl h-56">
                <h3 className="text-lg font-semibold text-white mb-6">Performances Libres</h3>
                <div className="space-y-4">
                  {(performancesLibres[selectedDomainId as keyof typeof performancesLibres] || []).map((perf, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">{perf.name}</span>
                      <span className="text-white font-semibold">{perf.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Objectifs Actifs Block */}
            <div className="flex-1">
              <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/20 p-8 shadow-2xl h-56">
                <h3 className="text-lg font-semibold text-white mb-6">Objectifs Actifs</h3>
                <div className="space-y-3">
                  <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-white/90 text-sm">Augmenter le CA de 20%</div>
                    <div className="text-white/50 text-xs mt-1">En cours</div>
                  </div>
                  <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-white/90 text-sm">Lancer nouveau produit</div>
                    <div className="text-white/50 text-xs mt-1">En cours</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tendances Block */}
            <div className="w-48">
              <div className="backdrop-blur-md bg-white/5 rounded-3xl border border-white/10 p-6 shadow-xl h-56">
                <h3 className="text-base font-semibold text-white mb-6">Tendances</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-white/60 text-xs mb-1">Semaine</div>
                    <div className="text-xl font-bold text-white">+12%</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs mb-1">Mois</div>
                    <div className="text-xl font-bold text-white">+24%</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs mb-1">Année</div>
                    <div className="text-xl font-bold text-white">+68%</div>
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
