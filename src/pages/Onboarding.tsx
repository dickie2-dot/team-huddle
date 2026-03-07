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

  const handleCreateClub = async () => {
    if (!clubName.trim() || !sportType) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setErrorMessage("");

    // Placeholder: In production, this would create a club record
    await new Promise((r) => setTimeout(r, 1000));
    setSuccessMessage(`"${clubName}" created! Redirecting...`);
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

    // Placeholder: In production, this would validate the invite code
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
    // Placeholder: In production, this would trigger Stripe Connect OAuth
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
                <Select value={sportType} onValueChange={setSportType}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="padel">Padel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
