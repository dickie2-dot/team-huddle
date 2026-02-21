import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LockerRoom from "@/components/LockerRoom";
import DraftDay from "@/components/DraftDay";
import KitDuty from "@/components/KitDuty";
import { Home, Shuffle, Shirt } from "lucide-react";

const tabs = [
  { id: "locker", label: "Locker Room", icon: Home },
  { id: "draft", label: "Draft", icon: Shuffle },
  { id: "kit", label: "Kit Duty", icon: Shirt },
] as const;

type TabId = (typeof tabs)[number]["id"];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>("locker");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 pt-6 pb-2">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-display font-bold text-gradient-primary text-center"
        >
          MatchDay FC
        </motion.h1>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
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
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="sticky bottom-0 glass-card border-t border-border/50 px-4 py-2 pb-safe">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    />
                  )}
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider">
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
