import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { trackPageView } from "@/utils/analytics";
import { useScrollDepth } from "@/hooks/useScrollDepth";
import TrackingScripts from "@/components/TrackingScripts";

const RouteTracker = () => {
  const { pathname } = useLocation();
  useScrollDepth();
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(pathname);
  }, [pathname]);
  return null;
};
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Lotes from "./pages/Lotes";
import LoteDetails from "./pages/LoteDetails";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import IndicacaoConectada from "./pages/IndicacaoConectada";
import LandingVender from "./pages/LandingVender";
import LandingPrecos from "./pages/LandingPrecos";
import LandingOfertas from "./pages/LandingOfertas";
import LandingComprar from "./pages/LandingComprar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <TrackingScripts />
        <BrowserRouter>
          <RouteTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/lotes" element={<Lotes />} />
            <Route path="/lotes/:id" element={<LoteDetails />} />
            <Route path="/noticias" element={<News />} />
            <Route path="/noticias/:slug" element={<NewsDetail />} />
            <Route path="/indicacao-conectada" element={<IndicacaoConectada />} />
            <Route path="/vender" element={<LandingVender />} />
            <Route path="/precos" element={<LandingPrecos />} />
            <Route path="/ofertas" element={<LandingOfertas />} />
            <Route path="/comprar" element={<LandingComprar />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
