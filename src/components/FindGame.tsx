import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Calendar, Clock, Users, Search, Filter,
  ChevronDown, Zap, Lock, Trophy, Star,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { OPEN_MATCHES, getSlotsLeft, isFull, type OpenMatch } from "@/data/find-game-data";

const SPORT_FILTERS = [
  { value: "all", label: "All Sports" },
  { value: "football", label: "⚽ Football" },
  { value: "basketball", label: "🏀 Basketball" },
  { value: "padel", label: "🎾 Padel" },
];

const DATE_FILTERS = [
  { value: "all", label: "Any Date" },
  { value: "this-week", label: "This Week" },
  { value: "next-week", label: "Next Week" },
  { value: "this-month", label: "This Month" },
];

const FindGame = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let matches = OPEN_MATCHES.filter((m) => m.is_public);

    if (sportFilter !== "all") {
      matches = matches.filter((m) => m.sport === sportFilter);
    }

    if (dateFilter !== "all") {
      const now = new Date();
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      const endOfNextWeek = new Date(endOfWeek);
      endOfNextWeek.setDate(endOfWeek.getDate() + 7);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      matches = matches.filter((m) => {
        const d = parseISO(m.match_date);
        if (dateFilter === "this-week") return d <= endOfWeek;
        if (dateFilter === "next-week") return d > endOfWeek && d <= endOfNextWeek;
        if (dateFilter === "this-month") return d <= endOfMonth;
        return true;
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      matches = matches.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.club_name.toLowerCase().includes(q) ||
          m.location.toLowerCase().includes(q) ||
          m.venue_area.toLowerCase().includes(q)
      );
    }

    return matches.sort(
      (a, b) => new Date(a.match_date + "T" + a.match_time).getTime() -
        new Date(b.match_date + "T" + b.match_time).getTime()
    );
  }, [sportFilter, dateFilter, search]);

  const handleJoin = async (match: OpenMatch) => {
    if (isFull(match) || joinedIds.has(match.id)) return;
    setJoiningId(match.id);
    // Simulate payment flow
    await new Promise((r) => setTimeout(r, 1200));
    setJoinedIds((prev) => new Set(prev).add(match.id));
    setJoiningId(null);
    toast({
      title: "🎉 You're in!",
      description: `Joined ${match.title} – £${match.fee} payment processing.`,
    });
  };

  const slotColor = (match: OpenMatch) => {
    const left = getSlotsLeft(match);
    if (left <= 0) return "text-destructive";
    if (left <= 2) return "text-accent";
    return "text-primary";
  };

  const slotBg = (match: OpenMatch) => {
    const left = getSlotsLeft(match);
    if (left <= 0) return "bg-destructive/10";
    if (left <= 2) return "bg-accent/10";
    return "bg-primary/10";
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Search className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">Find a Game</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Discover open matches nearby and get playing
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by venue, club, or area…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card border-border"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Select value={sportFilter} onValueChange={setSportFilter}>
          <SelectTrigger className="flex-1 bg-card text-sm h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SPORT_FILTERS.map((f) => (
              <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="flex-1 bg-card text-sm h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_FILTERS.map((f) => (
              <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>{filtered.length} match{filtered.length !== 1 ? "es" : ""} found</span>
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-primary" /> Live availability
        </span>
      </div>

      {/* Match cards */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Trophy className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No matches found</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your filters</p>
          </motion.div>
        )}

        {filtered.map((match, i) => {
          const full = isFull(match);
          const slotsLeft = getSlotsLeft(match);
          const joined = joinedIds.has(match.id);
          const joining = joiningId === match.id;
          const percentage = Math.round((match.confirmed_count / match.max_players) * 100);

          return (
            <motion.div
              key={match.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className={`overflow-hidden transition-all ${joined ? "ring-2 ring-primary/40" : ""} ${full && !joined ? "opacity-60" : ""}`}>
                <CardContent className="p-0">
                  {/* Top color strip */}
                  <div className={`h-1 ${match.sport === "football" ? "bg-primary" : match.sport === "basketball" ? "bg-accent" : "bg-ring"}`} />

                  <div className="p-4 space-y-3">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-lg">{match.sport_emoji}</span>
                          <h3 className="font-semibold text-foreground text-sm truncate">{match.title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{match.club_name}</p>
                      </div>

                      {/* Slots badge */}
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${slotBg(match)} ${slotColor(match)}`}>
                        <Users className="w-3 h-3" />
                        {full ? "FULL" : `${slotsLeft} left`}
                      </div>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 text-primary/70" />
                        {format(parseISO(match.match_date), "EEE d MMM")}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 text-primary/70" />
                        {match.match_time}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground col-span-2 truncate">
                        <MapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                        {match.location}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${full ? "bg-destructive" : "bg-primary"}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>{match.confirmed_count}/{match.max_players} players</span>
                        {match.skill_level !== "any" && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                            <Star className="w-2.5 h-2.5 mr-0.5" />
                            {match.skill_level}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-bold text-foreground">
                        £{match.fee}
                        <span className="text-xs font-normal text-muted-foreground ml-1">/ player</span>
                      </span>

                      {joined ? (
                        <Badge className="bg-primary/10 text-primary border-0 font-semibold">
                          ✓ Joined
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          disabled={full || joining}
                          onClick={() => handleJoin(match)}
                          className="h-8 text-xs font-bold"
                        >
                          {joining ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 0.8 }}
                              className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full"
                            />
                          ) : full ? (
                            "Full"
                          ) : (
                            `Join – £${match.fee}`
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default FindGame;
