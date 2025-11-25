import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { EntryDetailView } from "@/components/journal/EntryDetailView";
import { Button } from "@/components/ui/button";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { Home, Award, BookOpen, Target, User, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const JournalEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        console.log("Fetching entry with id:", id);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("No user found, redirecting to auth");
          navigate("/auth");
          return;
        }

        console.log("User found:", user.id);
        const { data, error } = await supabase
          .from("journal_entries")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        console.log("Entry data:", data);
        setEntry(data);
      } catch (error) {
        console.error("Error fetching entry:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'entrée",
          variant: "destructive",
        });
        navigate("/journal");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEntry();
    } else {
      console.error("No ID provided in URL");
      setLoading(false);
    }
  }, [id, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDeleted = () => {
    navigate("/journal");
  };

  const handleEdited = () => {
    // Refetch entry
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex">
        {/* Background */}
        <div
          className="fixed inset-0 -z-10 opacity-40"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        {/* Sidebar */}
        <div className="w-20 flex-shrink-0 backdrop-blur-xl bg-white/[0.02] border-r border-white/[0.08] flex flex-col items-center py-6 gap-6 fixed left-0 top-0 bottom-0">
          <div className="text-white text-xl font-bold mb-2">Prime.</div>
        </div>

        {/* Loading content */}
        <div className="flex-1 ml-20 flex items-center justify-center">
          <div className="text-white/70 text-lg">Chargement de l'entrée...</div>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen flex">
        {/* Background */}
        <div
          className="fixed inset-0 -z-10 opacity-40"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        {/* Sidebar */}
        <div className="w-20 flex-shrink-0 backdrop-blur-xl bg-white/[0.02] border-r border-white/[0.08] flex flex-col items-center py-6 gap-6 fixed left-0 top-0 bottom-0">
          <div className="text-white text-xl font-bold mb-2">Prime.</div>
        </div>

        {/* Error content */}
        <div className="flex-1 ml-20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-white/70 text-lg mb-4">Entrée introuvable</div>
            <Button onClick={() => navigate("/journal")} className="backdrop-blur-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.15] text-white">
              Retour au journal
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10 opacity-40"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Sidebar */}
      <div className="w-20 flex-shrink-0 backdrop-blur-xl bg-white/[0.02] border-r border-white/[0.08] flex flex-col items-center py-6 gap-6 fixed left-0 top-0 bottom-0">
        <div className="text-white text-xl font-bold mb-2">Prime.</div>
        <Separator className="bg-white/[0.08] w-12" />
        <nav className="flex flex-col items-center gap-4 flex-1">
          <button
            onClick={() => navigate("/accueil")}
            className="p-3 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
          >
            <Home className="w-6 h-6" />
          </button>
          <button
            onClick={() => navigate("/domaines")}
            className="p-3 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
          >
            <Award className="w-6 h-6" />
          </button>
          <button
            onClick={() => navigate("/journal")}
            className="p-3 rounded-lg text-white bg-white/[0.08] transition-all"
          >
            <BookOpen className="w-6 h-6" />
          </button>
          <button
            onClick={() => navigate("/prime-targets")}
            className="p-3 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
          >
            <Target className="w-6 h-6" />
          </button>
        </nav>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => navigate("/profil")}
            className="p-3 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
          >
            <User className="w-6 h-6" />
          </button>
          <button
            onClick={() => navigate("/parametres")}
            className="p-3 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-20 p-8">
        <EntryDetailView
          id={entry.id}
          title={entry.title}
          content={entry.content}
          domain={entry.domain_id}
          date={new Date(entry.entry_date)}
          onBack={handleBack}
          onDeleted={handleDeleted}
          onEdited={handleEdited}
        />
      </div>
    </div>
  );
};

export default JournalEntry;
