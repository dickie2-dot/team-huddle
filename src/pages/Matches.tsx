import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, Users, Shuffle, Shirt, Swords, ChevronRight } from "lucide-react";
import { DUMMY_MATCHES } from "@/data/dummy-data";
import DraftDay from "@/components/DraftDay";
import KitDuty from "@/components/KitDuty";
import SocialHub from "@/components/SocialHub";

type SubTab = "upcoming" | "draft" | "bibs" | "social";

const Matches = () => {
  const [subTab, setSubTab] = useState<SubTab>("upcoming");
  const navigate = useNavigate();

  const statusColors: Record<string, string> = {
    open: "bg-primary/10 text-primary border-primary/20",
    locked: "bg-accent/10 text-accent border-accent/20",
    drafted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    completed: "bg-muted text-muted-foreground border-border",
  };

  const tabs = [
    { id: "upcoming" as const, label: "Matches", icon: Calendar },
    { id: "draft" as const, label: "Draft", icon: Shuffle },
    { id: "bibs" as const, label: "Bibs", icon: Shirt },
    { id: "social" as const, label: "Social", icon: Users },
  ];

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = subTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {subTab === "upcoming" && (
          <motion.div
            key="upcoming"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-3"
          >
            <h2 className="text-lg font-display font-bold text-foreground">Upcoming & Recent</h2>
            {DUMMY_MATCHES.length === 0 ? (
              <div className="card-elevated p-8 text-center space-y-2">
                <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                <p className="text-sm text-muted-foreground">No matches scheduled yet.</p>
              </div>
            ) : (
              DUMMY_MATCHES.map((match, i) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-elevated p-4 space-y-3 cursor-pointer hover:border-primary/20 transition-colors"
                  onClick={() => match.status === "open" && navigate("/locker-room")}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">{match.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[match.status]}`}>
                      {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{match.match_date}</span>
                      <Clock className="w-3.5 h-3.5 ml-2" />
                      <span>{match.match_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{match.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      <span className="font-semibold text-foreground">
                        {match.confirmed_count}/{match.max_players}
                      </span>
                    </div>
                    {match.status === "open" && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {subTab === "draft" && (
          <motion.div
            key="draft"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <DraftDay />
          </motion.div>
        )}

        {subTab === "bibs" && (
          <motion.div
            key="bibs"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <KitDuty />
          </motion.div>
        )}

        {subTab === "social" && (
          <motion.div
            key="social"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <SocialHub />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Matches;
