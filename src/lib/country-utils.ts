import type { Country, CountryType } from "./types";

export function getFlagUrl(code: string): string {
  return `https://flagcdn.com/${code.toLowerCase()}.svg`;
}

/** Silhouette vectorielle du pays (mapsicon, MIT). */
export function getCountryMapUrl(code: string): string {
  return `https://cdn.jsdelivr.net/gh/djaiss/mapsicon@master/all/${code.toLowerCase()}/vector.svg`;
}

export function getCountryByCode(
  countries: Country[],
  code: string,
): Country | undefined {
  return countries.find((c) => c.code.toLowerCase() === code.toLowerCase());
}

export const TYPE_COLORS: Record<
  CountryType,
  { bg: string; text: string; border: string }
> = {
  Montagne: { bg: "bg-amber-900/30", text: "text-amber-200", border: "border-amber-700" },
  Plage: { bg: "bg-cyan-900/30", text: "text-cyan-200", border: "border-cyan-700" },
  Urbain: { bg: "bg-violet-900/30", text: "text-violet-200", border: "border-violet-700" },
  Historique: { bg: "bg-yellow-900/30", text: "text-yellow-200", border: "border-yellow-700" },
  Nature: { bg: "bg-emerald-900/30", text: "text-emerald-200", border: "border-emerald-700" },
  Désert: { bg: "bg-orange-900/30", text: "text-orange-200", border: "border-orange-700" },
  Insulaire: { bg: "bg-blue-900/30", text: "text-blue-200", border: "border-blue-700" },
  Gastronomie: { bg: "bg-rose-900/30", text: "text-rose-200", border: "border-rose-700" },
};

export const STAT_LABELS: Record<keyof Country["stats"], string> = {
  culture: "Culture",
  gastronomie: "Gastronomie",
  aventure: "Aventure",
  nature: "Nature",
};
