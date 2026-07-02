"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { checkOnboardingUsername } from "@/app/actions/auth";

type UsernameModalProps = {
  initialValue?: string;
  onConfirm: (username: string) => void;
  onSignOut: () => void;
};

export function UsernameModal({
  initialValue = "",
  onConfirm,
  onSignOut,
}: UsernameModalProps) {
  const [draft, setDraft] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await checkOnboardingUsername(draft);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.username) {
        onConfirm(result.username);
      }
    });
  };

  return (
    <div className="explore-username-modal-root">
      <motion.div
        className="explore-username-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        aria-hidden
      />

      <motion.div
        className="explore-username-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="username-modal-title"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="explore-username-modal-header">
          <p className="explore-username-modal-eyebrow">Étape 1 · Profil</p>
          <button type="button" onClick={onSignOut} className="explore-username-modal-signout">
            Déconnexion
          </button>
        </div>

        <div className="explore-username-modal-intro">
          <div className="explore-username-modal-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.75">
              <circle cx="12" cy="8" r="4" />
              <path d="M5 20a7 7 0 0 1 14 0" strokeLinecap="round" />
            </svg>
          </div>

          <div className="explore-username-modal-copy">
            <h2 id="username-modal-title" className="explore-username-modal-title">
              Ton pseudo
            </h2>
            <p className="explore-username-modal-lead">
              Visible dans l&apos;en-tête de ton Countrydex.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="explore-username-modal-form">
          {error && (
            <p className="explore-username-modal-error" role="alert">
              {error}
            </p>
          )}

          <label htmlFor="username-modal-input" className="sr-only">
            Pseudo
          </label>
          <input
            id="username-modal-input"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            minLength={3}
            maxLength={20}
            pattern="[a-zA-Z0-9_-]+"
            autoComplete="username"
            autoFocus
            required
            className="dex-input"
            placeholder="mon_pseudo"
          />
          <p className="explore-username-modal-hint">
            De 3 à 20 caractères. Lettres, chiffres, tirets et underscores.
          </p>

          <button
            type="submit"
            disabled={pending || draft.trim().length < 3}
            className="explore-confirm mt-5 w-full"
          >
            {pending ? "Vérification..." : "Valider"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
