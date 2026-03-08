import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, TrendingUp, TrendingDown, RotateCw, PartyPopper, X, Users, Banknote } from "lucide-react";
import confetti from "canvas-confetti";
import {
  DUMMY_KITTY_TRANSACTIONS,
  KITTY_BALANCE,
  DUMMY_CONTRIBUTIONS,
  type DummyContribution,
} from "@/data/dummy-data";

/* ── Wheel Data ── */
const ACTIVITIES = [
  { name: "Go-Karting", tagline: "High Speed" },
  { name: "Escape Room", tagline: "Teamwork" },
  { name: "Karaoke Night", tagline: "Pure Chaos" },
  { name: "Arcade Bar", tagline: "Retro Vibes" },
  { name: "Axe Throwing", tagline: "Stress Relief" },
  { name: "Bottomless Brunch", tagline: "The Classic" },
  { name: "Pub Quiz Takeover", tagline: "The Brains" },
  { name: "Crazy Golf", tagline: "Low Stakes" },
  { name: "Pro Match Trip", tagline: "Inspiration" },
  { name: "Comedy Club", tagline: "Big Laughs" },
];

const SEGMENT_ANGLE = 360 / ACTIVITIES.length;

const SEGMENT_COLORS = [
  "hsl(150 75% 36%)",
  "hsl(140 65% 28%)",
  "hsl(160 85% 32%)",
  "hsl(145 70% 42%)",
  "hsl(155 60% 25%)",
  "hsl(150 80% 38%)",
  "hsl(135 55% 30%)",
  "hsl(165 75% 34%)",
  "hsl(148 65% 45%)",
  "hsl(158 70% 22%)",
];

