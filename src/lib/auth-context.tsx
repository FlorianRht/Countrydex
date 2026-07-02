"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  profileLoaded: boolean;
  configured: boolean;
  birthCountryCode: string | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [birthCountryCode, setBirthCountryCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(configured);
  const [profileLoaded, setProfileLoaded] = useState(!configured);

  const loadProfile = useCallback(async (userId: string) => {
    setProfileLoaded(false);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("birth_country_code")
        .eq("id", userId)
        .maybeSingle();

      setBirthCountryCode(data?.birth_country_code ?? null);
    } catch {
      setBirthCountryCode(null);
    } finally {
      setProfileLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!configured) return;

    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        void loadProfile(currentUser.id);
      } else {
        setProfileLoaded(true);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        void loadProfile(currentUser.id);
      } else {
        setBirthCountryCode(null);
        setProfileLoaded(true);
      }
      setLoading(false);

      if (event === "USER_UPDATED" && currentUser) {
        void loadProfile(currentUser.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [configured, loadProfile]);

  const value = useMemo(
    () => ({ user, loading, profileLoaded, configured, birthCountryCode }),
    [user, loading, profileLoaded, configured, birthCountryCode],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
