import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Check, Loader2, Users, Shuffle, Shirt, Banknote, MessageCircle, Coins, X, RotateCcw } from "lucide-react";
import { DUMMY_PLAYERS, DUMMY_MATCHES, FINE_REASONS } from "@/data/dummy-data";

type StepStatus = "pending" | "running" | "done";

interface SimStep {
  id: string;
  icon: React.ElementType;
  label: string;
  detail: string;
  status: StepStatus;
  match: number; // 1 or 2
}

const PLAYER_NAMES = DUMMY_PLAYERS.filter((p) => p.is_active).map((p) => p.name);

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const pick = <T,>(arr: T[], n: number): T[] => shuffle(arr).slice(0, n);
const pickOne = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const MatchWeekSimulator = () => {
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [steps, setSteps] = useState<SimStep[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const abortRef = useRef(false);

  const addLog = (msg: string) => setLog((prev) => [...prev, msg]);

  const delay = (ms: number) =>
    new Promise<void>((resolve) => {
      const t = setTimeout(resolve, ms);
      if (abortRef.current) clearTimeout(t);
    });

  const buildSteps = (): SimStep[] => {
    const matchSteps = (matchNum: number): SimStep[] => [
      { id: `m${matchNum}-join`, icon: Users, label: "Players Joining", detail: "", status: "pending", match: matchNum },
      { id: `m${matchNum}-draft`, icon: Shuffle, label: "Draft Teams", detail: "", status: "pending", match: matchNum },
      { id: `m${matchNum}-fines`, icon: Banknote, label: "Issue Fines", detail: "", status: "pending", match: matchNum },
      { id: `m${matchNum}-bib`, icon: Shirt, label: "Bib Washer", detail: "", status: "pending", match: matchNum },
      { id: `m${matchNum}-kitty`, icon: Coins, label: "Update Kitty", detail: "", status: "pending", match: matchNum },
      { id: `m${matchNum}-chat`, icon: MessageCircle, label: "Chat Banter", detail: "", status: "pending", match: matchNum },
    ];
    return [...matchSteps(1), ...matchSteps(2)];
  };

  const updateStep = (id: string, updates: Partial<SimStep>) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const runSimulation = useCallback(async () => {
    abortRef.current = false;
    const newSteps = buildSteps();
    setSteps(newSteps);
    setLog([]);
    setRunning(true);
    setDone(false);

    const matches = [
      { title: DUMMY_MATCHES[0]?.title || "Thursday Night Football", date: "Match 1" },
      { title: DUMMY_MATCHES[1]?.title || "Weekend Friendly", date: "Match 2" },
    ];

    for (let matchIdx = 0; matchIdx < 2; matchIdx++) {
      if (abortRef.current) break;
      const m = matchIdx + 1;
      const match = matches[matchIdx];
      addLog(`\n⚽ — ${match.date}: ${match.title} —`);

      // 1. Players joining
      updateStep(`m${m}-join`, { status: "running" });
      const joinCount = 10 + Math.floor(Math.random() * 5); // 10-14
      const joined = pick(PLAYER_NAMES, joinCount);
      for (let i = 0; i < joined.length; i++) {
        if (abortRef.current) break;
        await delay(200 + Math.random() * 300);
        addLog(`✅ ${joined[i]} joined (${i + 1}/${joinCount})`);
        updateStep(`m${m}-join`, { detail: `${i + 1}/${joinCount} players` });
      }
      updateStep(`m${m}-join`, { status: "done", detail: `${joinCount} players confirmed` });
      await delay(400);

      // 2. Draft teams
      updateStep(`m${m}-draft`, { status: "running" });
      addLog("🔀 Shuffling players...");
      await delay(800);
      const shuffled = shuffle(joined);
      const half = Math.ceil(shuffled.length / 2);
      const home = shuffled.slice(0, half);
      const away = shuffled.slice(half);
      addLog(`🟢 Home: ${home.join(", ")}`);
      addLog(`⚪ Away: ${away.join(", ")}`);
      updateStep(`m${m}-draft`, { status: "done", detail: `${home.length}v${away.length}` });
      await delay(400);

      // 3. Fines
      updateStep(`m${m}-fines`, { status: "running" });
      const fineCount = 2 + Math.floor(Math.random() * 2); // 2-3
      const fined = pick(joined, fineCount);
      for (const player of fined) {
        if (abortRef.current) break;
        const reason = pickOne(FINE_REASONS);
        await delay(500 + Math.random() * 400);
        addLog(`${reason.emoji} ${player} fined £${reason.defaultAmount} — ${reason.reason}`);
      }
      updateStep(`m${m}-fines`, { status: "done", detail: `${fineCount} fines issued` });
      await delay(400);

      // 4. Bib washer
      updateStep(`m${m}-bib`, { status: "running" });
      addLog("👕 Spinning the wheel...");
      await delay(1000);
      const bibWinner = pickOne(joined);
      addLog(`🧺 ${bibWinner} is on bib duty!`);
      updateStep(`m${m}-bib`, { status: "done", detail: bibWinner });
      await delay(400);

      // 5. Kitty
      updateStep(`m${m}-kitty`, { status: "running" });
      const fees = joinCount * 6;
      await delay(600);
      addLog(`💰 £${fees} collected in match fees`);
      const fineTotal = fined.reduce(() => pickOne(FINE_REASONS).defaultAmount, 0);
      addLog(`💸 Fines added to Social Kitty`);
      updateStep(`m${m}-kitty`, { status: "done", detail: `£${fees} fees collected` });
      await delay(400);

      // 6. Chat
      updateStep(`m${m}-chat`, { status: "running" });
      const chatMessages = [
        `"What a game lads 🔥"`,
        `"${pickOne(joined)} was absolutely shocking today 😂"`,
        `"${pickOne(joined)} thinks he's Messi with those stepovers"`,
        `"Who's got the bibs? Don't forget again..."`,
        `"See you all next week 💪"`,
        `"That goal was offside and you know it"`,
        `"${pickOne(joined)} owes everyone an apology for that miss"`,
      ];
      const msgs = pick(chatMessages, 3 + Math.floor(Math.random() * 2));
      for (const msg of msgs) {
        if (abortRef.current) break;
        await delay(400 + Math.random() * 400);
        const sender = pickOne(joined);
        addLog(`💬 ${sender}: ${msg}`);
      }
      updateStep(`m${m}-chat`, { status: "done", detail: `${msgs.length} messages` });
      await delay(600);
    }

    setRunning(false);
    setDone(true);
    addLog("\n🏁 Match week simulation complete!");
  }, []);

  const handleStart = () => {
    setOpen(true);
    runSimulation();
  };

  const handleReset = () => {
    abortRef.current = true;
    setRunning(false);
    setDone(false);
    setSteps([]);
    setLog([]);
  };

  const handleClose = () => {
    abortRef.current = true;
    setOpen(false);
    setRunning(false);
    setDone(false);
    setSteps([]);
    setLog([]);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={handleStart}
          className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-2xl bg-accent text-accent-foreground shadow-lg flex items-center justify-center glow-primary"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Play className="w-6 h-6 ml-0.5" />
        </motion.button>
      )}

      {/* Simulation overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-card w-full max-w-md max-h-[85vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 pb-3 border-b border-border flex items-center justify-between shrink-0">
                <div>
                  <h2 className="font-display font-extrabold text-foreground text-lg">
                    ⚡ Match Week Sim
                  </h2>
                  <p className="text-xs text-muted-foreground">2 matches • full week simulation</p>
                </div>
                <button onClick={handleClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Steps grid */}
              <div className="p-4 pb-2 shrink-0">
                {[1, 2].map((matchNum) => (
                  <div key={matchNum} className="mb-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                      Match {matchNum}
                    </p>
                    <div className="grid grid-cols-6 gap-1.5">
                      {steps
                        .filter((s) => s.match === matchNum)
                        .map((step) => {
                          const Icon = step.icon;
                          return (
                            <motion.div
                              key={step.id}
                              className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-center transition-all ${
                                step.status === "done"
                                  ? "bg-primary/12 text-primary"
                                  : step.status === "running"
                                  ? "bg-accent/12 text-accent"
                                  : "bg-secondary/40 text-muted-foreground/50"
                              }`}
                              animate={step.status === "running" ? { scale: [1, 1.05, 1] } : {}}
                              transition={step.status === "running" ? { repeat: Infinity, duration: 1 } : {}}
                            >
                              {step.status === "done" ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : step.status === "running" ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Icon className="w-3.5 h-3.5" />
                              )}
                              <span className="text-[8px] font-semibold leading-tight truncate w-full">
                                {step.label.split(" ")[0]}
                              </span>
                            </motion.div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live log */}
              <div className="flex-1 overflow-y-auto px-4 pb-2 min-h-0">
                <div className="bg-foreground/5 rounded-xl p-3 font-mono text-[11px] leading-relaxed space-y-0.5">
                  <AnimatePresence initial={false}>
                    {log.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`${
                          line.startsWith("\n") ? "mt-2 font-bold text-foreground" : "text-muted-foreground"
                        } ${line.includes("✅") ? "text-primary" : ""} ${
                          line.includes("💬") ? "text-foreground/70" : ""
                        } ${line.includes("🏁") ? "text-accent font-bold mt-2" : ""}`}
                      >
                        {line}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {running && (
                    <motion.div
                      className="flex items-center gap-1.5 text-accent mt-1"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <Loader2 className="w-3 h-3 animate-spin" /> Simulating...
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 pt-2 border-t border-border shrink-0">
                {done ? (
                  <div className="flex gap-2">
                    <motion.button
                      onClick={handleReset}
                      className="flex-1 py-3 rounded-2xl bg-secondary text-secondary-foreground font-display font-bold text-sm flex items-center justify-center gap-2"
                      whileTap={{ scale: 0.98 }}
                    >
                      <RotateCcw className="w-4 h-4" /> Run Again
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        handleReset();
                        runSimulation();
                      }}
                      className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-sm flex items-center justify-center gap-2 glow-primary"
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play className="w-4 h-4" /> New Week
                    </motion.button>
                  </div>
                ) : (
                  <div className="text-center text-xs text-muted-foreground">
                    Simulation in progress — sit back and watch ⚡
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MatchWeekSimulator;
