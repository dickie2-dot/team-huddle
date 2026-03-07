import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Shuffle, Swords } from "lucide-react";

interface DraftPlayer {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
}

const DraftDay = () => {
  const [phase, setPhase] = useState<"idle" | "shuffling" | "done">("idle");
  const [homeTeam, setHomeTeam] = useState<DraftPlayer[]>([]);
  const [awayTeam, setAwayTeam] = useState<DraftPlayer[]>([]);
  const [players, setPlayers] = useState<DraftPlayer[]>([]);
  const [shufflePositions, setShufflePositions] = useState<Record<string, { x: number; y: number }>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    loadPlayers();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
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
        }))
      );
    } else {
      // Fallback
      const names = ["Marcus Reid", "Jake Thornton", "Leo Vasquez", "Sam Okafor", "Dan Mitchell",
        "Kai Brennan", "Tom Ashford", "Ryan Choi", "Finn Gallagher", "Nate Pearson"];
      setPlayers(names.map((n, i) => ({
        id: String(i + 1),
        name: n,
        initials: n.split(" ").map((w) => w[0]).join(""),
      })));
    }
  };

  const startDraft = useCallback(() => {
    if (phase !== "idle" || players.length === 0) return;
    setPhase("shuffling");
    setHomeTeam([]);
    setAwayTeam([]);

    let count = 0;
    intervalRef.current = setInterval(() => {
      const positions: Record<string, { x: number; y: number }> = {};
      players.forEach((p) => {
        positions[p.id] = {
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
        };
      });
      setShufflePositions(positions);
      count++;
      if (count > 15) {
        clearInterval(intervalRef.current);
        const shuffled = [...players].sort(() => Math.random() - 0.5);
        const half = Math.ceil(shuffled.length / 2);
        setHomeTeam(shuffled.slice(0, half));
        setAwayTeam(shuffled.slice(half));
        setShufflePositions({});
        setPhase("done");
      }
    }, 120);
  }, [phase, players]);

  const reset = () => {
    setPhase("idle");
    setHomeTeam([]);
    setAwayTeam([]);
  };

  const TeamColumn = ({
    team,
    label,
    isHome,
  }: {
    team: DraftPlayer[];
    label: string;
    isHome: boolean;
  }) => (
    <motion.div
      initial={{ x: isHome ? -100 : 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="card-elevated rounded-2xl p-4 space-y-3"
    >
      <div className="text-center">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
            isHome
              ? "bg-primary/8 text-primary border-primary/20"
              : "bg-accent/10 text-accent border-accent/20"
          }`}
        >
          {label}
        </span>
      </div>
      <div className="space-y-1.5">
        {team.map((player, i) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: isHome ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            className={`flex items-center gap-2 p-2 rounded-xl ${
              isHome ? "bg-primary/5" : "bg-accent/5"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold border ${
                isHome
                  ? "bg-primary/15 border-primary/25 text-primary"
                  : "bg-accent/15 border-accent/25 text-accent"
              }`}
            >
              {player.initials}
            </div>
            <span className="text-xs font-semibold text-foreground truncate">
              {player.name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-1"
      >
        <h2 className="text-2xl font-display font-extrabold text-foreground">Draft Day</h2>
        <p className="text-xs text-muted-foreground font-medium">
          {players.length} players in the pool
        </p>
      </motion.div>

      {/* Shuffling animation */}
      {phase === "shuffling" && (
        <div className="relative h-64 card-elevated rounded-2xl overflow-hidden flex items-center justify-center">
          {players.map((player) => (
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

      {/* Draft results: Home & Away columns */}
      {phase === "done" && (
        <div className="grid grid-cols-2 gap-2.5">
          <TeamColumn team={homeTeam} label="Home" isHome />
          <TeamColumn team={awayTeam} label="Away" isHome={false} />
        </div>
      )}

      {/* Idle */}
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

      {/* Action */}
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
