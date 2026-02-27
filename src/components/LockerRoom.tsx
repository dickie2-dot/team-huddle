import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_PLAYERS, MATCH_INFO, Player } from "@/data/players";
import { MapPin, Clock, Users, Zap, Check } from "lucide-react";

const LockerRoom = () => {
  const [players, setPlayers] = useState<Player[]>(MOCK_PLAYERS);
  const [hasJoined, setHasJoined] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const confirmedCount = players.filter((p) => p.confirmed).length;
  const progress = (confirmedCount / MATCH_INFO.spotsTotal) * 100;

  const handleSecureSpot = useCallback(() => {
    if (hasJoined || isFlipping) return;
    setIsFlipping(true);

    setTimeout(() => {
      setPlayers((prev) =>
        prev.map((p) => (p.id === 11 ? { ...p, confirmed: true } : p))
      );
      setHasJoined(true);
      setIsFlipping(false);
    }, 800);
  }, [hasJoined, isFlipping]);

  return (
    <div className="space-y-5">
      {/* Match Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="sport-badge">
            <Zap className="w-3 h-3" /> Next Match
          </span>
          <span className="text-xs font-medium text-muted-foreground">{MATCH_INFO.date}</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 text-sm text-foreground/80">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-medium">{MATCH_INFO.time}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-foreground/80">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-medium">{MATCH_INFO.location}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <Users className="w-3.5 h-3.5" /> Squad
            </span>
            <span className="font-bold font-display text-foreground tabular-nums">
              {confirmedCount}/{MATCH_INFO.spotsTotal}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Locker Grid */}
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
          The Squad
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {players.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, type: "spring", stiffness: 200 }}
            >
              <AnimatePresence mode="wait">
                {player.id === 11 && isFlipping ? (
                  <motion.div
                    key="flipping"
                    className="aspect-square rounded-xl bg-primary flex items-center justify-center"
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <span className="text-primary-foreground font-bold text-[10px]">
                      {player.initials}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key={player.confirmed ? "confirmed" : "empty"}
                    className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-bold transition-all ${
                      player.confirmed
                        ? "bg-primary/12 text-primary border border-primary/25 shadow-sm"
                        : "bg-secondary/40 text-muted-foreground/60 border border-border/20"
                    }`}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    layout
                  >
                    {player.confirmed ? player.initials : "?"}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={handleSecureSpot}
        disabled={hasJoined}
        className={`w-full py-3.5 rounded-2xl font-display font-bold text-base transition-all ${
          hasJoined
            ? "bg-primary/15 text-primary cursor-default"
            : "bg-primary text-primary-foreground glow-primary"
        }`}
        whileHover={!hasJoined ? { scale: 1.02 } : {}}
        whileTap={!hasJoined ? { scale: 0.98 } : {}}
      >
        {hasJoined ? (
          <span className="flex items-center justify-center gap-2">
            <Check className="w-5 h-5" /> You're In!
          </span>
        ) : (
          "Secure Your Spot (£6)"
        )}
      </motion.button>
    </div>
  );
};

export default LockerRoom;
