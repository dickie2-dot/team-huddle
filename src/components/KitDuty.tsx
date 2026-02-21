import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_PLAYERS } from "@/data/players";
import { Shirt, Trophy, RotateCcw } from "lucide-react";

const KitDuty = () => {
  const confirmedPlayers = MOCK_PLAYERS.filter((p) => p.confirmed);
  const [phase, setPhase] = useState<"idle" | "spinning" | "done">("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [winner, setWinner] = useState<typeof confirmedPlayers[0] | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const spin = useCallback(() => {
    if (phase !== "idle") return;
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
        // Land on winner
        setCurrentIndex(winnerIdx);
        setWinner(confirmedPlayers[winnerIdx]);
        setPhase("done");
        return;
      }

      // Slow down
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

  const displayPlayer = confirmedPlayers[currentIndex];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-2xl font-display font-bold text-foreground">Kit Duty</h2>
        <p className="text-sm text-muted-foreground">Someone's gotta wash the bibs...</p>
      </motion.div>

      {/* Roulette display */}
      <motion.div
        className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center min-h-[280px] space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {phase === "idle" && !winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4"
          >
            <Shirt className="w-16 h-16 text-primary mx-auto" />
            <p className="text-muted-foreground text-sm">
              Who's on kit duty this week?
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
                className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-2xl font-bold font-display border-4 ${
                  phase === "done"
                    ? "bg-accent/20 border-accent text-accent animate-flash"
                    : "bg-primary/20 border-primary/40 text-primary"
                }`}
              >
                {displayPlayer?.initials}
              </motion.div>
            </AnimatePresence>

            <motion.p
              className="text-lg font-display font-bold text-foreground"
              animate={phase === "spinning" ? { opacity: [0.5, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.3 }}
            >
              {displayPlayer?.name}
            </motion.p>

            {phase === "done" && winner && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                className="space-y-2"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider"
                  style={{
                    background: "linear-gradient(135deg, hsl(25 100% 55% / 0.2), hsl(25 100% 55% / 0.05))",
                    color: "hsl(25 100% 55%)",
                    border: "1px solid hsl(25 100% 55% / 0.3)",
                  }}>
                  <Trophy className="w-4 h-4" />
                  Kit Manager of the Week
                </div>
                <p className="text-xs text-muted-foreground">
                  Better luck next time, {winner.name} 😅
                </p>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>

      {/* Action button */}
      <motion.button
        onClick={phase === "done" ? reset : spin}
        disabled={phase === "spinning"}
        className={`w-full py-4 rounded-2xl font-display font-bold text-lg transition-all ${
          phase === "spinning"
            ? "bg-secondary text-muted-foreground"
            : "bg-primary text-primary-foreground"
        }`}
        whileHover={phase !== "spinning" ? { scale: 1.02 } : {}}
        whileTap={phase !== "spinning" ? { scale: 0.98 } : {}}
      >
        <span className="flex items-center justify-center gap-2">
          {phase === "done" ? (
            <>
              <RotateCcw className="w-5 h-5" /> Spin Again
            </>
          ) : phase === "spinning" ? (
            "Drawing..."
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
