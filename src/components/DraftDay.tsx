import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Shuffle, Swords, ArrowLeftRight, RotateCcw, Loader2 } from "lucide-react";
import { DUMMY_PLAYERS, DUMMY_CLUBS } from "@/data/dummy-data";
import { getSportById, getDefaultSport } from "@/data/sports-config";

const activeClub = DUMMY_CLUBS[0];
const activeSport = getSportById(activeClub.sport_id) ?? getDefaultSport();

interface DraftPlayer {
  id: string;
  name: string;
  initials: string;
}

const DraftDay = () => {
  const [phase, setPhase] = useState<"idle" | "shuffling" | "done">("idle");
  const [homeTeam, setHomeTeam] = useState<DraftPlayer[]>([]);
  const [awayTeam, setAwayTeam] = useState<DraftPlayer[]>([]);
  const [players, setPlayers] = useState<DraftPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shufflePositions, setShufflePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [swapMode, setSwapMode] = useState(false);
  const [swapSelection, setSwapSelection] = useState<{ team: "home" | "away"; index: number } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    loadPlayers();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const loadPlayers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: dbError } = await supabase
        .from("players")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (dbError) throw dbError;

      if (data && data.length > 0) {
        setPlayers(
          data.map((p) => ({
            id: p.id,
            name: p.name,
            initials: p.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
          }))
        );
      } else {
        // Fallback to dummy data
        setPlayers(
          DUMMY_PLAYERS.filter((p) => p.is_active).map((p) => ({
            id: p.id,
            name: p.name,
            initials: p.initials,
          }))
        );
      }
    } catch {
      setError("Failed to load players. Using offline data.");
      setPlayers(
        DUMMY_PLAYERS.filter((p) => p.is_active).map((p) => ({
          id: p.id,
          name: p.name,
          initials: p.initials,
        }))
      );
    }
    setLoading(false);
  };

  const startDraft = useCallback(() => {
    if (phase !== "idle" || players.length === 0) return;
    setPhase("shuffling");
    setHomeTeam([]);
    setAwayTeam([]);
    setSwapMode(false);
    setSwapSelection(null);

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
        const teamSize = activeSport.team_size;
        setHomeTeam(shuffled.slice(0, teamSize));
        setAwayTeam(shuffled.slice(teamSize, teamSize * 2));
        setShufflePositions({});
        setPhase("done");
      }
    }, 120);
  }, [phase, players]);

  const reset = () => {
    setPhase("idle");
    setHomeTeam([]);
    setAwayTeam([]);
    setSwapMode(false);
    setSwapSelection(null);
  };

  const handlePlayerTap = (team: "home" | "away", index: number) => {
    if (!swapMode) return;

    if (!swapSelection) {
      setSwapSelection({ team, index });
      return;
    }

    // Perform swap
    const newHome = [...homeTeam];
    const newAway = [...awayTeam];

    const getPlayer = (t: "home" | "away", i: number) =>
      t === "home" ? newHome[i] : newAway[i];
    const setPlayer = (t: "home" | "away", i: number, p: DraftPlayer) => {
      if (t === "home") newHome[i] = p;
      else newAway[i] = p;
    };

    const playerA = getPlayer(swapSelection.team, swapSelection.index);
    const playerB = getPlayer(team, index);

    setPlayer(swapSelection.team, swapSelection.index, playerB);
    setPlayer(team, index, playerA);

    setHomeTeam(newHome);
    setAwayTeam(newAway);
    setSwapSelection(null);
    setSwapMode(false);
  };

  const TeamColumn = ({
    team,
    label,
    isHome,
    teamKey,
  }: {
    team: DraftPlayer[];
    label: string;
    isHome: boolean;
    teamKey: "home" | "away";
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
        {team.map((player, i) => {
          const isSelected = swapSelection?.team === teamKey && swapSelection?.index === i;
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: isHome ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all ${
                isSelected
                  ? "ring-2 ring-primary bg-primary/10"
                  : swapMode
                  ? "hover:bg-primary/5"
                  : ""
              } ${isHome ? "bg-primary/5" : "bg-accent/5"}`}
              onClick={() => handlePlayerTap(teamKey, i)}
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
          );
        })}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-1"
      >
        <h2 className="text-2xl font-display font-extrabold text-foreground">Draft Day</h2>
        <p className="text-xs text-muted-foreground font-medium">
          {activeSport.emoji} {activeSport.name} — {activeSport.team_size}v{activeSport.team_size} · {players.length} players in the pool
        </p>
      </motion.div>

      {error && (
        <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs text-center font-medium">
          {error}
        </div>
      )}

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

      {/* Draft results */}
      {phase === "done" && (
        <>
          {swapMode && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center"
            >
              <p className="text-xs font-semibold text-primary">
                {swapSelection ? "Now tap the player to swap with" : "Tap a player to start swapping"}
              </p>
            </motion.div>
          )}
          <div className="grid grid-cols-2 gap-2.5">
            <TeamColumn team={homeTeam} label="Home" isHome teamKey="home" />
            <TeamColumn team={awayTeam} label="Away" isHome={false} teamKey="away" />
          </div>
          {/* Swap & Reset buttons */}
          <div className="flex gap-2">
            <motion.button
              onClick={() => {
                setSwapMode(!swapMode);
                setSwapSelection(null);
              }}
              className={`flex-1 py-3 rounded-xl font-display font-bold text-sm transition-all ${
                swapMode
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                <ArrowLeftRight className="w-4 h-4" />
                {swapMode ? "Swapping..." : "Swap Players"}
              </span>
            </motion.button>
            <motion.button
              onClick={reset}
              className="py-3 px-4 rounded-xl font-display font-bold text-sm bg-secondary/60 text-muted-foreground hover:bg-secondary"
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </div>
        </>
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
      {phase !== "done" && (
        <motion.button
          onClick={startDraft}
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
            {phase === "shuffling" ? "Drafting..." : "Draft Teams"}
          </span>
        </motion.button>
      )}

      {phase === "done" && (
        <motion.button
          onClick={startDraft}
          className="w-full py-3.5 rounded-2xl font-display font-bold text-base bg-primary text-primary-foreground glow-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Shuffle className="w-5 h-5" />
            Redraft
          </span>
        </motion.button>
      )}
    </div>
  );
};

export default DraftDay;
