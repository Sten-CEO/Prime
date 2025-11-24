import bgImage from "@/assets/black-shapes-bg.jpg";
import { Home, Award, BookOpen, Target, User, Settings, Briefcase, Dumbbell, Users, Heart, FileText, History } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DomainCard } from "@/components/DomainCard";
import { PrimeTargetCard } from "@/components/PrimeTargetCard";
import { InsightCard } from "@/components/InsightCard";
import { MultiDomainChart } from "@/components/MultiDomainChart";
import { QuickJournalCard } from "@/components/QuickJournalCard";
import { ScrollArea } from "@/components/ui/scroll-area";

const domains = [
  { name: "Business", icon: Briefcase, score: 8.5, trend: "+12%", fillRate: 85, status: "success" as const },
  { name: "Sport", icon: Dumbbell, score: 7.8, trend: "+8%", fillRate: 78, status: "success" as const },
  { name: "Social", icon: Users, score: 6.9, trend: "-3%", fillRate: 69, status: "warning" as const },
  { name: "Santé", icon: Heart, score: 9.2, trend: "+15%", fillRate: 92, status: "success" as const },
];

const targets = [
  { title: "Lancer le nouveau produit", progress: 75, deadline: "30 Nov 2025", status: "in-progress" as const, completed: false },
  { title: "Courir un marathon", progress: 45, deadline: "15 Déc 2025", status: "in-progress" as const, completed: false },
  { title: "Méditer 30 jours consécutifs", progress: 90, deadline: "28 Nov 2025", status: "in-progress" as const, completed: false },
  { title: "Lire 12 livres cette année", progress: 30, deadline: "31 Déc 2025", status: "delayed" as const, completed: false },
];

const insights = [
  { text: "La régularité est la clé du succès à long terme", date: "24 Nov", highlightColor: "purple" as const },
  { text: "Excellente synergie entre sport et productivité", date: "23 Nov", highlightColor: "blue" as const },
  { text: "Besoin de plus de temps pour les relations sociales", date: "22 Nov", highlightColor: "pink" as const },
  { text: "Les matinées sont mes moments les plus productifs", date: "21 Nov", highlightColor: "purple" as const },
  { text: "La méditation améliore ma concentration", date: "20 Nov", highlightColor: "blue" as const },
];

const Accueil = () => {
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Background image - fixed */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Glass Sidebar */}
      <div className="fixed left-6 top-6 bottom-6 w-20 z-20">
        <div className="h-full backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center py-6 px-3">
          <div className="mb-4">
            <span className="text-white font-bold text-lg tracking-tight">Prime.</span>
          </div>
          
          <Separator className="w-10 bg-white/20 mb-8" />
          
          <div className="flex-none">
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors">
              <Home className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <Separator className="w-10 bg-white/20 mx-auto my-4" />
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors">
              <Award className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors">
              <BookOpen className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors">
              <Target className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <Separator className="w-10 bg-white/20 mx-auto my-2" />
          </div>
          
          <div className="flex-none flex flex-col gap-4 mt-8">
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors">
              <User className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors">
              <Settings className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content - scrollable */}
      <div className="relative z-10 ml-32 min-h-screen">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          {/* Header */}
          <div className="backdrop-blur-xl bg-glass-bg/10 border border-glass-border/10 rounded-3xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <h1 className="text-2xl font-bold text-foreground">Dashboard Global</h1>
                <div className="flex gap-2">
                  <Button variant="ghost" className="backdrop-blur-xl bg-glass-bg/20 hover:bg-glass-bg/30 border border-glass-border/10 rounded-2xl text-foreground">
                    <FileText className="w-4 h-4 mr-2" />
                    Domaines
                  </Button>
                  <Button variant="ghost" className="backdrop-blur-xl bg-glass-bg/20 hover:bg-glass-bg/30 border border-glass-border/10 rounded-2xl text-foreground">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Journal
                  </Button>
                  <Button variant="ghost" className="backdrop-blur-xl bg-glass-bg/20 hover:bg-glass-bg/30 border border-glass-border/10 rounded-2xl text-foreground">
                    <History className="w-4 h-4 mr-2" />
                    Prime History
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground/60">{today}</span>
                <Avatar className="w-10 h-10 backdrop-blur-xl bg-glass-bg/20 border border-glass-border/20">
                  <AvatarFallback className="bg-glass-bg/30 text-foreground">U</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
          
          {/* Domain Cards - Horizontal Scroll */}
          <div className="mb-8">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-4 pb-4">
                {domains.map((domain) => (
                  <DomainCard key={domain.name} {...domain} />
                ))}
              </div>
            </ScrollArea>
          </div>
          
          {/* Multi-Domain Chart */}
          <div className="mb-8">
            <MultiDomainChart />
          </div>
          
          {/* Grid Layout - Targets, Insights, Journal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Prime Targets */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground ml-2">Prime Targets</h2>
              <div className="space-y-3">
                {targets.map((target, index) => (
                  <PrimeTargetCard key={index} {...target} />
                ))}
              </div>
            </div>
            
            {/* Insights */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground ml-2">Insights</h2>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <InsightCard key={index} {...insight} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          {/* Quick Journal */}
          <div className="mb-8">
            <QuickJournalCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accueil;
