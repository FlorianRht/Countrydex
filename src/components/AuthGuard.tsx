"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const GUEST_PATHS = ["/", "/login", "/signup"];
const SETUP_PATHS = ["/onboarding"];
const PROTECTED_PREFIXES = ["/dex", "/country"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, profileLoaded, birthCountryCode, configured } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!configured || loading) return;

    const isGuestPath = GUEST_PATHS.includes(pathname);
    const isSetupPath = SETUP_PATHS.includes(pathname);
    const isAuthCallback = pathname.startsWith("/auth/callback");
    const protectedPath = isProtectedPath(pathname);

    if (!user) {
      if (!isGuestPath && !isAuthCallback) {
        router.replace("/");
      }
      return;
    }

    if (!profileLoaded) return;

    if (!birthCountryCode) {
      if (!isSetupPath) {
        router.replace("/onboarding");
      }
      return;
    }

    if (isGuestPath || isSetupPath) {
      router.replace("/dex");
    } else if (!protectedPath && !isAuthCallback && pathname !== "/_not-found") {
      router.replace("/dex");
    }
  }, [
    configured,
    loading,
    user,
    profileLoaded,
    birthCountryCode,
    pathname,
    router,
  ]);

  if (configured && (loading || (user && !profileLoaded))) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="dex-panel rounded-2xl px-8 py-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-dex-muted">
            Chargement
          </p>
          <p className="mt-2 text-dex-cream">Préparation du Countrydex...</p>
        </div>
      </div>
    );
  }

  return children;
}
