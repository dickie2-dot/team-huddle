import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Clock, Users, Zap, Check, Loader2, StickyNote } from "lucide-react";
import { format, parseISO } from "date-fns";

interface PlayerRow {
  id: string;
  name: string;
  position: string | null;
  is_active: boolean;
}

interface MatchSettings {
  match_date: string;
  match_time: string;
  location: string;
  notes: string | null;
}

const LockerRoom = () => {
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [matchSettings, setMatchSettings] = useState<MatchSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const activePlayers = players.filter((p) => p.is_active);
  const totalSpots = Math.max(activePlayers.length, 14);
  const confirmedCount = activePlayers.length;
  const progress = totalSpots > 0 ? (confirmedCount / totalSpots) * 100 : 0;

  const loadData = useCallback(async () => {
    const [matchRes, playersRes] = await Promise.all([
      supabase
        .from("match_settings")
        .select("match_date, match_time, location, notes")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from("players").select("id, name, position, is_active").order("name"),
    ]);

    setMatchSettings(matchRes.data ?? null);
    setPlayers(playersRes.data ?? []);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      setLoading(true);
      await loadData();
      if (isMounted) setLoading(false);
    };

    initialize();

    const channel = supabase
      .channel("locker-room-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "match_settings" },
        () => {
          void loadData();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        () => {
          void loadData();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [loadData]);

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "EEEE, MMM d");
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const [h, m] = timeStr.split(":");
      const hour = parseInt(h);
      const ampm = hour >= 12 ? "PM" : "AM";
      const h12 = hour % 12 || 12;
      return `${h12}:${m} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const handleSecureSpot = useCallback(() => {
    if (hasJoined || isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setHasJoined(true);
      setIsFlipping(false);
    }, 800);
  }, [hasJoined, isFlipping]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
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
          {matchSettings && (
            <span className="text-xs font-medium text-muted-foreground">
              {formatDate(matchSettings.match_date)}
            </span>
          )}
        </div>

        {matchSettings ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 text-sm text-foreground/80">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-medium">{formatTime(matchSettings.match_time)}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-foreground/80">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-medium">{matchSettings.location || "TBD"}</span>
            </div>
            {matchSettings.notes && (
              <div className="flex items-center gap-2.5 text-sm text-foreground/80">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <StickyNote className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="font-medium text-muted-foreground">{matchSettings.notes}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No match scheduled yet.</p>
        )}

        {/* Progress */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <Users className="w-3.5 h-3.5" /> Squad
            </span>
            <span className="font-bold font-display text-foreground tabular-nums">
              {confirmedCount}/{totalSpots}
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
              <motion.div
                className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-bold transition-all ${
                  player.is_active
                    ? "bg-primary/12 text-primary border border-primary/25 shadow-sm"
                    : "bg-secondary/40 text-muted-foreground/60 border border-border/20"
                }`}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                {player.is_active ? getInitials(player.name) : "?"}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={handleSecureSpot}
        disabled={hasJoined}
        className={`w-full py-3.5 rounded-2xl font-display font-bold text-base transition-all ${
          hasJoined
            ? "bg-primary/15 text-primary cursor-default"
            : "bg-primary text-primary-foreground glow-primary"
        }`}
        whileHover={!hasJoined ? { scale: 1.02 } : {}}
        whileTap={!hasJoined ? { scale: 0.98 } : {}}
      >
        {hasJoined ? (
          <span className="flex items-center justify-center gap-2">
            <Check className="w-5 h-5" /> You're In!
          </span>
        ) : (
          "Secure Your Spot (£6)"
        )}
      </motion.button>
    </div>
  );
};

export default LockerRoom;

