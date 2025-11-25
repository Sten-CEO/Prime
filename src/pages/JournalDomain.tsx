import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, ArrowLeft, Home, Award, BookOpen, Target, User, Settings } from "lucide-react";
import { JournalEntryCard } from "@/components/journal/JournalEntryCard";
import { AddEntryModal } from "@/components/journal/AddEntryModal";
import { EntryDetailView } from "@/components/journal/EntryDetailView";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format, startOfWeek, isSameWeek, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import bgImage from "@/assets/black-shapes-bg.jpg";

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

  // Group entries by month
  const groupEntriesByMonth = () => {
    const grouped: Record<string, { entries: JournalEntry[], year: string, month: string }> = {};
    
    entries.forEach((entry) => {
      const date = parseISO(entry.entry_date);
      const monthKey = format(date, "MMMM yyyy", { locale: fr });
      const year = format(date, "yyyy");
      const month = format(date, "MM");
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = { entries: [], year, month };
      }
      grouped[monthKey].entries.push(entry);
    });
    
    return grouped;
  };

  // Check if we need a week separator
  const needsWeekSeparator = (currentEntry: JournalEntry, previousEntry: JournalEntry | null) => {
    if (!previousEntry) return false;
    
    const currentDate = parseISO(currentEntry.entry_date);
    const previousDate = parseISO(previousEntry.entry_date);
    
    // Get timezone from localStorage or default to Europe/Paris
    const timezone = localStorage.getItem('prime_timezone') || 'Europe/Paris';
    
    return !isSameWeek(currentDate, previousDate, { weekStartsOn: 1, locale: fr });
  };

  useEffect(() => {
    fetchEntries();
  }, [domain]);

  if (selectedEntry) {
    return (
      <div className="min-h-screen bg-black relative">
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(${bgImage})` }}
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
              <button 
                onClick={() => navigate("/journal")}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.08] transition-colors cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-gray-400 opacity-70" />
              </button>
              <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors">
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
            onEdited={() => {
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
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${bgImage})` }}
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
            <button 
              onClick={() => navigate("/journal")}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.08] transition-colors cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors">
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/journal")}
                className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-full p-2 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-white/70" />
              </button>
              <h1 className="text-3xl font-bold text-white">
                Journal – {getDomainLabel(domain || "")}
              </h1>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl px-6 py-3 hover:bg-white/[0.04] hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-white/70" />
              <span className="text-white text-sm font-medium">Nouvelle entrée</span>
            </button>
          </div>

          <div className="space-y-8">
            {loading ? (
              <div className="text-center text-white/60 py-12">
                Chargement des entrées...
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center text-white/60 py-12">
                Aucune entrée pour ce domaine. Commencez par en créer une !
              </div>
            ) : (
              Object.entries(groupEntriesByMonth()).map(([monthKey, monthData]) => (
                <button
                  key={monthKey}
                  onClick={() => navigate(`/journal/${domain}/${monthData.year}/${monthData.month}`)}
                  className="w-full backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl px-6 py-4 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all cursor-pointer text-left"
                >
                  <h2 className="text-lg font-medium text-white capitalize">
                    Entrées de {monthKey}
                  </h2>
                  <p className="text-sm text-white/60 mt-1">
                    {monthData.entries.length} {monthData.entries.length === 1 ? 'entrée' : 'entrées'}
                  </p>
                </button>
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
