import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Accueil from "./pages/Accueil";
import Domaines from "./pages/Domaines";
import Categories from "./pages/Categories";
import Journal from "./pages/Journal";
import JournalDomain from "./pages/JournalDomain";
import Profil from "./pages/Profil";
import Parametres from "./pages/Parametres";
import PrimeHistory from "./pages/PrimeHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/accueil" element={<Accueil />} />
          <Route path="/domaines" element={<Domaines />} />
          <Route path="/domaines/:slug" element={<Domaines />} />
          <Route path="/domaines/:slug/categories/:category" element={<Categories />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:domain" element={<JournalDomain />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/parametres" element={<Parametres />} />
          <Route path="/prime-history" element={<PrimeHistory />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
