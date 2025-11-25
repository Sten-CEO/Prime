import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, Home, Award, BookOpen, Target, User, Settings } from "lucide-react";
import { AddEntryModal } from "@/components/journal/AddEntryModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  domain_id: string;
  entry_date: string;
  created_at: string;
}

const Journal = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Non authentifié",
          description: "Vous devez être connecté pour voir vos entrées",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false });

      if (error) throw error;

      setEntries(data || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les entrées",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="min-h-screen bg-black relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/src/assets/black-shapes-bg.jpg')" }}
      />

      {/* Glass Sidebar */}
      <div className="fixed left-6 top-6 bottom-6 w-20 z-20">
        <div className="h-full backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.08] flex flex-col items-center py-6 px-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
          <div className="mb-4">
            <span className="text-white font-bold text-lg tracking-tight">Prime.</span>
          </div>
          
          <Separator className="w-10 bg-white/20 mb-8" />
          
          <div className="flex-none">
            <button 
              onClick={() => navigate("/accueil")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Home className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <Separator className="w-10 bg-white/20 mx-auto my-4" />
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            <button 
              onClick={() => navigate("/domaines/business")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Award className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.08] transition-colors">
              <BookOpen className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button 
              onClick={() => navigate("/prime-targets")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Target className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <Separator className="w-10 bg-white/20 mx-auto my-2" />
          </div>
          
          <div className="flex-none flex flex-col gap-4 mt-8">
            <button 
              onClick={() => navigate("/profil")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <User className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button 
              onClick={() => navigate("/parametres")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Settings className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 ml-32 min-h-screen">
        <div className="max-w-5xl mx-auto p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Journal</h1>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl px-6 py-3 hover:bg-white/[0.04] hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-white/70" />
              <span className="text-white text-sm font-medium">Nouvelle entrée</span>
            </button>
          </div>

          <div
            onClick={() => setShowAddModal(true)}
            className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
          >
            <Input
              placeholder="Écrire une entrée rapide..."
              className="bg-transparent border-none text-white placeholder:text-white/40 cursor-pointer h-8 px-0"
              readOnly
            />
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-white/60 py-12">
                Chargement des entrées...
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center text-white/60 py-12">
                Aucune entrée de journal. Commencez par en créer une !
              </div>
            ) : (
              (() => {
                // Group entries by domain
                const entriesByDomain = entries.reduce((acc, entry) => {
                  if (!acc[entry.domain_id]) {
                    acc[entry.domain_id] = [];
                  }
                  acc[entry.domain_id].push(entry);
                  return acc;
                }, {} as Record<string, JournalEntry[]>);

                const getDomainLabel = (domainId: string) => {
                  const domains: Record<string, string> = {
                    general: "Général",
                    business: "Business",
                    sport: "Sport",
                    social: "Social",
                    sante: "Santé",
                    developpement: "Développement",
                    finance: "Finance",
                  };
                  return domains[domainId] || domainId;
                };

                // Separate general entries from other domains
                const generalEntries = entriesByDomain["general"] || [];
                const otherDomains = Object.entries(entriesByDomain).filter(([domainId]) => domainId !== "general");

                return (
                  <>
                    {/* Journal général bloc */}
                    {generalEntries.length > 0 ? (
                      <div
                        onClick={() => navigate(`/journal/general`)}
                        className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <h2 className="text-sm font-medium text-white/70">Journal général</h2>
                          <span className="text-xs text-white/40">
                            {generalEntries.length} {generalEntries.length === 1 ? "entrée" : "entrées"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3">
                        <h2 className="text-sm font-medium text-white/70">Journal général</h2>
                        <p className="text-xs text-white/40 mt-1">Aucune entrée générale</p>
                      </div>
                    )}

                    {/* Other domain entries */}
                    {otherDomains.map(([domainId, domainEntries]) => (
                      <div
                        key={domainId}
                        onClick={() => navigate(`/journal/${domainId}`)}
                        className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-xl font-semibold text-white">
                            Journal {getDomainLabel(domainId)}
                          </h2>
                          <span className="text-sm text-white/40">
                            {domainEntries.length} {domainEntries.length === 1 ? "entrée" : "entrées"}
                          </span>
                        </div>
                        <p className="text-sm text-white/60">
                          Dernière entrée le {new Date(domainEntries[0].entry_date).toLocaleDateString("fr-FR", { 
                            day: "numeric", 
                            month: "long", 
                            year: "numeric" 
                          })}
                        </p>
                      </div>
                    ))}
                  </>
                );
              })()
            )}
          </div>
        </div>
      </div>

      <AddEntryModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={fetchEntries}
      />
    </div>
  );
};

export default Journal;
