export type CountryType =
  | "Montagne"
  | "Plage"
  | "Urbain"
  | "Historique"
  | "Nature"
  | "Désert"
  | "Insulaire"
  | "Gastronomie";

export type CountryStats = {
  culture: number;
  gastronomie: number;
  aventure: number;
  nature: number;
};

export type Country = {
  code: string;
  name: string;
  region: string;
  types: CountryType[];
  description: string;
  stats: CountryStats;
  superficie: string;
  population: string;
  capital: string;
  language: string;
  currency: string;
  /** Codes ISO alpha-2 des pays avec une frontière terrestre commune. */
  neighbors: string[];
};

export type VisitedMap = Record<string, string>;
