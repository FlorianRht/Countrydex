"use client";

import { useActionState, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { countries } from "@/data/countries";
import { getFlagUrl } from "@/lib/country-utils";
import { partirDePays } from "@/lib/french";
import type { Country } from "@/lib/types";
import { completeOnboarding, signOut, type AuthActionState } from "@/app/actions/auth";
import { FlagCircle } from "./FlagCircle";
import { CountryMap } from "./CountryMap";
import { CountryNeighbors } from "./CountryNeighbors";
import { CountryQuickFacts } from "./CountryQuickFacts";
import { CountryWorldMap } from "./CountryWorldMap";
import { TypeBadge } from "./TypeBadge";
import { StatBars } from "./StatBars";

const sortedCountries = [...countries].sort((a, b) =>
  a.name.localeCompare(b.name, "fr"),
);

const REGIONS = ["Tous", ...Array.from(new Set(countries.map((c) => c.region))).sort()];

const initialState: AuthActionState = {};

const REGION_GLOW: Record<string, string> = {
  Europe: "rgba(96, 165, 250, 0.35)",
  Asie: "rgba(244, 114, 182, 0.35)",
  Amérique: "rgba(74, 222, 128, 0.35)",
  Afrique: "rgba(251, 191, 36, 0.35)",
  Océanie: "rgba(34, 211, 238, 0.35)",
};

const PREVIEW_EASE = [0.22, 1, 0.36, 1] as const;

const CROSSFADE = { duration: 0.26, ease: PREVIEW_EASE } as const;

function CrossfadeLayer({
  className = "",
  children,
  inset = false,
}: {
  className?: string;
  children: ReactNode;
  inset?: boolean;
}) {
  const isPresent = useIsPresent();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: inset ? 0.985 : 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: inset ? 1.01 : 1 }}
      transition={CROSSFADE}
      style={
        inset
          ? {
              position: "absolute",
              inset: 0,
              width: "100%",
              zIndex: isPresent ? 2 : 1,
            }
          : {
              position: isPresent ? "relative" : "absolute",
              inset: isPresent ? undefined : 0,
              width: "100%",
              zIndex: isPresent ? 2 : 1,
            }
      }
    >
      {children}
    </motion.div>
  );
}

function CrossfadeSlot({
  slotKey,
  className = "",
  layerClassName = "",
  inset = false,
  children,
}: {
  slotKey: string;
  className?: string;
  layerClassName?: string;
  inset?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`explore-crossfade-slot ${className}`.trim()}>
      <AnimatePresence initial={false}>
        <CrossfadeLayer key={slotKey} className={layerClassName} inset={inset}>
          {children}
        </CrossfadeLayer>
      </AnimatePresence>
    </div>
  );
}

