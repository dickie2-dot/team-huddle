import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const now = new Date();

  const { data: matches, error } = await supabase
    .from("match_settings")
    .select("id, match_date, match_time, recurrence")
    .neq("recurrence", "none");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let scheduled = 0;

  for (const match of matches || []) {
    const daysToAdd = match.recurrence === "weekly" ? 7 : 14;
    const occurrence = new Date(`${match.match_date}T${match.match_time}`);

    if (Number.isNaN(occurrence.getTime())) continue;

    let nextOccurrence = new Date(occurrence);

    // If event time has already passed, keep advancing until future.
    while (nextOccurrence <= now) {
      nextOccurrence.setDate(nextOccurrence.getDate() + daysToAdd);
    }

    const hasChanged = nextOccurrence.toISOString().split("T")[0] !== match.match_date;
    if (!hasChanged) continue;

    const nextDateStr = nextOccurrence.toISOString().split("T")[0];

    await supabase
      .from("match_settings")
      .update({
        match_date: nextDateStr,
        updated_at: new Date().toISOString(),
      })
      .eq("id", match.id);

    scheduled++;
  }

  return new Response(
    JSON.stringify({ message: `Scheduled ${scheduled} recurring match(es)`, scheduled }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
