import { notFound } from "next/navigation";
import { CountryDetail } from "@/components/CountryDetail";
import { countries } from "@/data/countries";
import { getCountryByCode } from "@/lib/country-utils";

type PageProps = {
  params: Promise<{ code: string }>;
};

export function generateStaticParams() {
  return countries.map((country) => ({
    code: country.code.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { code } = await params;
  const country = getCountryByCode(countries, code);

  if (!country) {
    return { title: "Pays introuvable — Countrydex" };
  }

  return {
    title: `${country.name} — Countrydex`,
    description: country.description,
  };
}

export default async function CountryPage({ params }: PageProps) {
  const { code } = await params;
  const country = getCountryByCode(countries, code);

  if (!country) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full px-5 py-8 sm:px-8 lg:px-10">
      <CountryDetail country={country} />
    </main>
  );
}
