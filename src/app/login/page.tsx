import { AuthShell } from "@/components/AuthShell";
import { AuthAlert } from "@/components/AuthAlert";
import { LoginForm } from "@/components/LoginForm";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const { error } = await searchParams;

  return (
    <AuthShell
      title="Connexion"
      subtitle="Retrouve ta collection de pays synchronisée sur ton compte."
    >
      <AuthAlert error={error} />
      <LoginForm />
    </AuthShell>
  );
}
