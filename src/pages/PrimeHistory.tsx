import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Home, Award, BookOpen, Target, User, Settings, CheckCircle2, Archive, Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface HistoryEvent {
  id: string;
  type: "completed" | "archived";
  targetId: string;
  targetTitle: string;
  domain: string;
  category?: string;
  date: string;
  progress: number;
  importance: "low" | "normal" | "crucial";
  duration?: string;
}

const PrimeHistory = () => {
  const navigate = useNavigate();
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");

  // Données de démo pour l'historique
  const historyEvents: HistoryEvent[] = [
    {
      id: "1",
      type: "completed",
      targetId: "4",
      targetTitle: "Économiser 10 000€",
      domain: "finance",
      category: "Épargne",
      date: "2025-11-20T15:30:00",
      progress: 100,
      importance: "crucial",
      duration: "83 jours",
    },
    {
      id: "2",
      type: "archived",
      targetId: "5",
      targetTitle: "Organiser un dîner avec 10 amis",
      domain: "social",
      category: "Relations",
      date: "2025-10-20T12:00:00",
      progress: 50,
      importance: "low",
    },
    {
      id: "3",
      type: "completed",
      targetId: "6",
      targetTitle: "Terminer formation React avancé",
      domain: "developpement",
      category: "Formation",
      date: "2025-10-10T18:45:00",
      progress: 100,
      importance: "crucial",
      duration: "45 jours",
    },
    {
      id: "4",
      type: "completed",
      targetId: "7",
      targetTitle: "Perdre 5kg",
      domain: "sante",
      category: "Fitness",
      date: "2025-09-28T09:15:00",
      progress: 100,
      importance: "normal",
      duration: "62 jours",
    },
    {
      id: "5",
      type: "archived",
      targetId: "8",
      targetTitle: "Apprendre la guitare",
      domain: "developpement",
      date: "2025-09-15T14:20:00",
      progress: 30,
      importance: "low",
    },
  ];

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

  // Filtrer les événements
  const filteredEvents = historyEvents.filter(event => {
    if (filterDomain !== "all" && event.domain !== filterDomain) return false;
    if (filterType !== "all" && event.type !== filterType) return false;
    if (filterPeriod !== "all") {
      const eventDate = new Date(event.date);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (filterPeriod === "week" && daysDiff > 7) return false;
      if (filterPeriod === "month" && daysDiff > 30) return false;
      if (filterPeriod === "year" && daysDiff > 365) return false;
    }
    return true;
  });

  // Grouper par mois
  const eventsByMonth = filteredEvents.reduce((acc, event) => {
    const monthKey = format(new Date(event.date), "MMMM yyyy", { locale: fr });
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(event);
    return acc;
  }, {} as Record<string, HistoryEvent[]>);

  const completedCount = historyEvents.filter(e => e.type === "completed").length;
  const archivedCount = historyEvents.filter(e => e.type === "archived").length;

  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Background image - fixed */}
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
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
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

      {/* Content - scrollable */}
      <div className="relative z-10 ml-32 min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 mb-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Prime History</h1>
                <p className="text-white/60 text-sm">L'historique de tous tes objectifs complétés et archivés</p>
              </div>

              {/* Stats */}
              <div className="flex gap-4">
                <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 min-w-[120px]">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-white/50">Complétés</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{completedCount}</p>
                </div>

                <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 min-w-[120px]">
                  <div className="flex items-center gap-2 mb-1">
                    <Archive className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-white/50">Archivés</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{archivedCount}</p>
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-3 items-center">
              <Select value={filterDomain} onValueChange={setFilterDomain}>
                <SelectTrigger className="w-40 bg-white/[0.03] border-white/[0.08] text-white h-9">
                  <SelectValue placeholder="Domaine" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/[0.1]">
                  <SelectItem value="all" className="text-white">Tous les domaines</SelectItem>
                  <SelectItem value="business" className="text-white">Business</SelectItem>
                  <SelectItem value="sport" className="text-white">Sport</SelectItem>
                  <SelectItem value="social" className="text-white">Social</SelectItem>
                  <SelectItem value="sante" className="text-white">Santé</SelectItem>
                  <SelectItem value="developpement" className="text-white">Développement</SelectItem>
                  <SelectItem value="finance" className="text-white">Finance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40 bg-white/[0.03] border-white/[0.08] text-white h-9">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/[0.1]">
                  <SelectItem value="all" className="text-white">Tous</SelectItem>
                  <SelectItem value="completed" className="text-white">Complétés</SelectItem>
                  <SelectItem value="archived" className="text-white">Archivés</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-40 bg-white/[0.03] border-white/[0.08] text-white h-9">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/[0.1]">
                  <SelectItem value="all" className="text-white">Toute la période</SelectItem>
                  <SelectItem value="week" className="text-white">7 derniers jours</SelectItem>
                  <SelectItem value="month" className="text-white">30 derniers jours</SelectItem>
                  <SelectItem value="year" className="text-white">Cette année</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => {
                  setFilterDomain("all");
                  setFilterType("all");
                  setFilterPeriod("all");
                }}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white text-xs"
              >
                Réinitialiser
              </Button>
            </div>
          </div>

          {/* Timeline */}
          {Object.keys(eventsByMonth).length === 0 ? (
            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-12 text-center">
              <p className="text-white/40">Aucun événement dans l'historique pour ces filtres</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(eventsByMonth).map(([month, events]) => (
                <div key={month}>
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-white/60" />
                    <h2 className="text-xl font-semibold text-white capitalize">{month}</h2>
                    <div className="flex-1 h-px bg-white/[0.08]" />
                  </div>

                  <div className="space-y-3">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 hover:bg-white/[0.04] transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              event.type === "completed" 
                                ? "bg-green-500/20" 
                                : "bg-gray-500/20"
                            }`}>
                              {event.type === "completed" ? (
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                              ) : (
                                <Archive className="w-5 h-5 text-gray-400" />
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-white font-medium">{event.targetTitle}</h3>
                                {event.importance === "crucial" && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                    ⭐ Crucial
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                                <span>{getDomainLabel(event.domain)}</span>
                                {event.category && (
                                  <>
                                    <span>•</span>
                                    <span>{event.category}</span>
                                  </>
                                )}
                                <span>•</span>
                                <span>{format(new Date(event.date), "d MMMM yyyy 'à' HH:mm", { locale: fr })}</span>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-white/40" />
                                  <span className="text-xs text-white/60">
                                    Progression: <span className="font-medium text-white">{event.progress}%</span>
                                  </span>
                                </div>
                                
                                {event.duration && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-white/40" />
                                    <span className="text-xs text-white/60">
                                      Durée: <span className="font-medium text-white">{event.duration}</span>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <span className={`text-xs px-3 py-1.5 rounded-full border ${
                            event.type === "completed"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }`}>
                            {event.type === "completed" ? "Complété" : "Archivé"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrimeHistory;
