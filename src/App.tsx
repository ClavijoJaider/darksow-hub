import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { AuthService } from "@/lib/auth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Tienda from "./pages/Tienda";
import Foro from "./pages/Foro";
import ForoPost from "./pages/ForoPost";
import Perfil from "./pages/Perfil";
import Admin from "./pages/Admin";
import Wiki from "./pages/Wiki";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Initialize default users on app load
AuthService.initializeDefaultUsers();

const App = () => {
  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/tienda" element={<Tienda />} />
            <Route path="/foro" element={<Foro />} />
            <Route path="/foro/post/:postId" element={<ForoPost />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/wiki" element={<Wiki />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
