import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PlanProvider } from "@/contexts/PlanContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/new-ui/Layout";
import { LoadingScreen } from "@/components/new-ui/LoadingScreen";
import Index from "./pages/Index";
import BrandGuide from "./pages/BrandGuide";
import Explore from "./pages/Explore";
import NewExplore from "./pages/new-ui/Explore";
import Chat from "./pages/Chat";
import NewChat from "./pages/new-ui/Chat";
import NewPlans from "./pages/new-ui/Plans";
import NewSettings from "./pages/new-ui/Settings";
import PlaceDetail from "./pages/PlaceDetail";
import Planner from "./pages/Planner";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ForBusiness from "./pages/ForBusiness";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PlanProvider>
        <SidebarProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Entry point - Loading screen with auth validation */}
                <Route path="/" element={<LoadingScreen />} />

                {/* Public routes without sidebar */}
                <Route path="/landing" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/brand-guide" element={<BrandGuide />} />
                <Route path="/for-business" element={<ForBusiness />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

                {/* Routes with sidebar */}
                <Route element={<Layout />}>
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/new-explore" element={<NewExplore />} />
                  <Route path="/place/:id" element={<PlaceDetail />} />
                  <Route path="/chat" element={<NewChat />} />
                  <Route path="/old-chat" element={<Chat />} />
                  <Route
                    path="/planner"
                    element={
                      <ProtectedRoute>
                        <NewPlans />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <NewSettings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/old-settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SidebarProvider>
      </PlanProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
