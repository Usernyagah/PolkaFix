import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { wagmiConfig } from "@/lib/wagmiConfig";
import { Header } from "@/components/Header";
import Home from "./pages/Home";
import BountyDetail from "./pages/BountyDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const projectId = import.meta.env.VITE_PROJECT_ID_WALLETCONNECT || 'demo-project-id';

createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: false,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': 'hsl(263 70% 65%)',
    '--w3m-border-radius-master': '12px',
  },
});

const App = () => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bounty/:id" element={<BountyDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
