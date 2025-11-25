import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Accueil from "./pages/Accueil";
import Domaines from "./pages/Domaines";
import DomainPerformances from "./pages/DomainPerformances";
import Categories from "./pages/Categories";
import Journal from "./pages/Journal";
import JournalDomain from "./pages/JournalDomain";
import JournalMonth from "./pages/JournalMonth";
import JournalEntry from "./pages/JournalEntry";
import QuickNotes from "./pages/QuickNotes";
import Profil from "./pages/Profil";
import Parametres from "./pages/Parametres";
import PrimeHistory from "./pages/PrimeHistory";
import PrimeTargets from "./pages/PrimeTargets";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/accueil" element={<Accueil />} />
          <Route path="/domaines" element={<Domaines />} />
          <Route path="/domaines/:slug" element={<Domaines />} />
          <Route path="/domaines/:slug/performances" element={<DomainPerformances />} />
          <Route path="/domaines/:slug/categories" element={<Categories />} />
          <Route path="/domaines/:slug/categories/:category" element={<Categories />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/entry/:id" element={<JournalEntry />} />
          <Route path="/journal/:domain" element={<JournalDomain />} />
          <Route path="/journal/:domain/:year/:month" element={<JournalMonth />} />
          <Route path="/quick-notes" element={<QuickNotes />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/parametres" element={<Parametres />} />
          <Route path="/prime-targets" element={<PrimeTargets />} />
          <Route path="/prime-history" element={<PrimeHistory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
