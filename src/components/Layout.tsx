import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Compass, Swords, MessageCircle, Banknote, User } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

const tabs = [
  { path: "/locker-room", label: "Home", icon: Home },
  { path: "/find-game", label: "Find", icon: Compass },
  { path: "/draft", label: "Matches", icon: Swords },
  { path: "/chat", label: "Chat", icon: MessageCircle },
  { path: "/fines", label: "Fines", icon: Banknote },
  { path: "/profile", label: "Profile", icon: User },
] as const;

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activePath = tabs.find((t) => location.pathname.startsWith(t.path))?.path || "/locker-room";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 pt-5 pb-3 flex items-center justify-between max-w-lg mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-lg font-display font-extrabold text-foreground tracking-tight leading-tight cursor-pointer"
            onClick={() => navigate("/locker-room")}
          >
            Team{" "}
            <span className="text-gradient-primary">Huddle</span>
          </h1>
        </motion.div>
        <div className="flex items-center gap-1">
          <NotificationBell />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-3 max-w-lg mx-auto w-full overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="sticky bottom-0 bg-card/95 backdrop-blur-md border-t border-border px-2 py-1.5 pb-safe z-40">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activePath === tab.path;
            return (
              <motion.button
                key={tab.path}
                onClick={() => navigate(tab.path)}
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

export default Layout;
