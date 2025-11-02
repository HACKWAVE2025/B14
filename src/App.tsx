//App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Games from "./pages/Games";
import News from "./pages/News";
import StoryGame from "./pages/StoryGame";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import SmishingGame from "./pages/SMS";
// NEW: Import Particles Background
import ParticlesBackground from "./components/ParticlesBackground";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* NEW: Render the Particles component globally at the root */}
    <ParticlesBackground />

    {/* NEW: Wrap application content with z-index to layer it ABOVE particles */}
    <div className="relative z-[1] min-h-screen">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/story" element={<StoryGame />} />
              <Route path="/games/SMS" element={<SmishingGame />} />
              <Route path="/news" element={<News />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </div>
  </QueryClientProvider>
);

export default App;