"use client";

import { useMemo, useState } from "react";
import { countries } from "@/data/countries";
import type { CountryType } from "@/lib/types";
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

  return (
    <div className="space-y-6">
      <section className="dex-panel rounded-2xl p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-dex-red-light">
              Collection
            </p>
            <h2 className="mt-1 text-3xl font-bold text-dex-cream">
              {visitedCount}
              <span className="text-dex-muted"> / {countries.length}</span>
            </h2>
            <p className="mt-1 text-sm text-dex-muted">pays explorés</p>
          </div>
          <div className="w-full sm:max-w-xs">
            <div className="mb-1 flex justify-between text-xs font-medium text-dex-muted">
              <span>Progression</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-dex-panel-dark">
              <div
                className="h-full rounded-full bg-gradient-to-r from-dex-green to-emerald-300 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="dex-panel rounded-2xl p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <input
            type="search"
            placeholder="Rechercher un pays..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dex-input flex-1"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as CountryType | "all")}
            className="dex-input lg:max-w-[200px]"
          >
            <option value="all">Tous les types</option>
            {ALL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as FilterMode)}
            className="dex-input lg:max-w-[200px]"
          >
            <option value="all">Tous</option>
            <option value="visited">Explorés</option>
            <option value="missing">À découvrir</option>
          </select>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="dex-panel rounded-2xl p-10 text-center text-dex-muted">
          Aucun pays ne correspond à ta recherche.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((country, index) => (
            <CountryCard key={country.code} country={country} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
