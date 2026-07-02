"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type AuthActionState } from "@/app/actions/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { AuthDivider } from "./AuthDivider";

const initialState: AuthActionState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  if (!isSupabaseConfigured()) {
    return (
      <p className="rounded-xl border border-dex-border bg-dex-panel-dark p-4 text-sm text-dex-muted">
        Supabase n&apos;est pas configuré. Consulte le fichier{" "}
        <code className="text-dex-cream">supabase/schema.sql</code> et ajoute tes
        variables d&apos;environnement.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <GoogleAuthButton mode="login" />

      <AuthDivider />

      <form action={formAction} className="space-y-4">
        {state.error && (
          <p className="rounded-xl border border-red-800/50 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {state.error}
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
            autoComplete="current-password"
            className="dex-input"
          />
        </div>

        <button type="submit" disabled={pending} className="dex-button w-full">
          {pending ? "Connexion..." : "Se connecter avec email"}
        </button>

        <p className="text-center text-sm text-dex-muted">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="font-semibold text-dex-red-light hover:underline">
            Créer un compte
          </Link>
        </p>
      </form>
    </div>
  );
}
