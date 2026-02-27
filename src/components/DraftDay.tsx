import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_PLAYERS, Player } from "@/data/players";
import { Shuffle, Swords } from "lucide-react";

const DraftDay = () => {
  const [phase, setPhase] = useState<"idle" | "shuffling" | "done">("idle");
  const [homeTeam, setHomeTeam] = useState<Player[]>([]);
  const [awayTeam, setAwayTeam] = useState<Player[]>([]);
  const [shufflePositions, setShufflePositions] = useState<Record<number, { x: number; y: number }>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const confirmedPlayers = MOCK_PLAYERS.filter((p) => p.confirmed);

  const startDraft = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("shuffling");
    setHomeTeam([]);
    setAwayTeam([]);

    let count = 0;
    intervalRef.current = setInterval(() => {
      const positions: Record<number, { x: number; y: number }> = {};
      confirmedPlayers.forEach((p) => {
        positions[p.id] = {
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
        };
      });
      setShufflePositions(positions);
      count++;
      if (count > 15) {
        clearInterval(intervalRef.current);
        const shuffled = [...confirmedPlayers].sort(() => Math.random() - 0.5);
        const half = Math.ceil(shuffled.length / 2);
        setHomeTeam(shuffled.slice(0, half));
        setAwayTeam(shuffled.slice(half));
        setShufflePositions({});
        setPhase("done");
      }
    }, 120);
  }, [phase, confirmedPlayers]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const reset = () => {
    setPhase("idle");
    setHomeTeam([]);
    setAwayTeam([]);
  };

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-1"
      >
        <h2 className="text-2xl font-display font-extrabold text-foreground">Draft Day</h2>
        <p className="text-xs text-muted-foreground font-medium">
          {confirmedPlayers.length} players confirmed
        </p>
      </motion.div>

      {/* Shuffling zone */}
      {phase === "shuffling" && (
        <div className="relative h-64 card-elevated rounded-2xl overflow-hidden flex items-center justify-center">
          {confirmedPlayers.map((player) => (
            <motion.div
              key={player.id}
              className="absolute w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary"
              animate={{
                x: shufflePositions[player.id]?.x ?? 0,
                y: shufflePositions[player.id]?.y ?? 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              {player.initials}
            </motion.div>
          ))}
        </div>
      )}

      {/* Results */}
      {phase === "done" && (
        <div className="grid grid-cols-2 gap-2.5">
          {/* Home */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="card-elevated rounded-2xl p-4 space-y-3"
          >
            <div className="text-center">
              <span className="sport-badge">Home</span>
            </div>
            <div className="space-y-1.5">
              {homeTeam.map((player, i) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  className="flex items-center gap-2 p-2 rounded-xl bg-primary/5"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-[9px] font-bold text-primary">
                    {player.initials}
                  </div>
                  <span className="text-xs font-semibold text-foreground truncate">
                    {player.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Away */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="card-elevated rounded-2xl p-4 space-y-3"
          >
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-accent/10 text-accent border-accent/20">
                Away
              </span>
            </div>
            <div className="space-y-1.5">
              {awayTeam.map((player, i) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  className="flex items-center gap-2 p-2 rounded-xl bg-accent/5"
                >
                  <div className="w-7 h-7 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center text-[9px] font-bold text-accent">
                    {player.initials}
                  </div>
                  <span className="text-xs font-semibold text-foreground truncate">
                    {player.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Idle state */}
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-elevated rounded-2xl p-10 text-center space-y-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Swords className="w-7 h-7 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            Split the squad into two balanced teams
          </p>
        </motion.div>
      )}

      {/* Action Button */}
      <motion.button
        onClick={phase === "done" ? reset : startDraft}
        disabled={phase === "shuffling"}
        className={`w-full py-3.5 rounded-2xl font-display font-bold text-base transition-all ${
          phase === "shuffling"
            ? "bg-secondary text-muted-foreground"
            : "bg-primary text-primary-foreground glow-primary"
        }`}
        whileHover={phase !== "shuffling" ? { scale: 1.02 } : {}}
        whileTap={phase !== "shuffling" ? { scale: 0.98 } : {}}
      >
        <span className="flex items-center justify-center gap-2">
          <Shuffle className="w-5 h-5" />
          {phase === "done" ? "Redraft" : phase === "shuffling" ? "Drafting..." : "Draft Teams"}
        </span>
      </motion.button>
    </div>
  );
};

export default DraftDay;
