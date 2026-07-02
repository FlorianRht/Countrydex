import type { Country, CountryType } from "./types";

/** Codes ISO subdivisions UK → assets flagcdn / carte monde. */
const UK_NATION_ASSETS: Record<string, { flag: string; map: string; world: string }> = {
  ENG: { flag: "gb-eng", map: "gb", world: "gb" },
  SCO: { flag: "gb-sct", map: "gb", world: "gb" },
  WAL: { flag: "gb-wls", map: "gb", world: "gb" },
  NIR: { flag: "gb-nir", map: "gb", world: "gb" },
};

function getNationAssets(code: string) {
  return UK_NATION_ASSETS[code.toUpperCase()];
}

export function getFlagUrl(code: string): string {
  const assets = getNationAssets(code);
  const flagCode = assets?.flag ?? code.toLowerCase();
  return `https://flagcdn.com/${flagCode}.svg`;
}

/** Silhouette vectorielle du pays (mapsicon, MIT). */
export function getCountryMapUrl(code: string): string {
  const assets = getNationAssets(code);
  const mapCode = assets?.map ?? code.toLowerCase();
  return `https://cdn.jsdelivr.net/gh/djaiss/mapsicon@master/all/${mapCode}/vector.svg`;
}

/** Identifiant SVG pour surligner le pays sur la carte mondiale. */
export function getWorldMapHighlightId(code: string): string {
  const assets = getNationAssets(code);
  return assets?.world ?? code.toLowerCase();
}

export function getCountryByCode(
  countries: Country[],
  code: string,
): Country | undefined {
  return countries.find((c) => c.code.toLowerCase() === code.toLowerCase());
}

export function getCountryLabel(countries: Country[], code: string): string {
  const match = getCountryByCode(countries, code);
  return match ? match.name : code.toUpperCase();
}

export function isCountryInDex(countries: Country[], code: string): boolean {
  return getCountryByCode(countries, code) !== undefined;
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
