import type { SupabaseClient } from "@supabase/supabase-js";

const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{3,20}$/;

export function normalizeUsername(value: string): string {
  return value.trim();
}

export function validateUsername(value: string): string | null {
  const username = normalizeUsername(value);

  if (!username) {
    return "Choisis un pseudo.";
  }

  if (username.length < 3) {
    return "Le pseudo doit contenir au moins 3 caractères.";
  }

  if (username.length > 20) {
    return "Le pseudo ne peut pas dépasser 20 caractères.";
  }

  if (!USERNAME_PATTERN.test(username)) {
    return "Lettres, chiffres, tirets et underscores uniquement.";
  }

  return null;
}

export function formatUsernameError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("profiles_username_lower_idx") || lower.includes("duplicate key")) {
    return "Ce pseudo est déjà pris.";
  }

  if (lower.includes("profiles_username_format")) {
    return "Lettres, chiffres, tirets et underscores uniquement.";
  }

  if (lower.includes("profiles_username_length")) {
    return "Le pseudo doit contenir entre 3 et 20 caractères.";
  }

  return message;
}

export async function isUsernameTaken(
  supabase: SupabaseClient,
  username: string,
  excludeUserId?: string,
): Promise<boolean> {
  let query = supabase.from("profiles").select("id").ilike("username", username);

  if (excludeUserId) {
    query = query.neq("id", excludeUserId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(data);
}
