import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col px-6 py-16">
      <div className="mx-auto w-full max-w-sm">
        <Link
          href="/"
          className="text-sm text-dex-muted transition-colors hover:text-dex-cream"
        >
          ← Retour
        </Link>

        <div className="mt-10">
          <p className="text-sm text-dex-muted">Countrydex</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-dex-cream">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-dex-muted">{subtitle}</p>
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
