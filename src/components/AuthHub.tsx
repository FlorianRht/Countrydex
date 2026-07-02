import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function AuthHub() {
  const configured = isSupabaseConfigured();

  return (
    <main className="flex min-h-screen flex-col px-6 py-16">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
        <p className="text-sm text-dex-muted">Countrydex</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-dex-cream">
          Ton atlas des pays visités
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-dex-muted">
          Inscris-toi, choisis ton pays d&apos;origine, puis pars à la conquête du monde.
          Chaque territoire visité rejoint ton Countrydex.
        </p>

        {!configured && (
          <p className="mt-6 text-sm text-dex-muted">
            Configuration Supabase requise pour activer les comptes.
          </p>
        )}

        <div className="mt-10 flex flex-col gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-dex-cream px-4 py-2.5 text-center text-sm font-medium text-dex-bg transition-opacity hover:opacity-90"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border border-dex-border px-4 py-2.5 text-center text-sm font-medium text-dex-cream transition-colors hover:border-dex-muted"
          >
            Créer un compte
          </Link>
        </div>
      </div>

      <p className="mx-auto mt-auto w-full max-w-sm text-xs text-dex-muted/70">
        Après inscription, tu choisiras ton pays d&apos;origine pour démarrer l&apos;exploration.
      </p>
    </main>
  );
}
