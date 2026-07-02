const MESSAGES: Record<string, string> = {
  google:
    "Google n'est pas activé dans Supabase. Active le provider Google dans Authentication → Providers, puis configure tes identifiants Google Cloud.",
  auth: "La connexion a échoué. Réessaie ou utilise email et mot de passe.",
  supabase: "Supabase n'est pas configuré correctement.",
};

export function AuthAlert({ error }: { error?: string }) {
  if (!error) return null;

  const message = MESSAGES[error] ?? "Une erreur est survenue. Réessaie.";

  return (
    <p className="mb-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
      {message}
    </p>
  );
}
