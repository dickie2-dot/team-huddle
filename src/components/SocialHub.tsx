import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  "hsl(150 80% 38%)",
  "hsl(32 100% 55%)",
  "hsl(220 70% 50%)",
  "hsl(0 84% 60%)",
  "hsl(280 60% 50%)",
  "hsl(150 80% 28%)",
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
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Text
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + (endAngle - startAngle) / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = `bold ${size < 300 ? 9 : 11}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillText(act.name, r - 12, 4);
    ctx.restore();
  });

  // Center circle
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.fillStyle = "hsl(220, 25%, 10%)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fillStyle = "hsl(150 80% 38%)";
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
    // Land in the middle of the winning segment, pointer is at top (0°/360°)
    const targetAngle = 360 - (winnerIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);
    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5-7 full spins
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
    <div className="space-y-6">
      {/* ── Team Kitty Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Coins className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-display font-bold text-foreground text-lg">
            Team Kitty
          </h2>
        </div>

        <p className="text-4xl font-display font-extrabold text-foreground tracking-tight">
          £{KITTY_BALANCE.toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {KITTY_UPDATED}
        </p>

        <div className="mt-4 space-y-2">
          {TRANSACTIONS.map((tx, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-2">
                {tx.type === "in" ? (
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                )}
                <span className="text-sm text-foreground">{tx.label}</span>
              </div>
              <span
                className={`text-sm font-semibold ${
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
        <h2 className="font-display font-bold text-foreground text-lg mb-1">
          Activity Roulette
        </h2>
        <p className="text-xs text-muted-foreground mb-5">
          Spin to decide your next social night!
        </p>

        {/* Wheel Container */}
        <div className="relative flex items-center justify-center mx-auto" style={{ width: 280, height: 280 }}>
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
            <div
              className="w-0 h-0"
              style={{
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderTop: "18px solid hsl(220, 25%, 10%)",
              }}
            />
          </div>

          {/* Spinning Wheel */}
          <motion.div
            animate={{ rotate: rotation }}
            transition={{
              duration: 4,
              ease: [0.17, 0.67, 0.16, 0.99],
            }}
            className="w-full h-full"
          >
            <canvas
              ref={canvasCallback}
              width={280}
              height={280}
              className="w-full h-full rounded-full shadow-lg"
            />
          </motion.div>
        </div>

        {/* Spin Button */}
        <motion.button
          onClick={spin}
          disabled={spinning}
          className="w-full mt-5 py-3 rounded-xl font-display font-bold text-base bg-primary text-primary-foreground disabled:opacity-50 glow-primary"
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

      {/* ── Result Popup ── */}
      <AnimatePresence>
        {showPopup && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm px-6"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-xl text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
              <PartyPopper className="w-10 h-10 text-accent mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-1">
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
