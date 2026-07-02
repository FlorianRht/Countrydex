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
