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
};

export type VisitedMap = Record<string, string>;
