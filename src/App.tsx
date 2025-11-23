import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Domaines from "./pages/Domaines";
import Categories from "./pages/Categories";
import Journal from "./pages/Journal";
import JournalDomain from "./pages/JournalDomain";
import PrimeTargets from "./pages/PrimeTargets";
import PrimeHistory from "./pages/PrimeHistory";
import Profil from "./pages/Profil";
import Settings from "./pages/Settings";
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
          <Route path="/accueil" element={<Home />} />
          <Route path="/domaines" element={<Domaines />} />
          <Route path="/categories/:domainId" element={<Categories />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:domainId" element={<JournalDomain />} />
          <Route path="/prime-targets" element={<PrimeTargets />} />
          <Route path="/prime-history" element={<PrimeHistory />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
