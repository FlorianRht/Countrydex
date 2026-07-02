import type { SupabaseClient } from "@supabase/supabase-js";

export async function getPostAuthPath(supabase: SupabaseClient): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "/";

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  return profile ? "/dex" : "/onboarding";
}
