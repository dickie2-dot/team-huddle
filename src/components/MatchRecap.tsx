import { motion } from "framer-motion";
import { Trophy, Shirt, Coins, Banknote, Calendar, MapPin, Users } from "lucide-react";
import { DUMMY_MATCHES, DUMMY_FINES, DUMMY_BIB_HISTORY } from "@/data/dummy-data";

interface RecapData {
  matchTitle: string;
  matchDate: string;
  location: string;
  playerCount: number;
  topScorer: { name: string; goals: number };
  bibWasher: { name: string };
  kittyWinner: { activity: string };
  finesIssued: { count: number; total: number };
}

// Generate recap for the most recent completed match
const lastCompleted = DUMMY_MATCHES.find((m) => m.status === "completed");
const matchFines = DUMMY_FINES.filter(
  (f) => lastCompleted && f.match_title === lastCompleted.title && f.date === lastCompleted.match_date
);
const latestBib = DUMMY_BIB_HISTORY[0];

const RECAP: RecapData = {
  matchTitle: lastCompleted?.title || "Thursday Night Football",
  matchDate: lastCompleted?.match_date || "2026-03-05",
  location: lastCompleted?.location || "Hackney Marshes Pitch 4",
  playerCount: lastCompleted?.confirmed_count || 14,
  topScorer: { name: "Marcus Reid", goals: 3 },
  bibWasher: { name: latestBib?.player_name || "Ryan Choi" },
  kittyWinner: { activity: "Go-Karting 🏎️" },
  finesIssued: {
    count: matchFines.length,
    total: matchFines.reduce((sum, f) => sum + f.amount, 0),
  },
};

const MatchRecap = () => {
  const dateObj = new Date(RECAP.matchDate + "T00:00:00");
  const dateStr = dateObj.toLocaleDateString("en-GB", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const highlights = [
    {
      icon: Trophy,
      label: "Top Scorer",
      value: `${RECAP.topScorer.name} (${RECAP.topScorer.goals})`,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: Shirt,
      label: "Bib Washer",
      value: RECAP.bibWasher.name,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Coins,
      label: "Kitty Winner",
      value: RECAP.kittyWinner.activity,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Banknote,
      label: "Fines Issued",
      value: `${RECAP.finesIssued.count} fines (£${RECAP.finesIssued.total})`,
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-4.5 h-4.5 text-accent" />
          Match Recap
        </h3>
        <span className="sport-badge text-[9px]">Completed</span>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-bold text-foreground">{RECAP.matchTitle}</p>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {dateStr}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {RECAP.location}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {RECAP.playerCount} players
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {highlights.map((h, i) => {
          const Icon = h.icon;
          return (
            <motion.div
              key={h.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
            >
              <div className={`w-8 h-8 rounded-lg ${h.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${h.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground font-medium">{h.label}</p>
                <p className="text-sm font-bold text-foreground truncate">{h.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MatchRecap;
