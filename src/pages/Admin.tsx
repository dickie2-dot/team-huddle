import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Save,
  Users,
  Shield,
  Plus,
  Trash2,
  Loader2,
  StickyNote,
  Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface MatchSettings {
  id?: string;
  match_date: string;
  match_time: string;
  location: string;
  notes: string;
  recurrence: string;
}

interface PlayerRow {
  id: string;
  name: string;
  position: string;
  is_active: boolean;
}

interface RoleRow {
  id: string;
  user_id: string;
  role: string;
  profile?: { display_name: string | null };
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState<"match" | "roster" | "admins">("match");

  // Match settings
  const [matchSettings, setMatchSettings] = useState<MatchSettings>({
    match_date: "",
    match_time: "",
    location: "",
    notes: "",
    recurrence: "none",
  });

  // Roster
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerPosition, setNewPlayerPosition] = useState("");

  // Admin roles
  const [admins, setAdmins] = useState<RoleRow[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // For testing without auth, allow access
      setIsAdmin(true);
      await loadData();
      setLoading(false);
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleData) {
      setIsAdmin(true);
      await loadData();
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  };

  const loadData = async () => {
    // Load match settings
    const { data: matchData } = await supabase
      .from("match_settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (matchData) {
      setMatchSettings({
        id: matchData.id,
        match_date: matchData.match_date,
        match_time: matchData.match_time,
        location: matchData.location,
        notes: matchData.notes || "",
        recurrence: (matchData as any).recurrence || "none",
      });
    }

    // Load roster
    const { data: playerData } = await supabase
      .from("players")
      .select("*")
      .order("name");

    if (playerData) setPlayers(playerData);

    // Load admins
    const { data: adminData } = await supabase
      .from("user_roles")
      .select("id, user_id, role")
      .eq("role", "admin");

    if (adminData) {
      // Get display names for admins
      const userIds = adminData.map((a) => a.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", userIds);

      const enriched = adminData.map((a) => ({
        ...a,
        profile: profiles?.find((p) => p.user_id === a.user_id),
      }));
      setAdmins(enriched);
    }
  };

  const saveMatchSettings = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (matchSettings.id) {
      const { error } = await supabase
        .from("match_settings")
        .update({
          match_date: matchSettings.match_date,
          match_time: matchSettings.match_time,
          location: matchSettings.location,
          notes: matchSettings.notes,
          recurrence: matchSettings.recurrence,
          updated_by: user?.id,
          updated_at: new Date().toISOString(),
        } as any)
        .eq("id", matchSettings.id);

      if (error) {
        toast({ title: "Error saving", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Match settings updated" });
      }
    } else {
      const { error } = await supabase.from("match_settings").insert({
        match_date: matchSettings.match_date,
        match_time: matchSettings.match_time,
        location: matchSettings.location,
        notes: matchSettings.notes,
        recurrence: matchSettings.recurrence,
        updated_by: user?.id,
      } as any);

      if (error) {
        toast({ title: "Error saving", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Match settings saved" });
        await loadData();
      }
    }
    setSaving(false);
  };

  const addPlayer = async () => {
    if (!newPlayerName.trim()) return;
    const { error } = await supabase.from("players").insert({
      name: newPlayerName.trim(),
      position: newPlayerPosition.trim(),
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setNewPlayerName("");
      setNewPlayerPosition("");
      await loadData();
    }
  };

  const removePlayer = async (id: string) => {
    await supabase.from("players").delete().eq("id", id);
    await loadData();
  };

  const togglePlayerActive = async (id: string, current: boolean) => {
    await supabase.from("players").update({ is_active: !current }).eq("id", id);
    await loadData();
  };

  const sections = [
    { id: "match" as const, label: "Match", icon: Calendar },
    { id: "roster" as const, label: "Roster", icon: Users },
    { id: "admins" as const, label: "Admins", icon: Shield },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 space-y-4">
        <Shield className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-display font-bold text-foreground">Access Denied</h2>
        <p className="text-sm text-muted-foreground text-center">You need admin permissions to access this page.</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to App
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 max-w-lg mx-auto w-full">
        <div className="flex items-center gap-3 mb-5">
          <motion.button
            onClick={() => navigate("/")}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-xl font-display font-bold text-foreground tracking-tight">
            Admin <span className="text-gradient-primary">Panel</span>
          </h1>
        </div>

        {/* Section tabs */}
        <div className="flex gap-2">
          {sections.map((s) => {
            const Icon = s.icon;
            const active = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {s.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="px-4 pb-8 max-w-lg mx-auto w-full space-y-5">
        {/* Match Settings */}
        {activeSection === "match" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated p-5 space-y-4"
          >
            <h2 className="font-display font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Next Match Settings
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Date
                </label>
                <Input
                  type="date"
                  value={matchSettings.match_date}
                  onChange={(e) => setMatchSettings({ ...matchSettings, match_date: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Time
                </label>
                <Input
                  type="time"
                  value={matchSettings.match_time}
                  onChange={(e) => setMatchSettings({ ...matchSettings, match_time: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </label>
                <Input
                  value={matchSettings.location}
                  onChange={(e) => setMatchSettings({ ...matchSettings, location: e.target.value })}
                  placeholder="e.g. Hackney Marshes Pitch 4"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <StickyNote className="w-3.5 h-3.5" /> Notes
                </label>
                <Textarea
                  value={matchSettings.notes}
                  onChange={(e) => setMatchSettings({ ...matchSettings, notes: e.target.value })}
                  placeholder="Bring shin pads, no excuses..."
                  className="rounded-xl min-h-[80px]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Repeat className="w-3.5 h-3.5" /> Recurrence
                </label>
                <div className="flex gap-2">
                  {[
                    { value: "none", label: "One-off" },
                    { value: "weekly", label: "Weekly" },
                    { value: "biweekly", label: "Biweekly" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setMatchSettings({ ...matchSettings, recurrence: opt.value })}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                        matchSettings.recurrence === opt.value
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {matchSettings.recurrence !== "none" && (
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    After the match date, the next match will auto-schedule {matchSettings.recurrence === "weekly" ? "7" : "14"} days later with the same time & location.
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={saveMatchSettings}
              disabled={saving || !matchSettings.match_date || !matchSettings.match_time}
              className="w-full rounded-xl font-display font-bold"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Match Settings
            </Button>
          </motion.div>
        )}

        {/* Roster */}
        {activeSection === "roster" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Add player */}
            <div className="card-elevated p-5 space-y-3">
              <h2 className="font-display font-bold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Add Player
              </h2>
              <div className="flex gap-2">
                <Input
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Name"
                  className="rounded-xl flex-1"
                />
                <Input
                  value={newPlayerPosition}
                  onChange={(e) => setNewPlayerPosition(e.target.value)}
                  placeholder="Position"
                  className="rounded-xl w-28"
                />
              </div>
              <Button onClick={addPlayer} disabled={!newPlayerName.trim()} className="w-full rounded-xl font-display font-bold">
                <Plus className="w-4 h-4 mr-2" /> Add to Squad
              </Button>
            </div>

            {/* Player list */}
            <div className="card-elevated p-5 space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Squad ({players.length})
              </h3>
              {players.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No players added yet</p>
              ) : (
                <div className="space-y-2">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        player.is_active
                          ? "bg-primary/5 border-primary/20"
                          : "bg-secondary/30 border-border opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                            player.is_active
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {player.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{player.name}</p>
                          {player.position && (
                            <p className="text-xs text-muted-foreground">{player.position}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => togglePlayerActive(player.id, player.is_active)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            player.is_active
                              ? "bg-primary/10 text-primary hover:bg-primary/20"
                              : "bg-muted text-muted-foreground hover:bg-secondary"
                          }`}
                        >
                          {player.is_active ? "Active" : "Inactive"}
                        </button>
                        <button
                          onClick={() => removePlayer(player.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Admin management */}
        {activeSection === "admins" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated p-5 space-y-4"
          >
            <h2 className="font-display font-bold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Admin Users
            </h2>

            <p className="text-xs text-muted-foreground">
              Admins can change match settings, manage the roster, and create polls.
            </p>

            {admins.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No admins set up yet. Use the backend to assign the first admin role.
              </p>
            ) : (
              <div className="space-y-2">
                {admins.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        {admin.profile?.display_name || "Unknown User"}
                      </span>
                    </div>
                    <span className="sport-badge text-[10px]">Admin</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Admin;
