import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProjects from "./components/admin/AdminProjects";
import AdminServices from "./components/admin/AdminServices";
import AdminTestimonials from "./components/admin/AdminTestimonials";
import AdminAbout from "./components/admin/AdminAbout";
import AdminSettings from "./components/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
