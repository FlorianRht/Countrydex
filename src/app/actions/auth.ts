"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl, isSupabaseConfigured } from "@/lib/supabase/config";
import { getPostAuthPath } from "@/lib/auth/redirect";
import { setupStarterProfile, isValidBirthCountry } from "@/lib/auth/setup-profile";
import {
  formatUsernameError,
  isUsernameTaken,
  normalizeUsername,
  validateUsername,
} from "@/lib/auth/username";

export type AuthActionState = {
  error?: string;
  success?: string;
};

function formatAuthError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";

  if (
    message.includes("profiles") &&
    (message.includes("schema cache") || message.includes("does not exist"))
  ) {
    return "La base Supabase n'est pas initialisée. Ouvre Supabase → SQL Editor, exécute le fichier supabase/schema.sql, puis réessaie.";
  }

  if (
    message.includes("username") &&
    (message.includes("schema cache") || message.includes("does not exist"))
  ) {
    return "La colonne pseudo n'existe pas encore. Exécute la migration dans supabase/schema.sql, puis réessaie.";
  }

  if (
    message.includes("visited_countries") &&
    (message.includes("schema cache") || message.includes("does not exist"))
  ) {
    return "La base Supabase n'est pas initialisée. Ouvre Supabase → SQL Editor, exécute le fichier supabase/schema.sql, puis réessaie.";
  }

  return formatUsernameError(message) || message || "Impossible de finaliser le profil.";
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase n'est pas configuré sur ce projet." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const username = normalizeUsername(String(formData.get("username") ?? ""));

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  const usernameError = validateUsername(username);
  if (usernameError) {
    return { error: usernameError };
  }

  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }

  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  const supabase = await createClient();

  try {
    if (await isUsernameTaken(supabase, username)) {
      return { error: "Ce pseudo est déjà pris." };
    }
  } catch (error) {
    return { error: formatAuthError(error) };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
      data: { username },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/onboarding");
  }

  return {
    success:
      "Compte créé ! Vérifie ta boîte mail pour confirmer ton inscription, puis choisis ton pays d'origine.",
  };
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase n'est pas configuré sur ce projet." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(await getPostAuthPath(supabase));
}

export async function signInWithGoogle(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=supabase");
  }

  const mode = String(formData.get("mode") ?? "login");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    const target = mode === "signup" ? "/signup" : "/login";
    redirect(`${target}?error=google`);
  }

  if (data.url) {
    redirect(data.url);
  }

  redirect("/login?error=google");
}

export async function checkOnboardingUsername(
  input: string,
): Promise<{ error?: string; username?: string }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase n'est pas configuré." };
  }

  const username = normalizeUsername(input);
  const usernameError = validateUsername(username);

  if (usernameError) {
    return { error: usernameError };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Session expirée. Reconnecte-toi." };
  }

  try {
    if (await isUsernameTaken(supabase, username, user.id)) {
      return { error: "Ce pseudo est déjà pris." };
    }
  } catch (error) {
    return { error: formatAuthError(error) };
  }

  return { username };
}

export async function completeOnboarding(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase n'est pas configuré." };
  }

  const birthCountryCode = String(formData.get("birthCountryCode") ?? "")
    .trim()
    .toUpperCase();
  const username = normalizeUsername(String(formData.get("username") ?? ""));

  if (!birthCountryCode) {
    return { error: "Choisis ton pays de naissance." };
  }

  if (!isValidBirthCountry(birthCountryCode)) {
    return { error: "Pays de naissance invalide." };
  }

  const usernameError = validateUsername(username);
  if (usernameError) {
    return { error: usernameError };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  try {
    if (await isUsernameTaken(supabase, username, user.id)) {
      return { error: "Ce pseudo est déjà pris." };
    }

    await setupStarterProfile(supabase, user.id, birthCountryCode, username);
  } catch (error) {
    return { error: formatAuthError(error) };
  }

  revalidatePath("/", "layout");
  return { success: "done" };
}

export async function signOut() {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
