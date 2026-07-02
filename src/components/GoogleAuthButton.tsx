"use client";

import { useState } from "react";
import { signInWithGoogle } from "@/app/actions/auth";

type GoogleAuthButtonProps = {
  mode: "login" | "signup";
};

export function GoogleAuthButton({ mode }: GoogleAuthButtonProps) {
  const [pending, setPending] = useState(false);

  return (
    <form
      action={signInWithGoogle}
      onSubmit={() => setPending(true)}
    >
      <input type="hidden" name="mode" value={mode} />
        <button
          type="submit"
          disabled={pending}
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-dex-border bg-transparent px-4 py-2.5 text-sm font-medium text-dex-cream transition-colors hover:border-dex-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
        <GoogleIcon />
        {pending ? "Redirection..." : "Continuer avec Google"}
      </button>
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9.1v3.34h4.84a4.14 4.14 0 0 1-1.68 2.72v2.26h2.72c1.6-1.48 2.52-3.66 2.52-6.48z"
      />
      <path
        fill="#34A853"
        d="M9.1 18c2.43 0 4.47-.8 5.96-2.18l-2.72-2.26c-.8.54-1.84.86-3.24.86-2.48 0-4.58-1.66-5.33-3.9H1.04v2.33A8.99 8.99 0 0 0 9.1 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.77 10.52A5.41 5.41 0 0 1 3.54 9c0-.52.08-1.03.23-1.52V5.15H1.04A8.99 8.99 0 0 0 0 9c0 1.45.35 2.82.96 4.03l2.81-2.51z"
      />
      <path
        fill="#EA4335"
        d="M9.1 3.58c1.32 0 2.23.57 2.74 1.05l2.01-2.01C13.56.89 11.52 0 9.1 0A8.99 8.99 0 0 0 1.04 5.15l2.73 2.33C4.52 5.24 6.62 3.58 9.1 3.58z"
      />
    </svg>
  );
}
