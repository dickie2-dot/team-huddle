import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Coins, TrendingUp, TrendingDown, RotateCw, PartyPopper, X } from "lucide-react";
import confetti from "canvas-confetti";

/* ── Kitty Data ── */
const KITTY_BALANCE = 245.5;
const KITTY_UPDATED = "Today, 6:32 PM";
const TRANSACTIONS = [
  { label: "Match Fees", amount: 70, type: "in" as const },
  { label: "New Bibs", amount: 45, type: "out" as const },
  { label: "Pitch Booking", amount: 30, type: "out" as const },
];

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
  "hsl(28 100% 52%)",
  "hsl(220 70% 50%)",
  "hsl(0 80% 58%)",
  "hsl(280 60% 50%)",
  "hsl(150 75% 26%)",
  "hsl(45 100% 50%)",
  "hsl(190 80% 42%)",
  "hsl(340 70% 50%)",
  "hsl(100 60% 40%)",
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wheelDrawn = useRef(false);

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
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Coins className="w-4.5 h-4.5 text-primary" />
          </div>
          <h2 className="font-display font-bold text-foreground text-lg">Team Kitty</h2>
        </div>

        <p className="text-3xl font-display font-extrabold text-foreground tracking-tight tabular-nums">
          £{KITTY_BALANCE.toFixed(2)}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1 font-medium">Last updated: {KITTY_UPDATED}</p>

        <div className="mt-4 space-y-1">
          {TRANSACTIONS.map((tx, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0"
            >
              <div className="flex items-center gap-2">
                {tx.type === "in" ? (
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-primary" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <TrendingDown className="w-3 h-3 text-destructive" />
                  </div>
                )}
                <span className="text-sm font-medium text-foreground">{tx.label}</span>
              </div>
              <span
                className={`text-sm font-bold tabular-nums ${
                  tx.type === "in" ? "text-primary" : "text-destructive"
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
        <h2 className="font-display font-bold text-foreground text-lg mb-0.5">Activity Roulette</h2>
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
            transition={{
              duration: 4,
              ease: [0.17, 0.67, 0.16, 0.99],
            }}
            className="w-full h-full"
          >
            <canvas ref={canvasCallback} width={260} height={260} className="w-full h-full rounded-full shadow-md" />
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

      {showPopup && result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm px-6"
          onClick={() => setShowPopup(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
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
            <p className="text-xs text-muted-foreground mb-1 font-medium">Pack your bags, we're going to…</p>
            <h3 className="text-2xl font-display font-extrabold text-foreground">{result.name}</h3>
            <span className="sport-badge mt-3 inline-block">{result.tagline}</span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SocialHub;

