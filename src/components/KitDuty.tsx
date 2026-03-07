import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Shirt, Trophy, RotateCcw } from "lucide-react";

interface BibPlayer {
  id: string;
  name: string;
  initials: string;
  excluded: boolean;
}

const KitDuty = () => {
  const [players, setPlayers] = useState<BibPlayer[]>([]);
  const [phase, setPhase] = useState<"idle" | "spinning" | "done">("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [winner, setWinner] = useState<BibPlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setTimeout>>();

  // Placeholder: last week's winner ID (would come from DB in production)
  const lastWeekWinnerId = "excluded-placeholder";

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    const { data } = await supabase
      .from("players")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (data && data.length > 0) {
      setPlayers(
        data.map((p) => ({
          id: p.id,
          name: p.name,
          initials: p.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
          excluded: p.id === lastWeekWinnerId,
        }))
      );
    } else {
      const names = ["Marcus Reid", "Jake Thornton", "Leo Vasquez", "Sam Okafor", "Dan Mitchell",
        "Kai Brennan", "Tom Ashford", "Ryan Choi", "Finn Gallagher", "Nate Pearson"];
      setPlayers(names.map((n, i) => ({
        id: String(i + 1),
        name: n,
        initials: n.split(" ").map((w) => w[0]).join(""),
        excluded: false,
      })));
    }
  };

  const eligiblePlayers = players.filter((p) => !p.excluded);

  const spin = useCallback(() => {
    if (phase !== "idle" || eligiblePlayers.length === 0) return;
    setPhase("spinning");
    setWinner(null);

    const winnerIdx = Math.floor(Math.random() * eligiblePlayers.length);
    let speed = 60;
    let iterations = 0;
    const totalIterations = 25 + Math.floor(Math.random() * 10);

    const tick = () => {
      setCurrentIndex((prev) => (prev + 1) % eligiblePlayers.length);
      iterations++;

      if (iterations >= totalIterations) {
        setCurrentIndex(winnerIdx);
        setWinner(eligiblePlayers[winnerIdx]);
        setPhase("done");
        return;
      }

      speed = 60 + (iterations / totalIterations) * 300;
      intervalRef.current = setTimeout(tick, speed);
    };

    intervalRef.current = setTimeout(tick, speed);
  }, [phase, eligiblePlayers]);

  const reset = () => {
    setPhase("idle");
    setWinner(null);
    setCurrentIndex(0);
    if (intervalRef.current) clearTimeout(intervalRef.current);
  };

  const displayPlayer = eligiblePlayers[currentIndex] || eligiblePlayers[0];

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-1"
      >
        <h2 className="text-2xl font-display font-extrabold text-foreground">Bib Washer</h2>
        <p className="text-xs text-muted-foreground font-medium">
          Someone's gotta wash the bibs...
        </p>
      </motion.div>

      {/* Eligible players list */}
      {phase === "idle" && players.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-elevated rounded-2xl p-4"
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
            Eligible Players
          </h3>
          <div className="flex flex-wrap gap-2">
            {players.map((p) => (
              <div
                key={p.id}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                  p.excluded
                    ? "bg-secondary/30 text-muted-foreground/50 line-through"
                    : "bg-primary/8 text-primary border border-primary/15"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                    p.excluded
                      ? "bg-muted text-muted-foreground/40"
                      : "bg-primary/15 text-primary"
                  }`}
                >
                  {p.initials}
                </div>
                {p.name.split(" ")[0]}
                {p.excluded && (
                  <span className="text-[9px] text-muted-foreground ml-1">(last week)</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Roulette display */}
      <motion.div
        className="card-elevated rounded-2xl p-8 flex flex-col items-center justify-center min-h-[220px] space-y-5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {phase === "idle" && !winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-3"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Shirt className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              Who's on bib duty this week?
            </p>
          </motion.div>
        )}

        {(phase === "spinning" || phase === "done") && displayPlayer && (
          <div className="text-center space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={displayPlayer.id}
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
                {displayPlayer.initials}
              </motion.div>
            </AnimatePresence>

            <motion.p
              className="text-lg font-display font-bold text-foreground"
              animate={phase === "spinning" ? { opacity: [0.5, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.3 }}
            >
              {displayPlayer.name}
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
                  Bib Washer of the Week
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
        className={`w-full py-3.5 rounded-2xl font-display font-bold text-base transition-all ${
          phase === "spinning"
            ? "bg-secondary text-muted-foreground"
            : "bg-primary text-primary-foreground glow-primary"
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
              <Shirt className="w-5 h-5" /> Draw Bib Washer
            </>
          )}
        </span>
      </motion.button>
    </div>
  );
};

export default KitDuty;
