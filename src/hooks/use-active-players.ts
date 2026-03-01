import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ActivePlayer {
  id: string;
  name: string;
  position: string | null;
  is_active: boolean;
}

export const useActivePlayers = () => {
  const [players, setPlayers] = useState<ActivePlayer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlayers = useCallback(async () => {
    const { data, error } = await supabase
      .from("players")
      .select("id, name, position, is_active")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      setPlayers([]);
      return;
    }

    setPlayers(data ?? []);
  }, []);

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      await loadPlayers();
      if (active) setLoading(false);
    };

    initialize();

    const channel = supabase
      .channel("active-players-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        () => {
          void loadPlayers();
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [loadPlayers]);

  return { players, loading, refresh: loadPlayers };
};
