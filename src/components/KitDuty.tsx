import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shirt, Trophy, RotateCcw, Loader2 } from "lucide-react";
import { useActivePlayers, type ActivePlayer } from "@/hooks/use-active-players";

const KitDuty = () => {
  const { players: confirmedPlayers, loading } = useActivePlayers();
  const [phase, setPhase] = useState<"idle" | "spinning" | "done">("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [winner, setWinner] = useState<ActivePlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (confirmedPlayers.length === 0) {
      setCurrentIndex(0);
      setWinner(null);
      setPhase("idle");
      return;
    }

    if (currentIndex >= confirmedPlayers.length) {
      setCurrentIndex(0);
    }
  }, [confirmedPlayers, currentIndex]);

  const spin = useCallback(() => {
    if (phase !== "idle" || confirmedPlayers.length === 0) return;

    setPhase("spinning");
    setWinner(null);

    const winnerIdx = Math.floor(Math.random() * confirmedPlayers.length);
    let speed = 60;
    let iterations = 0;
    const totalIterations = 25 + Math.floor(Math.random() * 10);

    const tick = () => {
      setCurrentIndex((prev) => (prev + 1) % confirmedPlayers.length);
      iterations++;

      if (iterations >= totalIterations) {
        setCurrentIndex(winnerIdx);
        setWinner(confirmedPlayers[winnerIdx]);
        setPhase("done");
        return;
      }

      speed = 60 + (iterations / totalIterations) * 300;
      intervalRef.current = setTimeout(tick, speed);
    };

    intervalRef.current = setTimeout(tick, speed);
  }, [phase, confirmedPlayers]);

  const reset = () => {
    setPhase("idle");
    setWinner(null);
    setCurrentIndex(0);
    if (intervalRef.current) clearTimeout(intervalRef.current);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, []);

  const displayPlayer = confirmedPlayers[currentIndex] ?? null;
  const canSpin = confirmedPlayers.length > 0;

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-1"
      >
        <h2 className="text-2xl font-display font-extrabold text-foreground">Kit Duty</h2>
        {loading ? (
          <p className="text-xs text-muted-foreground font-medium inline-flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading players...
          </p>
        ) : (
          <p className="text-xs text-muted-foreground font-medium">Draw from active Admin roster players</p>
        )}
      </motion.div>

      <motion.div
        className="card-elevated rounded-2xl p-8 flex flex-col items-center justify-center min-h-[260px] space-y-5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {phase === "idle" && !winner && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Shirt className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              {canSpin ? "Who's on kit duty this week?" : "Add active players in Admin to run kit duty"}
            </p>
          </motion.div>
        )}

        {(phase === "spinning" || phase === "done") && (
          <div className="text-center space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={displayPlayer?.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.08 }}
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-xl font-bold font-display border-[3px] ${
                  phase === "done"
                    ? "bg-accent/15 border-accent text-accent animate-flash"
                    : "bg-primary/15 border-primary/30 text-primary"
                }`}
              >
                {displayPlayer?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "?"}
              </motion.div>
            </AnimatePresence>

            <motion.p
              className="text-lg font-display font-bold text-foreground"
              animate={phase === "spinning" ? { opacity: [0.5, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.3 }}
            >
              {displayPlayer?.name || "No Player"}
            </motion.p>

            {phase === "done" && winner && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                className="space-y-2"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-accent/10 text-accent border border-accent/20">
                  <Trophy className="w-3.5 h-3.5" />
                  Kit Manager of the Week
                </div>
                <p className="text-xs text-muted-foreground">Better luck next time, {winner.name} 😅</p>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>

      <motion.button
        onClick={phase === "done" ? reset : spin}
        disabled={phase === "spinning" || loading || !canSpin}
        className={`w-full py-3.5 rounded-2xl font-display font-bold text-base transition-all ${
          phase === "spinning" || loading || !canSpin
            ? "bg-secondary text-muted-foreground"
            : "bg-primary text-primary-foreground glow-primary"
        }`}
        whileHover={phase !== "spinning" && !loading && canSpin ? { scale: 1.02 } : {}}
        whileTap={phase !== "spinning" && !loading && canSpin ? { scale: 0.98 } : {}}
      >
        <span className="flex items-center justify-center gap-2">
          {phase === "done" ? (
            <>
              <RotateCcw className="w-5 h-5" /> Spin Again
            </>
          ) : phase === "spinning" ? (
            "Drawing..."
          ) : loading ? (
            "Loading roster..."
          ) : !canSpin ? (
            "No Active Players"
          ) : (
            <>
              <Shirt className="w-5 h-5" /> Draw Kit Manager
            </>
          )}
        </span>
      </motion.button>
    </div>
  );
};

export default KitDuty;

