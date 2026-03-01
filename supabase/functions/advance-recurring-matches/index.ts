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

  // Find match settings where the match date has passed and recurrence is set
  const today = new Date().toISOString().split("T")[0];

  const { data: matches, error } = await supabase
    .from("match_settings")
    .select("*")
    .lt("match_date", today)
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
    const oldDate = new Date(match.match_date);
    
    // Keep advancing until the date is in the future
    let nextDate = new Date(oldDate);
    while (nextDate.toISOString().split("T")[0] < today) {
      nextDate.setDate(nextDate.getDate() + daysToAdd);
    }

    const nextDateStr = nextDate.toISOString().split("T")[0];

    // Update the match date to the next occurrence
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
