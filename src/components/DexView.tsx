"use client";

import { useMemo, useState } from "react";
import { countries } from "@/data/countries";
import type { CountryType } from "@/lib/types";
import { TYPE_COLORS } from "@/lib/country-utils";
import { useVisited } from "@/lib/visited-context";
import { CountryCard } from "./CountryCard";

type FilterMode = "all" | "visited" | "missing";

const ALL_TYPES: CountryType[] = [
  "Montagne",
  "Plage",
  "Urbain",
  "Historique",
  "Nature",
  "Désert",
  "Insulaire",
  "Gastronomie",
];

const MODE_OPTIONS: { value: FilterMode; label: string; hint: string }[] = [
  { value: "all", label: "Tous", hint: "Collection complète" },
  { value: "visited", label: "Explorés", hint: "Territoires capturés" },
  { value: "missing", label: "À découvrir", hint: "Encore inconnus" },
];

function ProgressRing({ progress }: { progress: number }) {
  const size = 92;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="dex-progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          className="dex-progress-ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          className="dex-progress-ring-fg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="dex-progress-ring-center">
        <span className="dex-progress-ring-value">{progress}%</span>
        <span className="dex-progress-ring-label">Progression</span>
      </div>
    </div>
  );
}

export function DexView() {
  const { isVisited, hydrated, visitedCount } = useVisited();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<CountryType | "all">("all");
  const [mode, setMode] = useState<FilterMode>("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return countries.filter((country) => {
      const visited = hydrated && isVisited(country.code);

      if (mode === "visited" && !visited) return false;
      if (mode === "missing" && visited) return false;
      if (typeFilter !== "all" && !country.types.includes(typeFilter)) return false;
      if (!query) return true;

      return (
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query) ||
        country.region.toLowerCase().includes(query)
      );
    });
  }, [search, typeFilter, mode, isVisited, hydrated]);

  const progress = Math.round((visitedCount / countries.length) * 100);
  const remaining = countries.length - visitedCount;
  const hasActiveFilters = search.trim() !== "" || typeFilter !== "all" || mode !== "all";

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setMode("all");
  };

  return (
    <div className="dex-view">
      <section className="dex-console" aria-label="Tableau de bord du Countrydex">
        <div className="dex-console-stats">
          <ProgressRing progress={progress} />

          <div className="dex-console-summary">
            <p className="dex-console-eyebrow">Collection mondiale</p>
            <p className="dex-console-count">
              <span className="dex-console-count-main">{visitedCount}</span>
              <span className="dex-console-count-total">/ {countries.length}</span>
            </p>
            <p className="dex-console-subline">
              {remaining > 0
                ? `${remaining} territoire${remaining > 1 ? "s" : ""} encore à explorer`
                : "Tous les territoires sont répertoriés !"}
            </p>
          </div>

          <div className="dex-console-metrics">
            <div className="dex-metric dex-metric-success">
              <span className="dex-metric-value">{visitedCount}</span>
              <span className="dex-metric-label">Explorés</span>
            </div>
            <div className="dex-metric">
              <span className="dex-metric-value">{remaining}</span>
              <span className="dex-metric-label">Restants</span>
            </div>
            <div className="dex-metric">
              <span className="dex-metric-value">{countries.length}</span>
              <span className="dex-metric-label">Total</span>
            </div>
          </div>
        </div>

        <div className="dex-console-divider" aria-hidden />

        <div className="dex-console-filters">
          <div className="dex-search-wrap">
            <svg
              className="dex-search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Rechercher un pays, une région ou un code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="dex-input dex-search-input"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="dex-search-clear"
                aria-label="Effacer la recherche"
              >
                ×
              </button>
            )}
          </div>

          <div className="dex-console-filter-block">
            <div className="dex-console-filter-head">
              <p className="dex-console-filter-title">Types de territoire</p>
              {typeFilter !== "all" && (
                <button
                  type="button"
                  onClick={() => setTypeFilter("all")}
                  className="dex-console-filter-reset"
                >
                  Tous les types
                </button>
              )}
            </div>
            <div className="dex-type-scroll">
              <button
                type="button"
                onClick={() => setTypeFilter("all")}
                className={`dex-type-chip ${typeFilter === "all" ? "dex-type-chip-active" : ""}`}
              >
                Tous
              </button>
              {ALL_TYPES.map((type) => {
                const colors = TYPE_COLORS[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTypeFilter(typeFilter === type ? "all" : type)}
                    className={`dex-type-chip ${colors.bg} ${colors.text} ${colors.border} ${
                      typeFilter === type ? "dex-type-chip-active" : ""
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="dex-console-filter-row">
            <div className="dex-filter-pills" role="tablist" aria-label="Filtrer la collection">
              {MODE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="tab"
                  aria-selected={mode === option.value}
                  title={option.hint}
                  onClick={() => setMode(option.value)}
                  className={`dex-filter-pill ${mode === option.value ? "dex-filter-pill-active" : ""}`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="dex-console-filter-meta">
              <p className="dex-console-result-count">
                {filtered.length} pays affiché{filtered.length > 1 ? "s" : ""}
              </p>
              {hasActiveFilters && (
                <button type="button" onClick={resetFilters} className="dex-console-filter-reset">
                  Réinitialiser
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="dex-panel dex-empty-state rounded-2xl p-10 text-center">
          <p className="text-base font-semibold text-dex-cream">Aucun territoire trouvé</p>
          <p className="mt-2 text-sm text-dex-muted">
            Essaie un autre mot-clé ou élargis tes filtres.
          </p>
          {hasActiveFilters && (
            <button type="button" onClick={resetFilters} className="dex-button mt-5">
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="dex-grid grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((country) => (
            <CountryCard key={country.code} country={country} />
          ))}
        </div>
      )}
    </div>
  );
}
