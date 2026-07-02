import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { getCountryMapUrl } from "@/lib/country-utils";

type CountryMapProps = {
  code: string;
  name: string;
  className?: string;
  fill?: boolean;
};

const MAP_EASE = [0.22, 1, 0.36, 1] as const;
const CROSSFADE = { duration: 0.26, ease: MAP_EASE } as const;

function MapCrossfadeLayer({ code, name }: { code: string; name: string }) {
  const isPresent = useIsPresent();

  return (
    <motion.img
      src={getCountryMapUrl(code)}
      alt={`Carte de ${name}`}
      className="explore-country-map-img"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={CROSSFADE}
      style={{
        position: "absolute",
        inset: 0,
        margin: "auto",
        zIndex: isPresent ? 2 : 1,
      }}
      loading="lazy"
      decoding="async"
    />
  );
}

export function CountryMap({ code, name, className = "", fill = false }: CountryMapProps) {
  return (
    <div className={`explore-country-map ${fill ? "explore-country-map-fill" : ""} ${className}`.trim()}>
      <p className="explore-country-map-label">Territoire</p>
      <div className="explore-country-map-frame explore-crossfade-slot">
        <AnimatePresence initial={false}>
          <MapCrossfadeLayer key={code} code={code} name={name} />
        </AnimatePresence>
      </div>
    </div>
  );
}
