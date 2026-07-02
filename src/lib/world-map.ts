const WORLD_MAP_URL =
  "https://cdn.jsdelivr.net/gh/flekschas/simple-world-map@master/world-map.min.svg";

let cachedWorldMapSvg: string | null = null;

export async function fetchWorldMapSvg(): Promise<string | null> {
  if (cachedWorldMapSvg) return cachedWorldMapSvg;

  try {
    const response = await fetch(WORLD_MAP_URL);
    if (!response.ok) return null;
    cachedWorldMapSvg = await response.text();
    return cachedWorldMapSvg;
  } catch {
    return null;
  }
}

/** Passe-through : le style est géré en CSS pour garder un bon contraste. */
export function buildHighlightedWorldMapSvg(svgMarkup: string, _countryId: string): string {
  return svgMarkup;
}
