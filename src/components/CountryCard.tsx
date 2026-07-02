"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Country } from "@/lib/types";
import { useVisited } from "@/lib/visited-context";
import { FlagCircle } from "./FlagCircle";
import { TypeBadge } from "./TypeBadge";

type CountryCardProps = {
  country: Country;
  index: number;
};

export function CountryCard({ country, index }: CountryCardProps) {
  const { isVisited, isStarter, hydrated } = useVisited();
  const captured = hydrated && isVisited(country.code);
  const starter = isStarter(country.code);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
    >
      <Link href={`/country/${country.code.toLowerCase()}`} className="group block">
        <article
          className={`dex-card relative overflow-hidden p-4 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg ${
            captured
              ? starter
                ? "ring-2 ring-yellow-500/70"
                : "ring-2 ring-dex-green/60"
              : "opacity-90 hover:opacity-100"
          }`}
        >
          {!captured && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-dex-bg/70 backdrop-blur-[2px]">
              <span className="rounded-full border border-dex-muted/40 bg-dex-panel px-3 py-1 text-xs font-bold uppercase tracking-widest text-dex-muted">
                Non découvert
              </span>
            </div>
          )}

          <div className="flex items-start gap-3">
            <FlagCircle code={country.code} name={country.name} size="md" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate font-bold text-dex-cream group-hover:text-white">
                  {country.name}
                </h3>
                <span className="shrink-0 font-mono text-xs text-dex-muted">
                  #{country.code}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-dex-muted">{country.region}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {country.types.slice(0, 2).map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
            </div>
          </div>

          {captured && (
            <div
              className={`mt-3 flex items-center gap-1.5 text-xs font-semibold ${
                starter ? "text-yellow-300" : "text-dex-green"
              }`}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  starter ? "bg-yellow-400" : "bg-dex-green"
                }`}
              />
              {starter ? "Origine" : "Capturé"}
            </div>
          )}
        </article>
      </Link>
    </motion.div>
  );
}
