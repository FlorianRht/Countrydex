import { AuthShell } from "@/components/AuthShell";
import { AuthAlert } from "@/components/AuthAlert";
import { SignupForm } from "@/components/SignupForm";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignupPage({ searchParams }: PageProps) {
  const { error } = await searchParams;

  return (
    <AuthShell
      title="Créer un compte"
      subtitle="Crée ton compte, puis choisis ton pays d'origine pour ouvrir le Countrydex."
    >
      <AuthAlert error={error} />
      <SignupForm />
    </AuthShell>
  );
}
