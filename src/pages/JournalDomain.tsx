import { useState } from "react";
import { useParams } from "react-router-dom";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { Sidebar } from "@/components/Sidebar";
import { domains } from "@/data/mockData";
import { Plus } from "lucide-react";

const JournalDomain = () => {
  const { domainId } = useParams();
  const domain = domains.find((d) => d.id === domainId);

  const [entries, setEntries] = useState([
    {
      id: "1",
      date: "2025-01-18",
      content: "Aujourd'hui, j'ai travaillé sur le nouveau produit. L'équipe est motivée.",
    },
  ]);

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
            <h1 className="text-4xl font-bold text-white mb-2">
              Journal - {domain?.name || "Domaine"}
            </h1>
            <p className="text-white/60">Réflexions spécifiques à ce domaine</p>
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
                <p className="text-white/90 leading-relaxed">{entry.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalDomain;
