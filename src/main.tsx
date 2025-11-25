import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  </StrictMode>,
);
