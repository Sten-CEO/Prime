import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Home, Award, BookOpen, Target, User, Settings, ChevronRight } from "lucide-react";
import { DayEditor } from "@/components/journal/DayEditor";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  domain_id: string;
  entry_date: string;
  created_at: string;
}

const domains: Record<string, { label: string; icon: string }> = {
  general: { label: "Général", icon: "📝" },
  business: { label: "Business", icon: "💼" },
  sport: { label: "Sport", icon: "🥊" },
  social: { label: "Social", icon: "👥" },
  sante: { label: "Santé", icon: "❤️" },
  developpement: { label: "Développement", icon: "📚" },
  finance: { label: "Finance", icon: "💰" },
};

const JournalDomain = () => {
  const { domain } = useParams<{ domain: string }>();
  const navigate = useNavigate();
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);

  const domainInfo = domains[domain || "general"];

  const fetchRecentEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("domain_id", domain)
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
  }, [domain]);

  const handleEntryClick = (entry: JournalEntry) => {
    const date = parseISO(entry.entry_date);
    const year = format(date, "yyyy");
    const month = format(date, "MM");
    navigate(`/journal/${entry.domain_id}/${year}/${month}`);
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
            <button 
              onClick={() => navigate("/journal")}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.08] transition-colors cursor-pointer"
            >
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
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate("/journal")}
                className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-full p-2 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-white/70" />
              </button>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{domainInfo?.icon}</span>
                <h1 className="text-3xl font-bold text-white">
                  Journal – {domainInfo?.label}
                </h1>
              </div>
            </div>
            <p className="text-white/60 text-sm">
              Écris, surligne et capture tes insights pour ce domaine.
            </p>
          </div>

          {/* Day Editor */}
          <DayEditor domain={domain} onInsightCreated={fetchRecentEntries} />

          {/* Recent Entries */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Entrées récentes</h2>
            
            {recentEntries.length === 0 ? (
              <p className="text-white/50 text-sm text-center py-8">
                Aucune entrée récente pour ce domaine
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
                        <div className="mb-2">
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

export default JournalDomain;