export function StarterPicker() {
  const [state, formAction, pending] = useActionState(completeOnboarding, initialState);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("Tous");
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sortedCountries.filter((c) => {
      if (region !== "Tous" && c.region !== region) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
      );
    });
  }, [search, region]);

  const activeCode = useMemo(() => {
    if (selectedCode && filtered.some((c) => c.code === selectedCode)) {
      return selectedCode;
    }
    if (filtered.length === 1) {
      return filtered[0].code;
    }
    if (!search.trim()) {
      return filtered[0]?.code ?? null;
    }
    return null;
  }, [selectedCode, filtered, search]);

  const selected = useMemo(
    () => (activeCode ? sortedCountries.find((c) => c.code === activeCode) ?? null : null),
    [activeCode],
  );

  const handleSelectCountry = (code: string) => {
    setSelectedCode(code);
  };

  useEffect(() => {
    if (!mobileDetailsOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileDetailsOpen]);

  useEffect(() => {
    if (!selectedCode) return;
    if (!filtered.some((c) => c.code === selectedCode)) return;

    const frame = requestAnimationFrame(() => {
      document
        .querySelector(`[data-country-code="${selectedCode}"]`)
        ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });

    return () => cancelAnimationFrame(frame);
  }, [selectedCode, filtered]);

  return (
    <div className="explore-origin">
      <div className="explore-grid-bg" aria-hidden />
      <div className="explore-horizon" aria-hidden />

      <div className="relative flex w-full flex-col px-5 py-5 sm:px-8 lg:px-10 lg:py-6 xl:h-full xl:overflow-hidden">
        <header className="explore-header shrink-0">
          <div className="explore-header-main">
            <div className="min-w-0">
              <p className="explore-header-eyebrow">Nouvel explorateur</p>
              <h1 className="explore-header-title">D&apos;où commences-tu ton voyage ?</h1>
              <p className="explore-header-lead">
                Choisis ton pays d&apos;origine — le point de départ de ton Countrydex mondial.
              </p>
            </div>
          </div>

          <div className="explore-header-actions">
            <form action={signOut}>
              <button type="submit" className="explore-header-signout">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Déconnexion
              </button>
            </form>
          </div>
        </header>

        <div className="explore-layout mt-4 lg:mt-5 xl:min-h-0 xl:flex-1">
          <section className="explore-preview-panel hidden min-h-[320px] xl:block xl:h-full xl:min-h-0 xl:overflow-hidden">
            {selected ? (
              <OriginPreview
                country={selected}
                onSelectNeighbor={handleSelectCountry}
              />
            ) : (
              <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-dex-border/60 bg-dex-panel/20 p-6 text-center">
                <p className="text-sm text-dex-muted">
                  {search.trim()
                    ? "Sélectionne un pays dans la liste pour voir sa fiche."
                    : "Aucun pays disponible."}
                </p>
              </div>
            )}
          </section>

          <section className="explore-picker-panel flex flex-col rounded-2xl border border-dex-border/80 bg-dex-panel/40 backdrop-blur-md xl:h-full xl:min-h-0 xl:overflow-hidden">
            <div className="shrink-0 border-b border-dex-border/60 p-3 sm:p-4">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un pays..."
                className="dex-input"
                autoComplete="off"
              />
              <div className="explore-region-scroll mt-3">
                <div className="explore-region-track">
                  {REGIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRegion(r)}
                      className={`explore-region-pill shrink-0 ${region === r ? "explore-region-pill-active" : ""}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="explore-country-grid explore-country-grid-scroll p-3 xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
              {filtered.map((country) => {
                const isSelected = activeCode === country.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    data-country-code={country.code}
                    onClick={() => handleSelectCountry(country.code)}
                    className={`explore-country-tile ${isSelected ? "explore-country-tile-active" : ""}`}
                  >
                    <span className="explore-country-tile-flag">
                      <span className="explore-country-tile-flag-wrap">
                        <FlagCircle code={country.code} name={country.name} size="lg" />
                        {isSelected && <span className="explore-tile-shine" aria-hidden />}
                      </span>
                    </span>
                    <span className="explore-country-tile-name">{country.name}</span>
                    <span className="explore-country-tile-region">{country.region}</span>
                  </button>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <p className="p-8 text-center text-sm text-dex-muted">Aucun pays trouvé.</p>
            )}

            <div className="explore-picker-footer hidden shrink-0 border-t border-dex-border/60 p-3 sm:p-4 xl:block">
              <p className="mb-3 text-center text-xs text-dex-muted">
                {filtered.length} pays affichés · {sortedCountries.length} disponibles dans le dex
              </p>
              <form action={formAction}>
                {state.error && (
                  <p className="mb-3 rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-200">
                    {state.error}
                  </p>
                )}
                <input type="hidden" name="birthCountryCode" value={activeCode ?? ""} />
                <button
                  type="submit"
                  disabled={pending || !activeCode}
                  className="explore-confirm w-full"
                >
                  {pending
                    ? "Ouverture du Countrydex..."
                    : selected
                      ? partirDePays(selected.name, selected.code)
                      : "Sélectionne ton pays d'origine"}
                </button>
              </form>
            </div>
          </section>
        </div>

        {selected && (
          <div className="explore-mobile-dock flex flex-col xl:hidden">
            <button
              type="button"
              className="explore-mobile-dock-preview"
              onClick={() => setMobileDetailsOpen(true)}
              aria-expanded={mobileDetailsOpen}
              aria-label={`Voir la fiche de ${selected.name}`}
            >
              <FlagCircle code={selected.code} name={selected.name} size="sm" />
              <span className="explore-mobile-dock-text min-w-0">
                <span className="explore-mobile-dock-name">{selected.name}</span>
                <span className="explore-mobile-dock-meta">
                  {selected.region} · #{selected.code}
                </span>
              </span>
              <span className="explore-mobile-dock-chevron" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
                  <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>

            <form action={formAction} className="explore-mobile-dock-form">
              {state.error && (
                <p className="mb-2 rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-200">
                  {state.error}
                </p>
              )}
              <input type="hidden" name="birthCountryCode" value={activeCode ?? ""} />
              <button
                type="submit"
                disabled={pending || !activeCode}
                className="explore-confirm explore-mobile-confirm w-full"
              >
                {pending ? "Ouverture..." : partirDePays(selected.name, selected.code)}
              </button>
            </form>
          </div>
        )}

        <AnimatePresence>
          {mobileDetailsOpen && selected && (
            <div className="explore-mobile-sheet-root xl:hidden">
              <motion.button
                type="button"
                className="explore-mobile-sheet-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                aria-label="Fermer la fiche pays"
                onClick={() => setMobileDetailsOpen(false)}
              />
              <motion.div
                className="explore-mobile-sheet"
                role="dialog"
                aria-modal="true"
                aria-label={`Fiche pays — ${selected.name}`}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.32, ease: PREVIEW_EASE }}
              >
                <div className="explore-mobile-sheet-handle" aria-hidden />
                <div className="explore-mobile-sheet-header">
                  <p className="explore-mobile-sheet-title">Fiche pays</p>
                  <button
                    type="button"
                    className="explore-mobile-sheet-close"
                    onClick={() => setMobileDetailsOpen(false)}
                  >
                    Fermer
                  </button>
                </div>
                <div className="explore-mobile-sheet-body">
                  <OriginPreview
                    country={selected}
                    onSelectNeighbor={(code) => {
                      handleSelectCountry(code);
                    }}
                    mobile
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function OriginPreview({
  country,
  onSelectNeighbor,
  mobile = false,
}: {
  country: Country;
  onSelectNeighbor?: (code: string) => void;
  mobile?: boolean;
}) {
  const glow = REGION_GLOW[country.region] ?? "rgba(148, 163, 184, 0.3)";

  return (
    <article
      className={`explore-preview relative flex flex-col overflow-hidden rounded-2xl border border-dex-border/70 ${mobile ? "explore-preview-mobile" : "h-full xl:min-h-0"}`}
    >
      <motion.div
        className="explore-preview-glow"
        animate={{ opacity: 1 }}
        transition={CROSSFADE}
        style={{ background: `radial-gradient(circle at 30% 20%, ${glow}, transparent 55%)` }}
        aria-hidden
      />

      <div className="explore-preview-grid relative xl:min-h-0 xl:flex-1">
        <div className="explore-preview-hero">
          <div className="explore-flag-frame relative w-full">
            <CrossfadeSlot
              slotKey={country.code}
              className={mobile ? "aspect-[2/1] w-full" : "aspect-[5/3] w-full"}
              layerClassName="explore-flag-reveal h-full overflow-hidden rounded-xl shadow-2xl"
              inset
            >
              <img
                src={getFlagUrl(country.code)}
                alt={`Drapeau ${country.name}`}
                className="absolute inset-0 h-full w-full object-cover"
                fetchPriority="high"
                decoding="async"
              />
              <motion.span
                className="explore-flag-scan"
                initial={{ x: "-120%" }}
                animate={{ x: "220%" }}
                transition={{ duration: 0.65, ease: "easeInOut", delay: 0.08 }}
                aria-hidden
              />
            </CrossfadeSlot>
            <div className="explore-flag-reflection" aria-hidden />
          </div>

          <CrossfadeSlot slotKey={country.code} className="mt-4 min-h-[6.5rem]" layerClassName="mt-0">
            <p className="font-mono text-xs tracking-widest text-sky-400/90">
              PAYS D&apos;ORIGINE · #{country.code}
            </p>
            <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {country.name}
            </h2>
            <p className="mt-1.5 text-sm text-dex-muted">{country.region}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {country.types.map((type) => (
                <TypeBadge key={type} type={type} size="md" />
              ))}
            </div>
          </CrossfadeSlot>

          {!mobile && (
            <CountryMap
              code={country.code}
              name={country.name}
              fill
              className="mt-5 min-h-0 flex-1"
            />
          )}
        </div>

        <CrossfadeSlot
          slotKey={country.code}
          className={mobile ? "explore-dossier-crossfade-mobile" : "explore-dossier-crossfade min-h-0 xl:flex-1"}
          layerClassName="explore-preview-dossier"
          inset={!mobile}
        >
          <section className="explore-preview-section">
            <h3 className="explore-preview-section-title">Description</h3>
            <p className="explore-preview-description">{country.description}</p>
            <CountryQuickFacts country={country} />
          </section>

          <section className="explore-preview-section explore-preview-section-map">
            <div className="explore-map-row">
              <CountryWorldMap code={country.code} name={country.name} />
              <CountryNeighbors
                country={country}
                onSelect={onSelectNeighbor}
                compact
              />
            </div>
          </section>

          <section className="explore-preview-section explore-preview-metrics">
            <h3 className="explore-preview-section-title">Indicateurs</h3>
            <div className="explore-preview-facts">
              <div className="explore-preview-fact">
                <p className="explore-preview-fact-label">Superficie</p>
                <p className="explore-preview-fact-value">{country.superficie}</p>
              </div>
              <div className="explore-preview-fact">
                <p className="explore-preview-fact-label">Population</p>
                <p className="explore-preview-fact-value">{country.population}</p>
              </div>
            </div>
            <StatBars key={country.code} stats={country.stats} compact tone="explore" />
          </section>
        </CrossfadeSlot>
      </div>
    </article>
  );
}
