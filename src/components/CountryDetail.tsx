"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Country } from "@/lib/types";
import { getFlagUrl } from "@/lib/country-utils";
import { useVisited } from "@/lib/visited-context";
import { StatBars } from "./StatBars";
import { TypeBadge } from "./TypeBadge";

type CountryDetailProps = {
  country: Country;
};

export function CountryDetail({ country }: CountryDetailProps) {
  const { isVisited, isStarter, toggleVisited, getVisitDate, hydrated } = useVisited();
  const captured = hydrated && isVisited(country.code);
  const starter = isStarter(country.code);
  const visitDate = getVisitDate(country.code);

  return (
    <div className="space-y-6">
      <Link
        href="/dex"
        className="inline-flex items-center gap-2 text-sm font-medium text-dex-muted transition-colors hover:text-dex-cream"
      >
        ← Retour au Countrydex
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dex-device overflow-hidden rounded-3xl"
      >
        <div className="dex-device-header flex flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-dex-cream/70">
              Fiche pays
            </p>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{country.name}</h1>
          </div>
          <span className="rounded-lg bg-black/20 px-3 py-1 font-mono text-sm text-dex-cream">
            #{country.code}
          </span>
          {starter && (
            <span className="rounded-lg border border-yellow-500/50 bg-yellow-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-yellow-200">
              Origine
            </span>
          )}
        </div>

        <div className="grid gap-0 lg:grid-cols-2">
          <div className="dex-screen relative flex min-h-[280px] items-center justify-center p-8">
            <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl border-4 border-dex-border shadow-inner">
              <img
                src={getFlagUrl(country.code)}
                alt={`Drapeau ${country.name}`}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${captured ? "" : "grayscale brightness-50"}`}
                fetchPriority="high"
                decoding="async"
              />
            </div>
            {!captured && (
              <div className="absolute bottom-6 rounded-full bg-black/50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-dex-muted">
                Silhouette inconnue
              </div>
            )}
          </div>

          <div className="space-y-5 bg-dex-panel p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-dex-muted">
                Région
              </p>
              <p className="text-lg font-semibold text-dex-cream">{country.region}</p>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-dex-muted">
                Types
              </p>
              <div className="flex flex-wrap gap-2">
                {country.types.map((type) => (
                  <TypeBadge key={type} type={type} size="md" />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-dex-panel-dark p-3">
                <p className="text-xs uppercase tracking-widest text-dex-muted">Superficie</p>
                <p className="mt-1 font-mono text-sm font-semibold text-dex-cream">
                  {country.superficie}
                </p>
              </div>
              <div className="rounded-xl bg-dex-panel-dark p-3">
                <p className="text-xs uppercase tracking-widest text-dex-muted">Population</p>
                <p className="mt-1 font-mono text-sm font-semibold text-dex-cream">
                  {country.population}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-dex-muted">
                Statistiques
              </p>
              <StatBars stats={country.stats} />
            </div>
          </div>
        </div>

        <div className="border-t border-dex-border bg-dex-panel-dark p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-dex-red-light">
            Entrée du Countrydex
          </p>
          <p className="leading-relaxed text-dex-cream/90">{country.description}</p>
        </div>

        <div className="flex flex-col gap-3 border-t border-dex-border bg-dex-bg p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {captured && visitDate ? (
              <p className="text-sm text-dex-green">
                {starter ? "Pays d'origine enregistré" : "Capturé"} le{" "}
                <time dateTime={visitDate}>
                  {new Date(visitDate).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </p>
            ) : (
              <p className="text-sm text-dex-muted">
                Marque ce pays comme visité pour l&apos;ajouter à ta collection.
              </p>
            )}
            {starter && (
              <p className="mt-1 text-xs text-yellow-200/80">
                Ton pays d&apos;origine ne peut pas être retiré de la collection.
              </p>
            )}
          </div>
          {!starter && (
            <button
              type="button"
              onClick={() => void toggleVisited(country.code)}
              className={`dex-button ${captured ? "dex-button-outline" : ""}`}
            >
              {captured ? "Retirer de la collection" : "Capturer ce pays"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
