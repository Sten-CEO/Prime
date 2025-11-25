import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Home, Award, BookOpen, Target, User, Settings, ChevronRight } from "lucide-react";
import { DayEditor } from "@/components/journal/DayEditor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format, parseISO, subDays } from "date-fns";
import { fr } from "date-fns/locale";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  domain_id: string;
  entry_date: string;
  created_at: string;
}

const domains = [
  { id: "general", label: "Global", icon: "📝" },
  { id: "business", label: "Business", icon: "💼" },
  { id: "sport", label: "Sport", icon: "🥊" },
  { id: "social", label: "Social", icon: "👥" },
  { id: "sante", label: "Santé", icon: "❤️" },
  { id: "developpement", label: "Dev", icon: "📚" },
  { id: "finance", label: "Finance", icon: "💰" },
];

const Journal = () => {
  const navigate = useNavigate();
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const fetchRecentEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Get last 5 entries
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false })
        .limit(5);

      if (error) throw error;

      setRecentEntries(data || []);
    } catch (error) {
      console.error("Error fetching recent entries:", error);
    }
  };

  useEffect(() => {
    fetchRecentEntries();
  }, []);

  const handleDomainClick = (domainId: string) => {
    if (domainId === "general") {
      setSelectedDomain(null);
    } else {
      navigate(`/journal/${domainId}`);
    }
  };

  const handleEntryClick = (entry: JournalEntry) => {
    // Navigate to domain journal with month filter
    const date = parseISO(entry.entry_date);
    const year = format(date, "yyyy");
    const month = format(date, "MM");
    navigate(`/journal/${entry.domain_id}/${year}/${month}`);
  };

  const getDomainLabel = (domainId: string) => {
    const domain = domains.find(d => d.id === domainId);
    return domain ? domain.label : domainId;
  };

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
          {/* Header */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <h1 className="text-3xl font-bold text-white mb-2">Journal</h1>
            <p className="text-white/60 text-sm mb-6">
              Écris, analyse, surligne. Tes réflexions deviennent des insights.
            </p>

            {/* Domain Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              {domains.map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => handleDomainClick(domain.id)}
                  className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.08] rounded-full px-4 py-2 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all cursor-pointer text-white text-sm font-medium flex items-center gap-2"
                >
                  <span>{domain.icon}</span>
                  <span>{domain.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Day Editor */}
          <DayEditor onInsightCreated={fetchRecentEntries} />

          {/* Recent Entries */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Entrées récentes</h2>
            
            {recentEntries.length === 0 ? (
              <p className="text-white/50 text-sm text-center py-8">
                Aucune entrée récente
              </p>
            ) : (
              <div className="space-y-3">
                {recentEntries.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => handleEntryClick(entry)}
                    className="w-full backdrop-blur-xl bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 hover:bg-white/[0.05] hover:border-white/[0.08] transition-all cursor-pointer text-left group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-semibold text-white px-4 py-1.5 rounded-full bg-gradient-to-br from-white/[0.15] to-white/[0.08] border border-white/[0.25] shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-sm">
                            {getDomainLabel(entry.domain_id)}
                          </span>
                          <span className="text-xs text-white/40">
                            {format(parseISO(entry.entry_date), "d MMMM yyyy", { locale: fr })}
                          </span>
                        </div>
                        
                        <p className="text-sm text-white/60 line-clamp-2">
                          {entry.content.substring(0, 120)}
                          {entry.content.length > 120 ? "..." : ""}
                        </p>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
