"use client";

import Link from "next/link";
import type { Country } from "@/lib/types";
import { formatDexId } from "@/data/countries";
import { useVisited } from "@/lib/visited-context";
import { FlagCircle } from "./FlagCircle";
import { TypeBadge } from "./TypeBadge";

type CountryCardProps = {
  country: Country;
};

export function CountryCard({ country }: CountryCardProps) {
  const { isVisited, isStarter, hydrated } = useVisited();
  const captured = hydrated && isVisited(country.code);
  const starter = isStarter(country.code);
  const dexId = formatDexId(country.code);

  return (
    <Link href={`/country/${country.code.toLowerCase()}`} className="group block h-full">
      <article
        className={`dex-entry h-full ${captured ? "dex-entry-captured" : "dex-entry-unknown"} ${
          starter ? "dex-entry-starter" : ""
        }`}
      >
        <div className="dex-entry-top">
          <div className={`dex-entry-flag ${captured ? "" : "dex-entry-flag-muted"}`}>
            <FlagCircle code={country.code} name={country.name} size="md" />
          </div>

          <div className="dex-entry-meta min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              {captured ? (
                <h3 className="truncate font-bold text-dex-cream group-hover:text-white">
                  {country.name}
                </h3>
              ) : (
                <h3 className="font-bold tracking-wide text-dex-muted">???</h3>
              )}
              <span className="dex-entry-id shrink-0">
                {captured ? `#${country.code}` : `#${dexId}`}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-dex-muted">
              {captured ? country.region : "Région inconnue"}
            </p>
          </div>
        </div>

        <div className="dex-entry-types">
          {captured ? (
            country.types.slice(0, 2).map((type) => <TypeBadge key={type} type={type} />)
          ) : (
            country.types.slice(0, 2).map((type) => (
              <span key={type} className="dex-entry-type-placeholder">
                {type}
              </span>
            ))
          )}
        </div>

        {!captured && (
          <div className="dex-entry-veil" aria-hidden>
            <span className="dex-entry-veil-label">Non découvert</span>
          </div>
        )}
      </article>
    </Link>
  );
}
