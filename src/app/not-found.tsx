import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl">🗺️</p>
      <h1 className="mt-4 text-2xl font-bold text-dex-cream">Pays introuvable</h1>
      <p className="mt-2 text-dex-muted">
        Ce territoire n&apos;est pas encore répertorié dans le Countrydex.
      </p>
      <Link href="/" className="dex-button mt-6">
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
