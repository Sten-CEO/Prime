import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Award, BookOpen, Target, User, Settings, Plus, TrendingUp, CheckCircle2, AlertTriangle } from "lucide-react";
import { PrimeTargetCard } from "@/components/targets/PrimeTargetCard";
import { CreateTargetModal } from "@/components/targets/CreateTargetModal";
import { TargetDetailPanel } from "@/components/targets/TargetDetailPanel";

interface PrimeTarget {
  id: string;
  title: string;
  description: string;
  domain: string;
  category?: string;
  startDate: string;
  deadline: string;
  progress: number;
  importance: "low" | "normal" | "crucial";
  status: "on-track" | "at-risk" | "late" | "completed" | "archived";
  showOnHome: boolean;
  completedAt?: string;
  archivedAt?: string;
}

const PrimeTargets = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [targets, setTargets] = useState<PrimeTarget[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<PrimeTarget | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTarget, setEditingTarget] = useState<PrimeTarget | null>(null);
  
  // Filtres
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");

  // Stats
  const activeTargets = targets.filter(t => !["completed", "archived"].includes(t.status));
  const completedThisMonth = targets.filter(t => {
    if (t.status !== "completed" || !t.completedAt) return false;
    const completedDate = new Date(t.completedAt);
    const now = new Date();
    return completedDate.getMonth() === now.getMonth() && completedDate.getFullYear() === now.getFullYear();
  });
  const successRate = targets.length > 0 
    ? Math.round((targets.filter(t => t.status === "completed").length / targets.length) * 100)
    : 0;

  // Données de démo
  useEffect(() => {
    const demoTargets: PrimeTarget[] = [
      {
        id: "1",
        title: "Lancer mon entreprise SaaS",
        description: "Développer et lancer la première version de mon SaaS",
        domain: "business",
        category: "Entrepreneuriat",
        startDate: "2025-11-01",
        deadline: "2025-12-31",
        progress: 65,
        importance: "crucial",
        status: "on-track",
        showOnHome: true,
      },
      {
        id: "2",
        title: "Courir un semi-marathon",
        description: "Participer au semi-marathon de Paris",
        domain: "sport",
        startDate: "2025-11-15",
        deadline: "2025-11-30",
        progress: 40,
        importance: "normal",
        status: "at-risk",
        showOnHome: true,
      },
      {
        id: "3",
        title: "Terminer la formation en développement",
        description: "Compléter le bootcamp de développement web",
        domain: "developpement",
        startDate: "2025-10-01",
        deadline: "2025-11-20",
        progress: 85,
        importance: "crucial",
        status: "late",
        showOnHome: false,
      },
      {
        id: "4",
        title: "Économiser 10 000€",
        description: "Atteindre l'objectif d'épargne pour l'investissement",
        domain: "finance",
        startDate: "2025-09-01",
        deadline: "2025-12-31",
        progress: 100,
        importance: "crucial",
        status: "completed",
        showOnHome: true,
        completedAt: "2025-11-20",
      },
      {
        id: "5",
        title: "Organiser un dîner avec 10 amis",
        description: "Réunir tous mes amis pour un grand dîner",
        domain: "social",
        startDate: "2025-10-01",
        deadline: "2025-10-15",
        progress: 50,
        importance: "low",
        status: "archived",
        showOnHome: false,
        archivedAt: "2025-10-20",
      },
    ];
    setTargets(demoTargets);

    // Si un ID d'objectif est passé en paramètre, l'ouvrir
    const targetId = searchParams.get("target");
    if (targetId) {
      const target = demoTargets.find(t => t.id === targetId);
      if (target) setSelectedTarget(target);
    }
  }, [searchParams]);

  const handleCreateTarget = (target: Omit<PrimeTarget, "id" | "status">) => {
    const newTarget: PrimeTarget = {
      ...target,
      id: Date.now().toString(),
      status: target.progress === 100 ? "completed" : "on-track",
    };
    setTargets([...targets, newTarget]);
    setShowCreateModal(false);
  };

  const handleUpdateTarget = (updatedTarget: PrimeTarget) => {
    setTargets(targets.map(t => t.id === updatedTarget.id ? updatedTarget : t));
    setSelectedTarget(updatedTarget);
  };

  const handleMarkComplete = (targetId: string) => {
    const target = targets.find(t => t.id === targetId);
    if (target) {
      const updated = {
        ...target,
        progress: 100,
        status: "completed" as const,
        completedAt: new Date().toISOString(),
      };
      setTargets(targets.map(t => t.id === targetId ? updated : t));
      if (selectedTarget?.id === targetId) setSelectedTarget(updated);
    }
  };

  const handleArchive = (targetId: string) => {
    const target = targets.find(t => t.id === targetId);
    if (target) {
      const updated = {
        ...target,
        status: "archived" as const,
        archivedAt: new Date().toISOString(),
      };
      setTargets(targets.map(t => t.id === targetId ? updated : t));
      if (selectedTarget?.id === targetId) setSelectedTarget(updated);
    }
  };

  const handleDelete = (targetId: string) => {
    setTargets(targets.filter(t => t.id !== targetId));
    if (selectedTarget?.id === targetId) setSelectedTarget(null);
  };

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

  // Filtrer les objectifs
  const filteredTargets = targets.filter(target => {
    if (filterDomain !== "all" && target.domain !== filterDomain) return false;
    if (filterCategory !== "all" && target.category !== filterCategory) return false;
    if (filterStatus !== "all" && target.status !== filterStatus) return false;
    // TODO: Implémenter le filtre de période
    return true;
  });

  const activeFiltered = filteredTargets.filter(t => !["completed", "archived"].includes(t.status));
  const onTrack = activeFiltered.filter(t => t.status === "on-track");
  const atRisk = activeFiltered.filter(t => t.status === "at-risk");
  const late = activeFiltered.filter(t => t.status === "late");
  const completed = filteredTargets.filter(t => t.status === "completed");
  const archived = filteredTargets.filter(t => t.status === "archived");

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
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.08] transition-colors">
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
      <div className="relative z-10 ml-32 min-h-screen pr-8">
        <div className="max-w-7xl mx-auto p-8 space-y-6">
          {/* Header avec stats */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Prime Targets</h1>
                <p className="text-white/60 text-sm">Tes objectifs clés, tous domaines confondus.</p>
              </div>

              {/* Mini stats */}
              <div className="flex gap-4">
                <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 min-w-[120px]">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-white/50">Actifs</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{activeTargets.length}</p>
                </div>

                <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 min-w-[120px]">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-white/50">Terminés ce mois</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{completedThisMonth.length}</p>
                </div>

                <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 min-w-[120px]">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-white/50">Taux de réussite</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{successRate}%</p>
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

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 bg-white/[0.03] border-white/[0.08] text-white h-9">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/[0.1]">
                  <SelectItem value="all" className="text-white">Tous</SelectItem>
                  <SelectItem value="on-track" className="text-white">À temps</SelectItem>
                  <SelectItem value="at-risk" className="text-white">À risque</SelectItem>
                  <SelectItem value="late" className="text-white">En retard</SelectItem>
                  <SelectItem value="completed" className="text-white">Terminés</SelectItem>
                  <SelectItem value="archived" className="text-white">Archivés</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-40 bg-white/[0.03] border-white/[0.08] text-white h-9">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/[0.1]">
                  <SelectItem value="all" className="text-white">Toute la timeline</SelectItem>
                  <SelectItem value="week" className="text-white">Cette semaine</SelectItem>
                  <SelectItem value="month" className="text-white">Ce mois</SelectItem>
                  <SelectItem value="year" className="text-white">Cette année</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Board des objectifs - 2 colonnes */}
          <div className="grid grid-cols-2 gap-6">
            {/* Colonne gauche - Objectifs actifs */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white px-2">Objectifs actifs</h2>

              {/* À temps */}
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <h3 className="text-lg font-medium text-white">À temps</h3>
                  <span className="text-sm text-white/40">({onTrack.length})</span>
                </div>
                {onTrack.length === 0 ? (
                  <p className="text-white/40 text-sm py-4 text-center">Aucun objectif à temps</p>
                ) : (
                  onTrack.map(target => (
                    <PrimeTargetCard
                      key={target.id}
                      target={target}
                      onView={() => setSelectedTarget(target)}
                      onComplete={() => handleMarkComplete(target.id)}
                      onArchive={() => handleArchive(target.id)}
                      onDelete={() => handleDelete(target.id)}
                      onEdit={() => { setEditingTarget(target); setShowCreateModal(true); }}
                      getDomainLabel={getDomainLabel}
                    />
                  ))
                )}
              </div>

              {/* À risque */}
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <h3 className="text-lg font-medium text-white">À risque</h3>
                  <span className="text-sm text-white/40">({atRisk.length})</span>
                </div>
                {atRisk.length === 0 ? (
                  <p className="text-white/40 text-sm py-4 text-center">Aucun objectif à risque</p>
                ) : (
                  atRisk.map(target => (
                    <PrimeTargetCard
                      key={target.id}
                      target={target}
                      onView={() => setSelectedTarget(target)}
                      onComplete={() => handleMarkComplete(target.id)}
                      onArchive={() => handleArchive(target.id)}
                      onDelete={() => handleDelete(target.id)}
                      onEdit={() => { setEditingTarget(target); setShowCreateModal(true); }}
                      getDomainLabel={getDomainLabel}
                    />
                  ))
                )}
              </div>

              {/* En retard */}
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <h3 className="text-lg font-medium text-white">En retard</h3>
                  <span className="text-sm text-white/40">({late.length})</span>
                </div>
                {late.length === 0 ? (
                  <p className="text-white/40 text-sm py-4 text-center">Aucun objectif en retard</p>
                ) : (
                  late.map(target => (
                    <PrimeTargetCard
                      key={target.id}
                      target={target}
                      onView={() => setSelectedTarget(target)}
                      onComplete={() => handleMarkComplete(target.id)}
                      onArchive={() => handleArchive(target.id)}
                      onDelete={() => handleDelete(target.id)}
                      onEdit={() => { setEditingTarget(target); setShowCreateModal(true); }}
                      getDomainLabel={getDomainLabel}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Colonne droite - Terminé / Archivé */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white px-2">Terminé & Archivé</h2>

              {/* Terminés récents */}
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <h3 className="text-lg font-medium text-white">Terminés récents</h3>
                  <span className="text-sm text-white/40">({completed.length})</span>
                </div>
                {completed.length === 0 ? (
                  <p className="text-white/40 text-sm py-4 text-center">Aucun objectif terminé</p>
                ) : (
                  completed.slice(0, 5).map(target => (
                    <PrimeTargetCard
                      key={target.id}
                      target={target}
                      compact
                      onView={() => setSelectedTarget(target)}
                      getDomainLabel={getDomainLabel}
                    />
                  ))
                )}
                {completed.length > 0 && (
                  <button
                    onClick={() => navigate("/prime-history")}
                    className="w-full mt-2 backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-2 hover:bg-white/[0.05] transition-all text-white text-sm"
                  >
                    Voir dans Prime History
                  </button>
                )}
              </div>

              {/* Archivés */}
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                  <h3 className="text-lg font-medium text-white">Archivés</h3>
                  <span className="text-sm text-white/40">({archived.length})</span>
                </div>
                {archived.length === 0 ? (
                  <p className="text-white/40 text-sm py-4 text-center">Aucun objectif archivé</p>
                ) : (
                  archived.map(target => (
                    <PrimeTargetCard
                      key={target.id}
                      target={target}
                      compact
                      onView={() => setSelectedTarget(target)}
                      getDomainLabel={getDomainLabel}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bouton flottant de création */}
        <button
          onClick={() => { setEditingTarget(null); setShowCreateModal(true); }}
          className="fixed bottom-8 right-8 backdrop-blur-xl bg-white/[0.15] border border-white/[0.2] rounded-full w-16 h-16 flex items-center justify-center hover:bg-white/[0.25] hover:scale-110 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] z-30"
        >
          <Plus className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Modals et panels */}
      <CreateTargetModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSave={editingTarget ? handleUpdateTarget : handleCreateTarget}
        editingTarget={editingTarget}
      />

      <TargetDetailPanel
        target={selectedTarget}
        onClose={() => setSelectedTarget(null)}
        onUpdate={handleUpdateTarget}
        onComplete={handleMarkComplete}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onEdit={(target) => { setEditingTarget(target); setShowCreateModal(true); }}
        getDomainLabel={getDomainLabel}
      />
    </div>
  );
};

export default PrimeTargets;
