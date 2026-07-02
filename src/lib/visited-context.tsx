"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { VisitedMap } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";

const EMPTY_VISITED: VisitedMap = {};

type VisitedRow = {
  country_code: string;
  visited_at: string;
  is_starter: boolean;
};

type VisitedContextValue = {
  visited: VisitedMap;
  starters: Set<string>;
  hydrated: boolean;
  visitedCount: number;
  isVisited: (code: string) => boolean;
  isStarter: (code: string) => boolean;
  toggleVisited: (code: string) => Promise<void>;
  getVisitDate: (code: string) => string | undefined;
};

const VisitedContext = createContext<VisitedContextValue | null>(null);

function rowsToState(rows: VisitedRow[]) {
  const visited: VisitedMap = {};
  const starters = new Set<string>();

  for (const row of rows) {
    const code = row.country_code.toUpperCase();
    visited[code] = row.visited_at;
    if (row.is_starter) starters.add(code);
  }

  return { visited, starters };
}

export function VisitedProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, birthCountryCode } = useAuth();
  const [visited, setVisited] = useState<VisitedMap>(EMPTY_VISITED);
  const [starters, setStarters] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user || !birthCountryCode) {
      void Promise.resolve().then(() => {
        setVisited(EMPTY_VISITED);
        setStarters(new Set());
        setHydrated(true);
      });
      return;
    }

    void (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("visited_countries")
        .select("country_code, visited_at, is_starter")
        .eq("user_id", user.id);

      if (error) {
        setVisited(EMPTY_VISITED);
        setStarters(new Set());
      } else {
        const state = rowsToState(data ?? []);
        setVisited(state.visited);
        setStarters(state.starters);
      }
      setHydrated(true);
    })();
  }, [user, authLoading, birthCountryCode]);

  const toggleVisited = useCallback(
    async (code: string) => {
      if (!user) return;

      const key = code.toUpperCase();
      if (starters.has(key)) return;

      const supabase = createClient();
      const isCurrentlyVisited = !!visited[key];

      if (isCurrentlyVisited) {
        const { error } = await supabase
          .from("visited_countries")
          .delete()
          .eq("user_id", user.id)
          .eq("country_code", key)
          .eq("is_starter", false);

        if (error) return;

        setVisited((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        return;
      }

      const visitDate = new Date().toISOString().split("T")[0];
      const { error } = await supabase.from("visited_countries").insert({
        user_id: user.id,
        country_code: key,
        visited_at: visitDate,
        is_starter: false,
      });

      if (error) return;

      setVisited((prev) => ({ ...prev, [key]: visitDate }));
    },
    [user, visited, starters],
  );

  const isVisited = useCallback(
    (code: string) => !!visited[code.toUpperCase()],
    [visited],
  );

  const isStarter = useCallback(
    (code: string) => starters.has(code.toUpperCase()),
    [starters],
  );

  const getVisitDate = useCallback(
    (code: string) => visited[code.toUpperCase()],
    [visited],
  );

  const value = useMemo(
    () => ({
      visited,
      starters,
      hydrated,
      visitedCount: Object.keys(visited).length,
      isVisited,
      isStarter,
      toggleVisited,
      getVisitDate,
    }),
    [visited, starters, hydrated, isVisited, isStarter, toggleVisited, getVisitDate],
  );

  return (
    <VisitedContext.Provider value={value}>{children}</VisitedContext.Provider>
  );
}

export function useVisited() {
  const ctx = useContext(VisitedContext);
  if (!ctx) {
    throw new Error("useVisited must be used within VisitedProvider");
  }
  return ctx;
}
