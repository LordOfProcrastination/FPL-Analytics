import type { IEntry } from "../interfaces/IEntry";
import type { IBootstrapData, IGameweekPicks, IEntryHistory } from "../interfaces/IFpl";

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

export async function getEntryHistory(teamId: number): Promise<IEntryHistory> {
  return fetchJson<IEntryHistory>(`${base}/entry/${teamId}/history/`);
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

export async function getPlayerSummary(playerId: number, signal?: AbortSignal): Promise<import("../interfaces/IFpl").IPlayerSummary> {
  const response = await fetch(`${base}/element-summary/${playerId}/`, { signal, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Could not load player statistics (${response.status}).`);
  return response.json();
}
