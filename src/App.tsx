import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import Payment from "./pages/Payment";
import Fines from "./pages/Fines";
import Matches from "./pages/Matches";
import LockerRoom from "@/components/LockerRoom";
import ChatPoll from "@/components/ChatPoll";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Admin />} />
          {/* Legacy route */}
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

          {/* Main app with bottom nav */}
          <Route element={<Layout />}>
            <Route path="/locker-room" element={<LockerRoom />} />
            <Route path="/draft" element={<Matches />} />
            <Route path="/bib-washer" element={<Navigate to="/draft" replace />} />
            <Route path="/social-kitty" element={<Navigate to="/draft" replace />} />
            <Route path="/chat" element={<ChatPoll />} />
            <Route path="/fines" element={<Fines />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment" element={<Payment />} />
          </Route>

          <Route path="/" element={<Navigate to="/locker-room" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
