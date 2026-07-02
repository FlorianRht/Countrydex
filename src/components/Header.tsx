"use client";

import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { useAuth } from "@/lib/auth-context";
import { countries } from "@/data/countries";
import { getCountryByCode } from "@/lib/country-utils";

export function Header() {
  const { user, birthCountryCode } = useAuth();

  const starterName = birthCountryCode
    ? getCountryByCode(countries, birthCountryCode)?.name
    : null;

  return (
    <header className="dex-device-header mb-8 rounded-2xl px-6 py-5">
      <div className="flex w-full flex-wrap items-center gap-4">
        <Link href="/dex" className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl">
            🌍
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-dex-cream/60">
              Pokédex du voyageur
            </p>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Country<span className="text-dex-cream/80">dex</span>
            </h1>
          </div>
        </Link>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          {starterName && (
            <span className="hidden rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-200 sm:inline">
              Origine : {starterName}
            </span>
          )}
          <span className="max-w-[180px] truncate text-sm text-dex-cream/80">
            {user?.email}
          </span>
          <form action={signOut}>
            <button type="submit" className="dex-button dex-button-outline !px-4 !py-2 text-xs">
              Déconnexion
            </button>
          </form>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="h-3 w-3 rounded-full bg-dex-red-light shadow-[0_0_8px_#ff6b7a]" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
            <span className="h-3 w-3 rounded-full bg-dex-green/80" />
          </div>
        </div>
      </div>
    </header>
  );
}
