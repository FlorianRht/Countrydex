"use client";

import { countries } from "@/data/countries";
import { getCountryLabel, isCountryInDex } from "@/lib/country-utils";
import type { Country } from "@/lib/types";
import { FlagCircle } from "./FlagCircle";

type CountryNeighborsProps = {
  country: Country;
  onSelect?: (code: string) => void;
  /** Affichage compact : drapeaux en ligne sous la carte. */
  compact?: boolean;
};

export function CountryNeighbors({
  country,
  onSelect,
  compact = false,
}: CountryNeighborsProps) {
  const neighbors = country.neighbors.filter(
    (code) => code.toUpperCase() !== country.code.toUpperCase(),
  );

  if (neighbors.length === 0) return null;

  return (
    <div
      className={`explore-neighbors ${compact ? "explore-neighbors-compact" : ""}`.trim()}
    >
      <p className="explore-neighbors-label">Frontaliers</p>
      <ul className="explore-neighbors-list">
        {neighbors.map((code) => {
          const inDex = isCountryInDex(countries, code);
          const name = getCountryLabel(countries, code);

          return (
            <li key={code}>
              <button
                type="button"
                className={`explore-neighbor-flag ${inDex ? "explore-neighbor-flag-dex" : ""}`}
                onClick={() => inDex && onSelect?.(code)}
                disabled={!inDex || !onSelect}
                aria-label={name}
              >
                <FlagCircle code={code} name={name} size={compact ? "xs" : "sm"} />
                <span className="explore-neighbor-tooltip" role="tooltip">
                  {name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
