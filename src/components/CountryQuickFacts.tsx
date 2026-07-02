import type { Country } from "@/lib/types";

type CountryQuickFactsProps = {
  country: Country;
};

export function CountryQuickFacts({ country }: CountryQuickFactsProps) {
  return (
    <div className="explore-preview-quickfacts">
      <div className="explore-preview-quickfact">
        <p className="explore-preview-quickfact-label">Capitale</p>
        <p className="explore-preview-quickfact-value">{country.capital}</p>
      </div>
      <div className="explore-preview-quickfact">
        <p className="explore-preview-quickfact-label">Langue</p>
        <p className="explore-preview-quickfact-value">{country.language}</p>
      </div>
      <div className="explore-preview-quickfact">
        <p className="explore-preview-quickfact-label">Monnaie</p>
        <p className="explore-preview-quickfact-value">{country.currency}</p>
      </div>
    </div>
  );
}
