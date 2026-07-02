"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl, isSupabaseConfigured } from "@/lib/supabase/config";
import { getPostAuthPath } from "@/lib/auth/redirect";
import { setupStarterProfile, isValidBirthCountry } from "@/lib/auth/setup-profile";

export type AuthActionState = {
  error?: string;
  success?: string;
};

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

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }

  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
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

  if (!birthCountryCode) {
    return { error: "Choisis ton pays de naissance." };
  }

  if (!isValidBirthCountry(birthCountryCode)) {
    return { error: "Pays de naissance invalide." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  try {
    await setupStarterProfile(supabase, user.id, birthCountryCode);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Impossible de finaliser le profil.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dex");
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
