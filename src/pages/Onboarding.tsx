import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Trophy,
  Users,
  CreditCard,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_SPORTS, getSportById, createCustomSportConfig } from "@/data/sports-config";
import type { SportConfig } from "@/data/sports-config";

type Mode = "create" | "join";
type StripeStatus = "Not Connected" | "Pending" | "Connected";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode | null>(null);
  const [clubName, setClubName] = useState("");
  const [sportType, setSportType] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [stripeStatus, setStripeStatus] = useState<StripeStatus>("Not Connected");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Custom sport state
  const [isCustomSport, setIsCustomSport] = useState(false);
  const [customSportName, setCustomSportName] = useState("");
  const [customTeamSize, setCustomTeamSize] = useState("");
  const [customMaxPlayers, setCustomMaxPlayers] = useState("");

  const selectedSport: SportConfig | undefined = isCustomSport
    ? undefined
    : getSportById(sportType);

  const handleSportChange = (value: string) => {
    if (value === "__custom") {
      setIsCustomSport(true);
      setSportType("");
    } else {
      setIsCustomSport(false);
      setSportType(value);
      setCustomSportName("");
      setCustomTeamSize("");
      setCustomMaxPlayers("");
    }
  };

  const getResolvedSport = (): SportConfig | null => {
    if (isCustomSport) {
      if (!customSportName.trim() || !customTeamSize || !customMaxPlayers) return null;
      return createCustomSportConfig({
        name: customSportName.trim(),
        team_size: parseInt(customTeamSize),
        max_players: parseInt(customMaxPlayers),
      });
    }
    return selectedSport ?? null;
  };

  const handleCreateClub = async () => {
    const sport = getResolvedSport();
    if (!clubName.trim() || !sport) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setErrorMessage("");

    // Placeholder: In production, this would create a club record
    await new Promise((r) => setTimeout(r, 1000));
    setSuccessMessage(`"${clubName}" created! ${sport.emoji} ${sport.name} — ${sport.team_size}v${sport.team_size} (max ${sport.max_players} players)`);
    setLoading(false);

    setTimeout(() => navigate("/"), 1500);
  };

  const handleJoinClub = async () => {
    if (!inviteCode.trim()) {
      setErrorMessage("Please enter a valid invite code.");
      return;
    }
    setLoading(true);
    setErrorMessage("");

    await new Promise((r) => setTimeout(r, 1000));

    if (inviteCode.toUpperCase() === "INVALID") {
      setErrorMessage("Invalid invite code. Please check and try again.");
      setLoading(false);
      return;
    }

    setSuccessMessage("Joined the club! Redirecting...");
    setLoading(false);
    setTimeout(() => navigate("/"), 1500);
  };

  const handleStripeConnect = () => {
    setStripeStatus("Pending");
    setTimeout(() => setStripeStatus("Connected"), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-6"
      >
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-extrabold tracking-tight text-foreground">
            Team <span className="text-gradient-primary">Huddle</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Set up your club or join an existing one
          </p>
        </div>

        {/* Mode selector */}
        {!mode && !successMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <motion.button
              onClick={() => setMode("create")}
              className="w-full card-elevated p-5 flex items-center gap-4 hover:border-primary/30 transition-colors text-left"
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground">Create Club</p>
                <p className="text-xs text-muted-foreground">
                  Start a new team and invite players
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto" />
            </motion.button>

            <motion.button
              onClick={() => setMode("join")}
              className="w-full card-elevated p-5 flex items-center gap-4 hover:border-primary/30 transition-colors text-left"
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground">Join Club</p>
                <p className="text-xs text-muted-foreground">
                  Enter an invite code to join
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto" />
            </motion.button>
          </motion.div>
        )}

        {/* Create Club Form */}
        {mode === "create" && !successMessage && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-elevated p-5 space-y-4"
          >
            <h2 className="font-display font-bold text-foreground text-lg">
              Create Your Club
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Club Name
                </label>
                <Input
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  placeholder="My Awesome Club"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Sport Type
                </label>
                <Select
                  value={isCustomSport ? "__custom" : sportType}
                  onValueChange={handleSportChange}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_SPORTS.map((sport) => (
                      <SelectItem key={sport.id} value={sport.id}>
                        {sport.emoji} {sport.name} ({sport.team_size}v{sport.team_size})
                      </SelectItem>
                    ))}
                    <SelectItem value="__custom">
                      <span className="flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Custom Sport
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Sport info badge */}
                {selectedSport && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10"
                  >
                    <p className="text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground">{selectedSport.emoji} {selectedSport.name}</span>
                      {" — "}
                      {selectedSport.team_size}v{selectedSport.team_size} · Max {selectedSport.max_players} players · {selectedSport.sport_category}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Custom sport fields */}
              {isCustomSport && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3 p-3 rounded-xl bg-secondary/30 border border-border/30"
                >
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Custom Sport Details
                  </p>
                  <Input
                    value={customSportName}
                    onChange={(e) => setCustomSportName(e.target.value)}
                    placeholder="Sport name"
                    className="rounded-xl"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">
                        Team Size
                      </label>
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        value={customTeamSize}
                        onChange={(e) => setCustomTeamSize(e.target.value)}
                        placeholder="e.g. 6"
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">
                        Max Players
                      </label>
                      <Input
                        type="number"
                        min={2}
                        max={60}
                        value={customMaxPlayers}
                        onChange={(e) => setCustomMaxPlayers(e.target.value)}
                        placeholder="e.g. 12"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Stripe Connect */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Payment Setup
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant={stripeStatus === "Connected" ? "secondary" : "outline"}
                    onClick={handleStripeConnect}
                    disabled={stripeStatus !== "Not Connected"}
                    className="rounded-xl flex-1"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {stripeStatus === "Not Connected" && "Connect Stripe"}
                    {stripeStatus === "Pending" && (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-1" /> Connecting…
                      </>
                    )}
                    {stripeStatus === "Connected" && (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1 text-primary" /> Connected
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Status:{" "}
                  <span
                    className={
                      stripeStatus === "Connected"
                        ? "text-primary font-semibold"
                        : stripeStatus === "Pending"
                        ? "text-accent font-semibold"
                        : "text-muted-foreground"
                    }
                  >
                    {stripeStatus}
                  </span>
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {errorMessage}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setMode(null);
                  setErrorMessage("");
                }}
                className="rounded-xl"
              >
                Back
              </Button>
              <Button
                onClick={handleCreateClub}
                disabled={loading}
                className="rounded-xl flex-1 font-display font-bold"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Create Club <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Join Club Form */}
        {mode === "join" && !successMessage && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-elevated p-5 space-y-4"
          >
            <h2 className="font-display font-bold text-foreground text-lg">
              Join a Club
            </h2>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Invite Code
              </label>
              <Input
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="ABCD1234"
                maxLength={8}
                className="rounded-xl text-center text-lg tracking-widest font-mono font-bold"
              />
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {errorMessage}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setMode(null);
                  setErrorMessage("");
                }}
                className="rounded-xl"
              >
                Back
              </Button>
              <Button
                onClick={handleJoinClub}
                disabled={loading}
                className="rounded-xl flex-1 font-display font-bold"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Join Club <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card-elevated p-6 text-center space-y-3"
          >
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
            <p className="font-display font-bold text-foreground text-lg">
              {successMessage}
            </p>
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mx-auto" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Onboarding;
