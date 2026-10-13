import type { IBootstrapData } from "../interfaces/IFpl";
import { getBootstrapData } from "../api/api";

// Fetch all players, teams and gameweek information
export async function fetchBootstrapData(): Promise<IBootstrapData> {
  return getBootstrapData();
}
