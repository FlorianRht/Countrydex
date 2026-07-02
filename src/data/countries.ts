import type { Country } from "@/lib/types";
import { afrique } from "./regions/afrique";
import { amerique } from "./regions/amerique";
import { asie } from "./regions/asie";
import { europe } from "./regions/europe";
import { oceanie } from "./regions/oceanie";

export const countries: Country[] = [
  ...europe,
  ...asie,
  ...afrique,
  ...amerique,
  ...oceanie,
];

const dexNumberByCode = new Map(
  countries.map((country, index) => [country.code.toUpperCase(), index + 1]),
);

export function getDexNumber(code: string): number {
  return dexNumberByCode.get(code.toUpperCase()) ?? 0;
}

export function formatDexId(code: string): string {
  return String(getDexNumber(code)).padStart(3, "0");
}
