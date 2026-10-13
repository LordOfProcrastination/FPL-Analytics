import type { IEntry } from "../interfaces/IEntry";
import type { IBootstrapData, IGameweekPicks } from "../interfaces/IFpl";

// Vite proxies this same-origin URL to the official FPL API during development.
// A deployed frontend can override it with the URL of its own server-side proxy.
const base = (import.meta.env.VITE_FPL_API_BASE ?? "/fpl-api").replace(
  /\/$/,
  "",
);

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    if (res.status === 404)
      throw new Error("No FPL team was found with that ID.");
    throw new Error(`The FPL API request failed (${res.status}).`);
  }
  return res.json();
}

// Get a manager's team information
export async function getEntryById(teamId: number): Promise<IEntry> {
  const url = `${base}/entry/${teamId}/`;
  return fetchJson<IEntry>(url);
}

// Get all players, teams and gameweek information
export async function getBootstrapData(): Promise<IBootstrapData> {
  return fetchJson<IBootstrapData>(`${base}/bootstrap-static/`);
}

// Get a manager's squad for a specific gameweek
export async function getGameweekPicks(
  teamId: number,
  gameweek: number,
): Promise<IGameweekPicks> {
  return fetchJson<IGameweekPicks>(
    `${base}/entry/${teamId}/event/${gameweek}/picks/`,
  );
}
