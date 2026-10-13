import type { IEntry } from "../interfaces/IEntry";
import { getEntryById } from "../api/api";

export async function fetchEntry(teamId: number): Promise<IEntry> {
  if (!Number.isInteger(teamId) || teamId <= 0) {
    throw new Error("Please enter a valid Team ID (Entry ID).");
  }
  return getEntryById(teamId);
}
