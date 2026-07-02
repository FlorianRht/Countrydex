import type { SupabaseClient } from "@supabase/supabase-js";
import { countries } from "@/data/countries";
import { getCountryByCode } from "@/lib/country-utils";

export function isValidBirthCountry(code: string): boolean {
  return Boolean(getCountryByCode(countries, code));
}

export async function setupStarterProfile(
  supabase: SupabaseClient,
  userId: string,
  birthCountryCode: string,
) {
  const code = birthCountryCode.trim().toUpperCase();

  if (!isValidBirthCountry(code)) {
    throw new Error("Pays de naissance invalide.");
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existingProfile) {
    return { alreadyExists: true as const };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    birth_country_code: code,
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { error: visitedError } = await supabase.from("visited_countries").insert({
    user_id: userId,
    country_code: code,
    is_starter: true,
  });

  if (visitedError) {
    throw new Error(visitedError.message);
  }

  await supabase.auth.updateUser({
    data: { birth_country_code: code },
  });

  return { alreadyExists: false as const };
}
