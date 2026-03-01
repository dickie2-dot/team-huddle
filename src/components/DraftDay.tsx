import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Shuffle, Swords, Loader2 } from "lucide-react";
import { useActivePlayers, type ActivePlayer } from "@/hooks/use-active-players";

const DraftDay = () => {
  const { players: confirmedPlayers, loading } = useActivePlayers();
  const [phase, setPhase] = useState<"idle" | "shuffling" | "done">("idle");
  const [homeTeam, setHomeTeam] = useState<ActivePlayer[]>([]);
  const [awayTeam, setAwayTeam] = useState<ActivePlayer[]>([]);
  const [shufflePositions, setShufflePositions] = useState<Record<string, { x: number; y: number }>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const canDraft = confirmedPlayers.length >= 2;

  const startDraft = useCallback(() => {
    if (phase !== "idle" || !canDraft) return;
    setPhase("shuffling");
    setHomeTeam([]);
    setAwayTeam([]);

    let count = 0;
    intervalRef.current = setInterval(() => {
      const positions: Record<string, { x: number; y: number }> = {};
      confirmedPlayers.forEach((player) => {
        positions[player.id] = {
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
  }, [phase, confirmedPlayers, canDraft]);

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
        {loading ? (
          <p className="text-xs text-muted-foreground font-medium inline-flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading players...
          </p>
        ) : (
          <p className="text-xs text-muted-foreground font-medium">
            {confirmedPlayers.length} active players from roster
          </p>
        )}
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
              {player.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </motion.div>
          ))}
        </div>
      )}

      {/* Results */}
      {phase === "done" && (
        <div className="grid grid-cols-2 gap-2.5">
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
                    {player.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-foreground truncate">{player.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

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
                    {player.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-foreground truncate">{player.name}</span>
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
            {canDraft ? "Split the active roster into two balanced teams" : "Add at least 2 active players in Admin to draft teams"}
          </p>
        </motion.div>
      )}

      <motion.button
        onClick={phase === "done" ? reset : startDraft}
        disabled={phase === "shuffling" || loading || !canDraft}
        className={`w-full py-3.5 rounded-2xl font-display font-bold text-base transition-all ${
          phase === "shuffling" || loading || !canDraft
            ? "bg-secondary text-muted-foreground"
            : "bg-primary text-primary-foreground glow-primary"
        }`}
        whileHover={phase !== "shuffling" && !loading && canDraft ? { scale: 1.02 } : {}}
        whileTap={phase !== "shuffling" && !loading && canDraft ? { scale: 0.98 } : {}}
      >
        <span className="flex items-center justify-center gap-2">
          <Shuffle className="w-5 h-5" />
          {phase === "done"
            ? "Redraft"
            : phase === "shuffling"
              ? "Drafting..."
              : loading
                ? "Loading roster..."
                : !canDraft
                  ? "Need 2 Active Players"
                  : "Draft Teams"}
        </span>
      </motion.button>
    </div>
  );
};

export default DraftDay;

