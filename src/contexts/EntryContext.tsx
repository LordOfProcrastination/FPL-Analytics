import { createContext, useContext, useMemo, useState } from "react";
import type { IEntry } from "../interfaces/IEntry";
import type { IEntryContext } from "../interfaces/IEntryContext";
import { fetchEntry } from "../services/EntryService";

const EntryContext = createContext<IEntryContext | null>(null);

export function EntryProvider({ children }: { children: React.ReactNode }) {
  const [entry, setEntry] = useState<IEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchEntryById(teamId: number) {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchEntry(teamId);
      setEntry(data);
    } catch (e: any) {
      setEntry(null);
      setError(e?.message ?? "Failed to load team.");
    } finally {
      setLoading(false);
    }
  }

  function clearEntry() {
    setEntry(null);
    setError(null);
  }

  const value = useMemo(
    () => ({ entry, loading, error, fetchEntryById, clearEntry }),
    [entry, loading, error],
  );

  return (
    <EntryContext.Provider value={value}>{children}</EntryContext.Provider>
  );
}

export function useEntry() {
  const ctx = useContext(EntryContext);
  if (!ctx) throw new Error("useEntry must be used inside EntryProvider");
  return ctx;
}
