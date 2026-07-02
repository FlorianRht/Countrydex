"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { countries } from "@/data/countries";
import { getCountryByCode } from "@/lib/country-utils";
import { FlagCircle } from "./FlagCircle";

export function Header() {
  const router = useRouter();
  const { user, username, birthCountryCode, signOut } = useAuth();

  const starter = birthCountryCode
    ? getCountryByCode(countries, birthCountryCode)
    : null;

  const handleSignOut = () => {
    void signOut().then(() => {
      router.replace("/");
      router.refresh();
    });
  };

  return (
    <header className="dex-device-header dex-page-header">
      <div className="dex-page-header-inner">
        <Link href="/dex" className="dex-page-brand group">
          <div className="dex-page-brand-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.75">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.5 2.8 4 6 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6-4 9s1.5 6.2 4 9" strokeLinecap="round" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="dex-page-brand-eyebrow">Pokédex du voyageur</p>
            <h1 className="dex-page-brand-title">
              Country<span className="text-dex-cream/75">dex</span>
            </h1>
          </div>
        </Link>

        <div className="dex-page-account">
          {starter && birthCountryCode && (
            <div
              className="dex-page-starter"
              title={`Pays de départ : ${starter.name}`}
            >
              <FlagCircle code={birthCountryCode} name={starter.name} size="xs" />
              <span className="dex-page-starter-name">{starter.name}</span>
            </div>
          )}

          <div className="dex-page-user">
            <span className="dex-page-user-label">Explorateur</span>
            <span className="dex-page-user-email" title={user?.email ?? undefined}>
              {username ?? user?.email}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="dex-page-signout"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Déconnexion</span>
          </button>

          <div className="dex-page-lights hidden sm:flex" aria-hidden>
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </header>
  );
}
