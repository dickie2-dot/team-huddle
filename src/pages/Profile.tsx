import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  User,
  Camera,
  Save,
  Loader2,
  CheckCircle2,
  Bell,
  Moon,
  Shield,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [profileId, setProfileId] = useState<string | null>(null);

  // Settings (placeholders)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profile) {
      setProfileId(profile.id);
      setDisplayName(profile.display_name || "");
      setAvatarUrl(profile.avatar_url || "");
    }
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSaveError("You must be logged in.");
      setSaving(false);
      return;
    }

    const updates = {
      display_name: displayName.trim(),
      avatar_url: avatarUrl.trim(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id);

    if (error) {
      setSaveError(error.message);
      toast({ title: "Error saving profile", description: error.message, variant: "destructive" });
    } else {
      setSaveSuccess(true);
      toast({ title: "Profile updated!" });
      setTimeout(() => setSaveSuccess(false), 2000);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  const handleAvatarPlaceholder = () => {
    // Placeholder: In production, this would trigger a file picker + upload to storage
    toast({ title: "Upload coming soon", description: "Avatar upload will be available shortly." });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 pt-6 pb-4 max-w-lg mx-auto w-full">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => navigate("/")}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-xl font-display font-bold text-foreground tracking-tight">
            Profile & <span className="text-gradient-primary">Settings</span>
          </h1>
        </div>
      </header>

      <main className="px-4 pb-8 max-w-lg mx-auto w-full space-y-5">
        {/* Avatar + Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-5 space-y-4"
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <button
              onClick={handleAvatarPlaceholder}
              className="relative group"
            >
              <div className="w-16 h-16 rounded-full bg-primary/15 border-2 border-primary/25 flex items-center justify-center text-xl font-bold font-display text-primary">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-foreground/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-5 h-5 text-primary-foreground" />
              </div>
            </button>

            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Display Name
              </label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Name"
                className="rounded-xl"
              />
            </div>
          </div>

          {saveError && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {saveError}
            </div>
          )}

          <Button
            onClick={saveProfile}
            disabled={saving}
            className="w-full rounded-xl font-display font-bold"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-4 h-4 mr-2 text-primary-foreground" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Saving…" : saveSuccess ? "Saved!" : "Save Profile"}
          </Button>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-5 space-y-1"
        >
          <h2 className="font-display font-bold text-foreground mb-3">Settings</h2>

          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Notifications</p>
                <p className="text-[10px] text-muted-foreground">Match reminders & updates</p>
              </div>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Moon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Dark Mode</p>
                <p className="text-[10px] text-muted-foreground">Coming soon</p>
              </div>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              disabled
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Privacy</p>
                <p className="text-[10px] text-muted-foreground">Profile visibility</p>
              </div>
            </div>
            <span className="text-xs font-medium text-muted-foreground">Public</span>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full rounded-xl text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/5"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
