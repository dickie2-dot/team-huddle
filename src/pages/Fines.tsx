import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Banknote,
  Trophy,
  Plus,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DUMMY_FINES,
  DUMMY_PLAYERS,
  DUMMY_MATCHES,
  FINE_REASONS,
  type DummyFine,
} from "@/data/dummy-data";

const Fines = () => {
  const [tab, setTab] = useState<"fines" | "leaderboard">("fines");
  const [fines, setFines] = useState<DummyFine[]>(DUMMY_FINES);
  const [showAddFine, setShowAddFine] = useState(false);
  const [saving, setSaving] = useState(false);

  // Add fine form
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedMatch, setSelectedMatch] = useState("");
  const [fineAmount, setFineAmount] = useState("");

  const activePlayers = DUMMY_PLAYERS.filter((p) => p.is_active);

  // Leaderboard
  const leaderboard = activePlayers
    .map((p) => ({
      ...p,
      totalFines: fines
        .filter((f) => f.player_name === p.name)
        .reduce((sum, f) => sum + f.amount, 0),
      fineCount: fines.filter((f) => f.player_name === p.name).length,
    }))
    .filter((p) => p.totalFines > 0)
    .sort((a, b) => b.totalFines - a.totalFines);

  const finePotTotal = fines.reduce((sum, f) => sum + f.amount, 0);
  const paidTotal = fines.filter((f) => f.paid).reduce((sum, f) => sum + f.amount, 0);
  const unpaidTotal = finePotTotal - paidTotal;

  const handleAddFine = async () => {
    if (!selectedPlayer || !selectedReason || !fineAmount) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));

    const player = activePlayers.find((p) => p.id === selectedPlayer);
    const reason = FINE_REASONS.find((r) => r.reason === selectedReason);
    const match = DUMMY_MATCHES.find((m) => m.id === selectedMatch);

    if (player && reason) {
      const newFine: DummyFine = {
        id: `f${Date.now()}`,
        player_name: player.name,
        player_initials: player.initials,
        amount: Number(fineAmount),
        reason: reason.reason,
        emoji: reason.emoji,
        match_title: match?.title || "General",
        date: new Date().toISOString().split("T")[0],
        issued_by: "Admin",
        paid: false,
      };
      setFines((prev) => [newFine, ...prev]);
    }

    setSaving(false);
    setShowAddFine(false);
    setSelectedPlayer("");
    setSelectedReason("");
    setSelectedMatch("");
    setFineAmount("");
  };

  const handleReasonChange = (val: string) => {
    setSelectedReason(val);
    const reason = FINE_REASONS.find((r) => r.reason === val);
    if (reason) setFineAmount(String(reason.defaultAmount));
  };

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-1"
      >
        <h2 className="text-2xl font-display font-extrabold text-foreground">
          Fines
        </h2>
        <p className="text-xs text-muted-foreground font-medium">
          Sunday league justice system
        </p>
      </motion.div>

      {/* Fine Pot Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated p-5"
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
            <Banknote className="w-4.5 h-4.5 text-accent" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Season Fine Pot</p>
            <p className="text-2xl font-display font-extrabold text-foreground tabular-nums">
              £{finePotTotal.toFixed(0)}
            </p>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              Paid: <span className="text-primary font-bold">£{paidTotal}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-muted-foreground">
              Unpaid: <span className="text-accent font-bold">£{unpaidTotal}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-border/50">
          <Coins className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-semibold text-primary">
            Added to Social Kitty
          </span>
        </div>
      </motion.div>

      {/* Tab switch */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("fines")}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 justify-center ${
            tab === "fines"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
          }`}
        >
          <Banknote className="w-4 h-4" />
          All Fines
        </button>
        <button
          onClick={() => setTab("leaderboard")}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 justify-center ${
            tab === "leaderboard"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
          }`}
        >
          <Trophy className="w-4 h-4" />
          Leaderboard
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === "fines" ? (
          <motion.div
            key="fines"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-3"
          >
            {/* Add Fine Button */}
            <Dialog open={showAddFine} onOpenChange={setShowAddFine}>
              <DialogTrigger asChild>
                <Button className="w-full rounded-xl font-display font-bold" variant="outline">
                  <Plus className="w-4 h-4 mr-2" /> Issue Fine
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="font-display">Issue a Fine</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-2">
                  <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select player" />
                    </SelectTrigger>
                    <SelectContent>
                      {activePlayers.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedReason} onValueChange={handleReasonChange}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Reason for fine" />
                    </SelectTrigger>
                    <SelectContent>
                      {FINE_REASONS.map((r) => (
                        <SelectItem key={r.reason} value={r.reason}>
                          {r.emoji} {r.reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedMatch} onValueChange={setSelectedMatch}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Match (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {DUMMY_MATCHES.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.title} — {m.match_date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                      Amount (£)
                    </label>
                    <Input
                      type="number"
                      value={fineAmount}
                      onChange={(e) => setFineAmount(e.target.value)}
                      placeholder="5"
                      className="rounded-xl"
                      min={1}
                    />
                  </div>

                  <Button
                    onClick={handleAddFine}
                    disabled={saving || !selectedPlayer || !selectedReason || !fineAmount}
                    className="w-full rounded-xl font-display font-bold"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Issue Fine"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Fine Cards */}
            {fines.length === 0 ? (
              <div className="card-elevated p-8 text-center space-y-2">
                <Banknote className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                <p className="text-sm text-muted-foreground">No fines yet. Everyone's been well behaved!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {fines.map((fine, i) => (
                  <motion.div
                    key={fine.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="card-elevated p-4 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-lg shrink-0">
                      {fine.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground truncate">
                          {fine.player_name}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          fine.paid
                            ? "bg-primary/10 text-primary"
                            : "bg-accent/10 text-accent"
                        }`}>
                          {fine.paid ? "Paid" : "Unpaid"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {fine.reason} • {fine.match_title}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70">
                        {fine.date} • by {fine.issued_by}
                      </p>
                    </div>
                    <span className="text-lg font-display font-extrabold text-accent tabular-nums shrink-0">
                      £{fine.amount}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-2"
          >
            {leaderboard.length === 0 ? (
              <div className="card-elevated p-8 text-center space-y-2">
                <Trophy className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                <p className="text-sm text-muted-foreground">No fines data yet.</p>
              </div>
            ) : (
              leaderboard.map((player, i) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-elevated p-4 flex items-center gap-3"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-display ${
                    i === 0
                      ? "bg-accent/15 text-accent border-2 border-accent/30"
                      : i === 1
                      ? "bg-muted text-muted-foreground border-2 border-border"
                      : i === 2
                      ? "bg-accent/8 text-accent/70 border-2 border-accent/15"
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{player.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {player.fineCount} fine{player.fineCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className="text-lg font-display font-extrabold text-accent tabular-nums">
                    £{player.totalFines}
                  </span>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Fines;
