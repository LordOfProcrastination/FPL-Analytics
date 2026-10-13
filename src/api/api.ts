import type { IEntry } from "../interfaces/IEntry";

// Vite proxies this same-origin URL to the official FPL API during development.
// A deployed frontend can override it with the URL of its own server-side proxy.
const base = (import.meta.env.VITE_FPL_API_BASE ?? "/fpl-api").replace(/\/$/, "");

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    if (res.status === 404) throw new Error("No FPL team was found with that ID.");
    throw new Error(`The FPL API request failed (${res.status}).`);
  }
  return res.json();
}

export async function getEntryById(teamId: number): Promise<IEntry> {
  const url = `${base}/entry/${teamId}/`;
  return fetchJson<IEntry>(url);
}
