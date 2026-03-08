import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Clock, Users, Zap, Check, Lock, CreditCard, Loader2 } from "lucide-react";
import { DUMMY_CLUBS } from "@/data/dummy-data";
import { getSportById, getDefaultSport } from "@/data/sports-config";
import type { SportConfig } from "@/data/sports-config";

interface PlayerData {
  id: string;
  name: string;
  initials: string;
  confirmed: boolean;
  paymentStatus: "Paid" | "Pending" | "None";
}

// Active club — in production this comes from context/auth; for now use first dummy club
const activeClub = DUMMY_CLUBS[0];
const activeSport: SportConfig = getSportById(activeClub.sport_id) ?? getDefaultSport();
const MAX_PLAYERS = activeSport.max_players;

const LockerRoom = () => {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [hasJoined, setHasJoined] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [matchInfo, setMatchInfo] = useState({
    date: "Thursday, Mar 6",
    time: "7:00 PM",
    location: "Hackney Marshes Pitch 4",
  });

  useEffect(() => {
    loadMatchAndPlayers();
  }, []);

  const loadMatchAndPlayers = async () => {
    // Load match settings
    const { data: match } = await supabase
      .from("match_settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (match) {
      const dateObj = new Date(match.match_date + "T00:00:00");
      const dateStr = dateObj.toLocaleDateString("en-GB", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
      setMatchInfo({
        date: dateStr,
        time: match.match_time?.slice(0, 5) || "7:00 PM",
        location: match.location || "TBA",
      });
    }

    // Load players from DB
    const { data: dbPlayers } = await supabase
      .from("players")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (dbPlayers && dbPlayers.length > 0) {
      const mapped: PlayerData[] = dbPlayers.map((p, i) => ({
        id: p.id,
        name: p.name,
        initials: p.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase(),
        confirmed: i < 10, // Placeholder: first 10 confirmed
        paymentStatus: i < 8 ? "Paid" : i < 10 ? "Pending" : "None",
      }));
      setPlayers(mapped);
      setIsFull(mapped.filter((p) => p.confirmed).length >= MAX_PLAYERS);
    } else {
      // Fallback mock data
      const mockPlayers: PlayerData[] = [
        { id: "1", name: "Marcus Reid", initials: "MR", confirmed: true, paymentStatus: "Paid" },
        { id: "2", name: "Jake Thornton", initials: "JT", confirmed: true, paymentStatus: "Paid" },
        { id: "3", name: "Leo Vasquez", initials: "LV", confirmed: true, paymentStatus: "Paid" },
        { id: "4", name: "Sam Okafor", initials: "SO", confirmed: true, paymentStatus: "Paid" },
        { id: "5", name: "Dan Mitchell", initials: "DM", confirmed: true, paymentStatus: "Paid" },
        { id: "6", name: "Kai Brennan", initials: "KB", confirmed: true, paymentStatus: "Paid" },
        { id: "7", name: "Tom Ashford", initials: "TA", confirmed: true, paymentStatus: "Paid" },
        { id: "8", name: "Ryan Choi", initials: "RC", confirmed: true, paymentStatus: "Pending" },
        { id: "9", name: "Finn Gallagher", initials: "FG", confirmed: true, paymentStatus: "Pending" },
        { id: "10", name: "Nate Pearson", initials: "NP", confirmed: true, paymentStatus: "Paid" },
        { id: "11", name: "Will Harper", initials: "WH", confirmed: false, paymentStatus: "None" },
        { id: "12", name: "Zach Ellis", initials: "ZE", confirmed: false, paymentStatus: "None" },
        { id: "13", name: "Ben Kowalski", initials: "BK", confirmed: false, paymentStatus: "None" },
        { id: "14", name: "Omar Syed", initials: "OS", confirmed: false, paymentStatus: "None" },
      ];
      setPlayers(mockPlayers);
    }
  };

  const confirmedCount = players.filter((p) => p.confirmed).length;
  const progress = (confirmedCount / MAX_PLAYERS) * 100;

  const handleSecureSpot = useCallback(() => {
    if (hasJoined || isFlipping || isFull || isLocked) return;
    setShowPayment(true);
  }, [hasJoined, isFlipping, isFull, isLocked]);

  const handlePayment = async () => {
    setPaymentLoading(true);
    setPaymentError("");

    // Placeholder payment flow
    await new Promise((r) => setTimeout(r, 1500));

    // Simulate success
    setPaymentSuccess(true);
    setPaymentLoading(false);

    setTimeout(() => {
      setShowPayment(false);
      setIsFlipping(true);

      setTimeout(() => {
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === "11" ? { ...p, confirmed: true, paymentStatus: "Paid" } : p
          )
        );
        setHasJoined(true);
        setIsFlipping(false);
      }, 800);
    }, 1000);
  };

  return (
    <div className="space-y-5">
      {/* Locked Banner */}
      {isLocked && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/20"
        >
          <Lock className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-accent">Match is locked — squad is full</span>
        </motion.div>
      )}

      {/* Match Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="sport-badge">
            <Zap className="w-3 h-3" /> Next Match
          </span>
          <span className="text-xs font-medium text-muted-foreground">{matchInfo.date}</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 text-sm text-foreground/80">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-medium">{matchInfo.time}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-foreground/80">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-medium">{matchInfo.location}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <Users className="w-3.5 h-3.5" /> Squad
            </span>
            <span className="font-bold font-display text-foreground tabular-nums">
              {confirmedCount}/{MAX_PLAYERS}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Player Grid */}
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
          The Squad
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {players.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, type: "spring", stiffness: 200 }}
            >
              <AnimatePresence mode="wait">
                {player.id === "11" && isFlipping ? (
                  <motion.div
                    key="flipping"
                    className="aspect-square rounded-xl bg-primary flex items-center justify-center"
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <span className="text-primary-foreground font-bold text-[10px]">
                      {player.initials}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key={player.confirmed ? "confirmed" : "empty"}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[10px] font-bold transition-all relative ${
                      player.confirmed
                        ? "bg-primary/12 text-primary border border-primary/25 shadow-sm"
                        : "bg-secondary/40 text-muted-foreground/60 border border-border/20"
                    }`}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    layout
                  >
                    {player.confirmed ? player.initials : "?"}
                    {/* Payment indicator */}
                    {player.confirmed && (
                      <div
                        className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-card ${
                          player.paymentStatus === "Paid"
                            ? "bg-primary"
                            : "bg-accent"
                        }`}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-[10px] text-muted-foreground font-medium">Paid</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-[10px] text-muted-foreground font-medium">Pending</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={handleSecureSpot}
        disabled={hasJoined || isFull || isLocked}
        className={`w-full py-3.5 rounded-2xl font-display font-bold text-base transition-all ${
          hasJoined
            ? "bg-primary/15 text-primary cursor-default"
            : isFull || isLocked
            ? "bg-secondary text-muted-foreground cursor-not-allowed"
            : "bg-primary text-primary-foreground glow-primary"
        }`}
        whileHover={!hasJoined && !isFull && !isLocked ? { scale: 1.02 } : {}}
        whileTap={!hasJoined && !isFull && !isLocked ? { scale: 0.98 } : {}}
      >
        {hasJoined ? (
          <span className="flex items-center justify-center gap-2">
            <Check className="w-5 h-5" /> You're In!
          </span>
        ) : isFull ? (
          "Squad Full"
        ) : (
          "Secure Your Spot (£6)"
        )}
      </motion.button>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm px-6"
            onClick={() => !paymentLoading && setShowPayment(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card-elevated p-6 w-full max-w-sm space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              {paymentSuccess ? (
                <div className="text-center space-y-3 py-4">
                  <Check className="w-12 h-12 text-primary mx-auto" />
                  <p className="font-display font-bold text-foreground text-lg">
                    Payment Confirmed
                  </p>
                  <p className="text-sm text-muted-foreground">You're in the squad!</p>
                </div>
              ) : (
                <>
                  <div className="text-center space-y-2">
                    <CreditCard className="w-10 h-10 text-primary mx-auto" />
                    <h3 className="font-display font-bold text-foreground text-lg">
                      Secure Your Spot
                    </h3>
                    <p className="text-3xl font-display font-extrabold text-foreground"><p className="text-3xl font-display font-extrabold text-foreground">£6</p></p>
                    <p className="text-xs text-muted-foreground">Match fee for this week</p>
                  </div>

                  {paymentError && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                      {paymentError}
                    </div>
                  )}

                  <motion.button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-base glow-primary disabled:opacity-50"
                    whileTap={{ scale: 0.98 }}
                  >
                    {paymentLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Processing…
                      </span>
                    ) : (
                      "Pay & Confirm"
                    )}
                  </motion.button>

                  <button
                    onClick={() => setShowPayment(false)}
                    className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LockerRoom;
