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

/** Noms pour les pays frontaliers absents du dex (ISO alpha-2). */
const EXTRA_COUNTRY_NAMES: Record<string, string> = {
  DE: "Allemagne",
  BE: "Belgique",
  LU: "Luxembourg",
  MC: "Monaco",
  AD: "Andorre",
  AT: "Autriche",
  SI: "Slovénie",
  SM: "Saint-Marin",
  VA: "Vatican",
  LI: "Liechtenstein",
  AL: "Albanie",
  MK: "Macédoine du Nord",
  BG: "Bulgarie",
  DZ: "Algérie",
  AR: "Argentine",
  UY: "Uruguay",
  PY: "Paraguay",
  CO: "Colombie",
  VE: "Venezuela",
  GY: "Guyana",
  SR: "Suriname",
  BO: "Bolivie",
  MY: "Malaisie",
  LA: "Laos",
  KH: "Cambodge",
  MM: "Myanmar",
  CN: "Chine",
  PK: "Pakistan",
  NP: "Népal",
  BT: "Bhoutan",
  BD: "Bangladesh",
  AF: "Afghanistan",
  IE: "Irlande",
  EC: "Équateur",
  CL: "Chili",
  GT: "Guatemala",
  BZ: "Belize",
  KP: "Corée du Nord",
  LY: "Libye",
  SD: "Soudan",
  IL: "Israël",
  PS: "Palestine",
  SA: "Arabie saoudite",
  PG: "Papouasie-Nouvelle-Guinée",
  TL: "Timor oriental",
  GE: "Géorgie",
  AM: "Arménie",
  AZ: "Azerbaïdjan",
  IR: "Iran",
  IQ: "Irak",
  SY: "Syrie",
};

export function getCountryLabel(countries: Country[], code: string): string {
  const match = getCountryByCode(countries, code);
  if (match) return match.name;
  return EXTRA_COUNTRY_NAMES[code.toUpperCase()] ?? code.toUpperCase();
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
