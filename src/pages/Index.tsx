import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LockerRoom from "@/components/LockerRoom";
import DraftDay from "@/components/DraftDay";
import KitDuty from "@/components/KitDuty";
import SocialHub from "@/components/SocialHub";
import ChatPoll from "@/components/ChatPoll";
import MatchWeekSimulator from "@/components/MatchWeekSimulator";
import { Home, Shuffle, Shirt, Users, MessageCircle, Settings, User } from "lucide-react";

const tabs = [
  { id: "locker", label: "Home", icon: Home },
  { id: "draft", label: "Draft", icon: Shuffle },
  { id: "kit", label: "Bibs", icon: Shirt },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "social", label: "Social", icon: Users },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("locker");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 pt-5 pb-3 flex items-center justify-between max-w-lg mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-lg font-display font-extrabold text-foreground tracking-tight leading-tight">
            Team{" "}
            <span className="text-gradient-primary">Huddle</span>
          </h1>
        </motion.div>
        <div className="flex items-center gap-1">
          <motion.button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <User className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => navigate("/admin")}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-3 max-w-lg mx-auto w-full overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "locker" && <LockerRoom />}
            {activeTab === "draft" && <DraftDay />}
            {activeTab === "kit" && <KitDuty />}
            {activeTab === "chat" && <ChatPoll />}
            {activeTab === "social" && <SocialHub />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Match Week Simulator */}
      <MatchWeekSimulator />

      {/* Bottom Nav */}
      <nav className="sticky bottom-0 bg-card/95 backdrop-blur-md border-t border-border px-2 py-1.5 pb-safe">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-2.5 rounded-xl transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    />
                  )}
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-wider">
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Index;
