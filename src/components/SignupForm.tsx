"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp, type AuthActionState } from "@/app/actions/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { AuthDivider } from "./AuthDivider";

const initialState: AuthActionState = {};

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  if (!isSupabaseConfigured()) {
    return (
      <p className="rounded-xl border border-dex-border bg-dex-panel-dark p-4 text-sm text-dex-muted">
        Les comptes nécessitent Supabase. Ajoute tes variables d&apos;environnement puis
        exécute <code className="text-dex-cream">supabase/schema.sql</code>.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <GoogleAuthButton mode="signup" />

      <AuthDivider />

      <form action={formAction} className="space-y-4">
        {state.error && (
          <p className="rounded-xl border border-red-800/50 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {state.error}
          </p>
        )}
        {state.success && (
          <p className="rounded-xl border border-dex-green/30 bg-emerald-950/30 px-4 py-3 text-sm text-dex-green">
            {state.success}
          </p>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-dex-cream">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="dex-input"
            placeholder="toi@exemple.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-dex-cream">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="dex-input"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-dex-cream"
          >
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="dex-input"
          />
        </div>

        <button type="submit" disabled={pending} className="dex-button w-full">
          {pending ? "Création..." : "Créer mon compte avec email"}
        </button>

        <p className="text-center text-sm text-dex-muted">
          Déjà un compte ?{" "}
          <Link href="/login" className="font-semibold text-dex-red-light hover:underline">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}