function drawWheel(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  ctx.clearRect(0, 0, size, size);

  ACTIVITIES.forEach((act, i) => {
    const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
    const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = SEGMENT_COLORS[i];
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + (endAngle - startAngle) / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = `bold ${size < 300 ? 9 : 11}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillText(act.name, r - 12, 4);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(cx, cy, 20, 0, Math.PI * 2);
  ctx.fillStyle = "hsl(220, 30%, 8%)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, 16, 0, Math.PI * 2);
  ctx.fillStyle = "hsl(150 75% 36%)";
  ctx.fill();
}

const SocialHub = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<(typeof ACTIVITIES)[number] | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showContributions, setShowContributions] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wheelDrawn = useRef(false);

  // Aggregate contributions by player
  const aggregatedContributions = DUMMY_CONTRIBUTIONS.reduce<
    Record<string, { voluntary: number; fines: number; fineDetails: string[] }>
  >((acc, c) => {
    if (!acc[c.name]) acc[c.name] = { voluntary: 0, fines: 0, fineDetails: [] };
    if (c.source === "fine") {
      acc[c.name].fines += c.amount;
      if (c.label) acc[c.name].fineDetails.push(c.label);
    } else {
      acc[c.name].voluntary += c.amount;
    }
    return acc;
  }, {});

  const contributionsList = Object.entries(aggregatedContributions)
    .map(([name, data]) => ({ name, ...data, total: data.voluntary + data.fines }))
    .sort((a, b) => b.total - a.total);

  // Fine total from contributions
  const fineTotal = DUMMY_CONTRIBUTIONS
    .filter((c) => c.source === "fine")
    .reduce((sum, c) => sum + c.amount, 0);

  const canvasCallback = useCallback((node: HTMLCanvasElement | null) => {
    if (node && !wheelDrawn.current) {
      canvasRef.current = node;
      drawWheel(node);
      wheelDrawn.current = true;
    }
  }, []);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    setShowPopup(false);

    const winnerIndex = Math.floor(Math.random() * ACTIVITIES.length);
    const targetAngle = 360 - (winnerIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);
    const fullSpins = 5 + Math.floor(Math.random() * 3);
    const totalRotation = rotation + fullSpins * 360 + targetAngle - (rotation % 360);

    setRotation(totalRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(ACTIVITIES[winnerIndex]);
      setShowPopup(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#22c55e", "#f97316", "#3b82f6", "#eab308", "#ec4899"],
      });
    }, 4200);
  };

  return (
    <div className="space-y-5">
      {/* ── Team Kitty Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Coins className="w-4.5 h-4.5 text-primary" />
            </div>
            <h2 className="font-display font-bold text-foreground text-lg">
              Team Kitty
            </h2>
          </div>
          <button
            onClick={() => setShowContributions(!showContributions)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Users className="w-4 h-4" />
          </button>
        </div>

        <p className="text-3xl font-display font-extrabold text-foreground tracking-tight tabular-nums">
          £{KITTY_BALANCE.toFixed(2)}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1 font-medium">
          Includes £{fineTotal} from fines
        </p>

        {/* Player Contributions with source */}
        <AnimatePresence>
          {showContributions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-3 border-t border-border/50">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                  Contributions
                </h4>
                <div className="space-y-1">
                  {contributionsList.map((pc, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5">
                      <div className="min-w-0">
                        <span className="text-xs font-medium text-foreground block">{pc.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {pc.voluntary > 0 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                              £{pc.voluntary} voluntary
                            </span>
                          )}
                          {pc.fines > 0 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-semibold">
                              £{pc.fines} fines
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-primary tabular-nums shrink-0">
                        £{pc.total.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 space-y-1">
          {DUMMY_KITTY_TRANSACTIONS.slice(0, 6).map((tx, i) => (
            <div
              key={tx.id}
              className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                {tx.type === "in" ? (
                  tx.source === "fine" ? (
                    <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Banknote className="w-3 h-3 text-accent" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-3 h-3 text-primary" />
                    </div>
                  )
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                    <TrendingDown className="w-3 h-3 text-destructive" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-sm font-medium text-foreground block truncate">
                    {tx.source === "fine" && tx.player_name
                      ? `${tx.player_name} – ${tx.label}`
                      : tx.label}
                  </span>
                  {tx.source === "fine" && (
                    <span className="text-[9px] text-accent font-semibold">Fine</span>
                  )}
                </div>
              </div>
              <span
                className={`text-sm font-bold tabular-nums shrink-0 ${
                  tx.type === "in"
                    ? tx.source === "fine" ? "text-accent" : "text-primary"
                    : "text-destructive"
                }`}
              >
                {tx.type === "in" ? "+" : "-"}£{tx.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Activity Roulette ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elevated p-5"
      >
        <h2 className="font-display font-bold text-foreground text-lg mb-0.5">
          Activity Roulette
        </h2>
        <p className="text-[10px] text-muted-foreground font-medium mb-5">
          Spin to decide your next social night!
        </p>

        <div className="relative flex items-center justify-center mx-auto" style={{ width: 260, height: 260 }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
            <div
              className="w-0 h-0"
              style={{
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderTop: "16px solid hsl(220, 30%, 8%)",
              }}
            />
          </div>

          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.17, 0.67, 0.16, 0.99] }}
            className="w-full h-full"
          >
            <canvas
              ref={canvasCallback}
              width={260}
              height={260}
              className="w-full h-full rounded-full shadow-md"
            />
          </motion.div>
        </div>

        <motion.button
          onClick={spin}
          disabled={spinning}
          className="w-full mt-5 py-3 rounded-xl font-display font-bold text-sm bg-primary text-primary-foreground disabled:opacity-50 glow-primary"
          whileTap={!spinning ? { scale: 0.96 } : undefined}
        >
          {spinning ? (
            <span className="flex items-center justify-center gap-2">
              <RotateCw className="w-4 h-4 animate-spin" />
              Spinning…
            </span>
          ) : (
            "🎰  SPIN THE WHEEL"
          )}
        </motion.button>
      </motion.div>

      {/* Result Popup */}
      <AnimatePresence>
        {showPopup && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm px-6"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="card-elevated p-6 w-full max-w-sm text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <PartyPopper className="w-10 h-10 text-accent mx-auto mb-3" />
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                Pack your bags, we're going to…
              </p>
              <h3 className="text-2xl font-display font-extrabold text-foreground">
                {result.name}
              </h3>
              <span className="sport-badge mt-3 inline-block">
                {result.tagline}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialHub;
