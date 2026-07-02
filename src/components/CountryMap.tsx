import { motion } from "framer-motion";
import { getCountryMapUrl } from "@/lib/country-utils";

type CountryMapProps = {
  code: string;
  name: string;
  className?: string;
  fill?: boolean;
};

export function CountryMap({ code, name, className = "", fill = false }: CountryMapProps) {
  return (
    <div className={`explore-country-map ${fill ? "explore-country-map-fill" : ""} ${className}`.trim()}>
      <p className="explore-country-map-label">Territoire</p>
      <div className="explore-country-map-frame">
        <motion.img
          key={code}
          src={getCountryMapUrl(code)}
          alt={`Carte de ${name}`}
          className="explore-country-map-img"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
