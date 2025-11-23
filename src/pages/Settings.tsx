import { useState } from "react";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { Sidebar } from "@/components/Sidebar";
import { domains as initialDomains } from "@/data/mockData";
import { Plus, Trash2 } from "lucide-react";

const Settings = () => {
  const [domains, setDomains] = useState(initialDomains);
  const [newDomain, setNewDomain] = useState("");

  const handleAddDomain = () => {
    if (newDomain.trim()) {
      setDomains([
        ...domains,
        {
          id: newDomain.toLowerCase().replace(/ /g, "-"),
          name: newDomain,
          score: 0,
          trend: 0,
          daysTracked: 0,
        },
      ]);
      setNewDomain("");
    }
  };

  const handleRemoveDomain = (id: string) => {
    setDomains(domains.filter((d) => d.id !== id));
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
            <h1 className="text-4xl font-bold text-white mb-2">Paramètres</h1>
            <p className="text-white/60">Configurez votre application Prime</p>
          </div>

          {/* Domains Management */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Gestion des Domaines</h2>

            {/* Add Domain */}
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="Nouveau domaine..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 transition-colors"
                onKeyPress={(e) => e.key === "Enter" && handleAddDomain()}
              />
              <button
                onClick={handleAddDomain}
                className="backdrop-blur-md bg-accent-blue/80 hover:bg-accent-blue rounded-xl px-6 py-3 text-white font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Ajouter
              </button>
            </div>

            {/* Domains List */}
            <div className="space-y-3">
              {domains.map((domain) => (
                <div
                  key={domain.id}
                  className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between"
                >
                  <span className="text-white font-medium">{domain.name}</span>
                  <button
                    onClick={() => handleRemoveDomain(domain.id)}
                    className="hover:bg-accent-red/20 rounded-lg p-2 transition-colors group"
                  >
                    <Trash2 className="w-5 h-5 text-white/40 group-hover:text-accent-red transition-colors" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Categories Management */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Gestion des Catégories</h2>
            <p className="text-white/60 text-sm">
              Ajoutez ou supprimez des catégories pour chaque domaine.
            </p>
            <div className="mt-6">
              <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/80 text-center">
                  Sélectionnez un domaine pour gérer ses catégories
                </p>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Préférences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Notifications</h3>
                  <p className="text-white/60 text-sm">Recevoir des rappels quotidiens</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Mode sombre</h3>
                  <p className="text-white/60 text-sm">Toujours actif</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue opacity-50"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
