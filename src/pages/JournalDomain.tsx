import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowLeft, Home, Award, BookOpen, Target, User, Settings } from "lucide-react";
import { JournalEntryCard } from "@/components/journal/JournalEntryCard";
import { AddEntryModal } from "@/components/journal/AddEntryModal";
import { EntryDetailView } from "@/components/journal/EntryDetailView";
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

const JournalDomain = () => {
  const { domain } = useParams<{ domain: string }>();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const getDomainLabel = (domainId: string) => {
    const domains: Record<string, string> = {
      business: "Business",
      sport: "Sport",
      social: "Social",
      sante: "Santé",
      developpement: "Développement",
      finance: "Finance",
    };
    return domains[domainId] || domainId;
  };

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
        .eq("domain_id", domain)
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
  }, [domain]);

  if (selectedEntry) {
    return (
      <div className="min-h-screen bg-black relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/src/assets/black-shapes-bg.jpg')" }}
        />

        {/* Sidebar */}
        <div className="fixed left-0 top-0 bottom-0 z-20 w-32 backdrop-blur-xl bg-white/[0.01] border-r border-white/[0.08] flex flex-col items-center py-8">
          <div className="flex-none mb-8">
            <h1 className="text-2xl font-bold text-white mb-4">Prime.</h1>
            <div className="w-16 h-px bg-white/20 mx-auto" />
          </div>

          <div className="flex-none mb-8">
            <button 
              onClick={() => navigate("/accueil")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Home className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <div className="w-10 h-px bg-white/20 mx-auto my-4" />
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
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors">
              <Target className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <div className="w-10 h-px bg-white/20 mx-auto my-2" />
          </div>
          
          <div className="flex-none flex flex-col gap-4 mt-8">
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors">
              <User className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors">
              <Settings className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
          </div>
        </div>

        <div className="relative z-10 ml-32 p-8">
          <EntryDetailView
            id={selectedEntry.id}
            title={selectedEntry.title}
            content={selectedEntry.content}
            domain={selectedEntry.domain_id}
            date={new Date(selectedEntry.entry_date)}
            onBack={() => setSelectedEntry(null)}
            onDeleted={() => {
              setSelectedEntry(null);
              fetchEntries();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/src/assets/black-shapes-bg.jpg')" }}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 z-20 w-32 backdrop-blur-xl bg-white/[0.01] border-r border-white/[0.08] flex flex-col items-center py-8">
        <div className="flex-none mb-8">
          <h1 className="text-2xl font-bold text-white mb-4">Prime.</h1>
          <div className="w-16 h-px bg-white/20 mx-auto" />
        </div>

        <div className="flex-none mb-8">
          <button 
            onClick={() => navigate("/accueil")}
            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <Home className="w-5 h-5 text-gray-400 opacity-70" />
          </button>
          <div className="w-10 h-px bg-white/20 mx-auto my-4" />
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
          <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors">
            <Target className="w-5 h-5 text-gray-400 opacity-70" />
          </button>
          <div className="w-10 h-px bg-white/20 mx-auto my-2" />
        </div>
        
        <div className="flex-none flex flex-col gap-4 mt-8">
          <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors">
            <User className="w-5 h-5 text-gray-400 opacity-70" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors">
            <Settings className="w-5 h-5 text-gray-400 opacity-70" />
          </button>
        </div>
      </div>
      
      <div className="relative z-10 ml-32 p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(`/domaines/${domain}`)}
                className="text-white/70 hover:text-white hover:bg-white/[0.05]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au domaine
              </Button>
              <h1 className="text-3xl font-bold text-white">
                Journal – {getDomainLabel(domain || "")}
              </h1>
            </div>
            
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle entrée
            </Button>
          </div>

          <div
            onClick={() => setShowAddModal(true)}
            className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
          >
            <Input
              placeholder="Écrire une entrée rapide..."
              className="bg-transparent border-none text-white placeholder:text-white/40 cursor-pointer"
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
                Aucune entrée pour ce domaine. Commencez par en créer une !
              </div>
            ) : (
              entries.map((entry) => (
                <JournalEntryCard
                  key={entry.id}
                  id={entry.id}
                  title={entry.title}
                  content={entry.content}
                  domain={entry.domain_id}
                  date={new Date(entry.entry_date)}
                  onClick={() => setSelectedEntry(entry)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <AddEntryModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        defaultDomain={domain}
        onSuccess={fetchEntries}
      />
    </div>
  );
};

export default JournalDomain;
