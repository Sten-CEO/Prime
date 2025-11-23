import { useState } from "react";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { Sidebar } from "@/components/Sidebar";
import { domains, objectives as initialObjectives } from "@/data/mockData";
import { Plus, CheckCircle2 } from "lucide-react";

const PrimeTargets = () => {
  const [objectives, setObjectives] = useState(initialObjectives);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newObjective, setNewObjective] = useState({
    title: "",
    domain: "",
    deadline: "",
  });

  const handleComplete = (id: string) => {
    setObjectives((prev) => prev.filter((obj) => obj.id !== id));
    console.log("Objectif complété:", id);
  };

  const handleAddObjective = () => {
    if (newObjective.title && newObjective.domain) {
      const newObj = {
        id: Date.now().toString(),
        ...newObjective,
        progress: 0,
        completed: false,
      };
      setObjectives((prev) => [...prev, newObj]);
      setNewObjective({ title: "", domain: "", deadline: "" });
      setShowNewForm(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      <Sidebar />

      <div className="relative z-10 ml-20 px-20 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Prime Targets</h1>
            <p className="text-white/60">Vos objectifs actifs et en cours</p>
          </div>

          {/* Add New Button */}
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="backdrop-blur-xl bg-white/10 hover:bg-white/15 rounded-2xl border border-white/20 px-6 py-3 shadow-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Nouvel objectif</span>
          </button>

          {/* New Objective Form */}
          {showNewForm && (
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Créer un objectif</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Titre</label>
                  <input
                    type="text"
                    value={newObjective.title}
                    onChange={(e) => setNewObjective({ ...newObjective, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
                    placeholder="Ex: Augmenter le CA de 20%"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Domaine</label>
                  <select
                    value={newObjective.domain}
                    onChange={(e) => setNewObjective({ ...newObjective, domain: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/20"
                  >
                    <option value="" className="bg-gray-900">
                      Sélectionner un domaine
                    </option>
                    {domains.map((domain) => (
                      <option key={domain.id} value={domain.id} className="bg-gray-900">
                        {domain.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Deadline (optionnel)</label>
                  <input
                    type="date"
                    value={newObjective.deadline}
                    onChange={(e) => setNewObjective({ ...newObjective, deadline: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/20"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowNewForm(false)}
                    className="flex-1 backdrop-blur-md bg-white/5 hover:bg-white/10 rounded-xl py-2 text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddObjective}
                    className="flex-1 backdrop-blur-md bg-accent-blue/80 hover:bg-accent-blue rounded-xl py-2 text-white font-medium transition-colors"
                  >
                    Créer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Objectives List */}
          <div className="space-y-5">
            {objectives.map((obj) => (
              <div
                key={obj.id}
                className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 rounded-full bg-accent-blue" />
                      <h3 className="text-xl font-semibold text-white">{obj.title}</h3>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-white/60 text-sm">{obj.domain}</span>
                      {obj.deadline && (
                        <>
                          <span className="text-white/40">•</span>
                          <span className="text-white/60 text-sm">
                            Deadline: {new Date(obj.deadline).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Progression</span>
                        <span className="text-white font-semibold">{obj.progress}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-green rounded-full transition-all duration-500"
                          style={{ width: `${obj.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleComplete(obj.id)}
                    className="ml-6 hover:scale-110 transition-transform"
                  >
                    <CheckCircle2 className="w-8 h-8 text-white/40 hover:text-accent-green transition-colors" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimeTargets;
