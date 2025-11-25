import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowLeft } from "lucide-react";
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
        <div className="relative z-10 p-8">
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
      
      <div className="relative z-10 p-8">
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
