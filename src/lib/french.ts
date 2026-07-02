/**
 * Forme correcte après « partir de », « venir de », etc.
 * Ex. : d'Australie, du Brésil, des États-Unis
 */
const PREPOSITION_BY_CODE: Record<string, string> = {
  FR: "de France",
  JP: "du Japon",
  IT: "d'Italie",
  ES: "d'Espagne",
  TH: "de Thaïlande",
  MA: "du Maroc",
  IS: "d'Islande",
  US: "des États-Unis",
  BR: "du Brésil",
  GR: "de Grèce",
  PT: "du Portugal",
  VN: "du Vietnam",
  AU: "d'Australie",
  NZ: "de Nouvelle-Zélande",
  CH: "de Suisse",
  MX: "du Mexique",
  KR: "de Corée du Sud",
  EG: "d'Égypte",
  IN: "de l'Inde",
  CA: "du Canada",
  ID: "d'Indonésie",
  TR: "de Turquie",
  ENG: "d'Angleterre",
  SCO: "d'Écosse",
  WAL: "du Pays de Galles",
  NIR: "d'Irlande du Nord",
  PE: "du Pérou",
};

export function countryAvecPreposition(name: string, code: string): string {
  return PREPOSITION_BY_CODE[code.toUpperCase()] ?? `de ${name}`;
}

export function partirDePays(name: string, code: string): string {
  return `Partir ${countryAvecPreposition(name, code)}`;
}
