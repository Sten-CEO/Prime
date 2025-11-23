import { Briefcase, Dumbbell, Brain, Heart, Users, Wallet } from "lucide-react";
import { useState } from "react";

const domains = [
  { id: "business", icon: Briefcase, label: "Business" },
  { id: "sport", icon: Dumbbell, label: "Sport" },
  { id: "dev-perso", icon: Brain, label: "Développement" },
  { id: "sante", icon: Heart, label: "Santé" },
  { id: "relations", icon: Users, label: "Relations" },
  { id: "finance", icon: Wallet, label: "Finance" },
];

export const HighBar = () => {
  const [activeDomain, setActiveDomain] = useState("business");

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30">
      <div className="backdrop-blur-xl bg-white/5 rounded-full border border-white/10 px-5 py-2 shadow-2xl">
        <div className="flex items-center gap-5">
          {domains.map((domain) => {
            const Icon = domain.icon;
            const isActive = activeDomain === domain.id;
            
            return (
              <button
                key={domain.id}
                onClick={() => setActiveDomain(domain.id)}
                className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${
                  isActive 
                    ? "bg-white/20 backdrop-blur-md" 
                    : "hover:bg-white/10"
                }`}
                title={domain.label}
              >
                <Icon 
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-white" : "text-white/60"
                  }`} 
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
