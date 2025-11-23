import { useState } from "react";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { Sidebar } from "@/components/Sidebar";
import { domains } from "@/data/mockData";
import { Plus } from "lucide-react";

const Journal = () => {
  const [entries, setEntries] = useState([
    {
      id: "1",
      date: "2025-01-18",
      content:
        "Aujourd'hui, j'ai travaillé sur le nouveau produit. L'équipe est motivée et les résultats sont prometteurs. Je n'ai pas fait de cardio depuis 4 jours.",
    },
    {
      id: "2",
      date: "2025-01-17",
      content:
        "Séance de sport intense ce matin. Excellente réunion avec le client potentiel dans l'après-midi.",
    },
  ]);
  const [selectedText, setSelectedText] = useState("");
  const [showInsightDialog, setShowInsightDialog] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("");

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString() || "";
    if (text.length > 0) {
      setSelectedText(text);
      setShowInsightDialog(true);
    }
  };

  const handleAddInsight = () => {
    console.log("Adding insight:", selectedText, "to domain:", selectedDomain);
    setShowInsightDialog(false);
    setSelectedText("");
    setSelectedDomain("");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      <Sidebar />

      <div className="relative z-10 ml-20 px-20 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Journal Général</h1>
            <p className="text-white/60">Vos réflexions et observations quotidiennes</p>
          </div>

          {/* New Entry */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Plus className="w-5 h-5 text-white/60" />
              <h3 className="text-lg font-semibold text-white">Nouvelle entrée</h3>
            </div>
            <textarea
              placeholder="Écrivez vos pensées ici..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/40 resize-none focus:outline-none focus:border-white/20 transition-colors"
            />
            <div className="flex justify-end mt-4">
              <button className="backdrop-blur-md bg-accent-blue/80 hover:bg-accent-blue rounded-xl px-6 py-2 text-white font-medium transition-colors">
                Enregistrer
              </button>
            </div>
          </div>

          {/* Entries */}
          <div className="space-y-5">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-sm">{entry.date}</span>
                </div>
                <p
                  className="text-white/90 leading-relaxed select-text"
                  onMouseUp={handleTextSelection}
                >
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insight Dialog */}
      {showInsightDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Ajouter en Insight</h3>
            <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
              <p className="text-white/90 text-sm italic">"{selectedText}"</p>
            </div>
            <label className="block text-white/80 text-sm mb-2">Domaine associé</label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white mb-6 focus:outline-none focus:border-white/20"
            >
              <option value="">Sélectionner un domaine</option>
              {domains.map((domain) => (
                <option key={domain.id} value={domain.id} className="bg-gray-900">
                  {domain.name}
                </option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setShowInsightDialog(false)}
                className="flex-1 backdrop-blur-md bg-white/5 hover:bg-white/10 rounded-xl py-2 text-white transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddInsight}
                disabled={!selectedDomain}
                className="flex-1 backdrop-blur-md bg-accent-blue/80 hover:bg-accent-blue rounded-xl py-2 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
