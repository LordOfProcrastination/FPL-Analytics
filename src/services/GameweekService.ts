import type { IGameweekPicks } from "../interfaces/IFpl";
import { getGameweekPicks } from "../api/api";

// Fetch the manager's squad for a specific gameweek
export async function fetchGameweekPicks(
  teamId: number,
  gameweek: number,
): Promise<IGameweekPicks> {
  if (!Number.isInteger(teamId) || teamId <= 0) {
    throw new Error("Invalid Team ID.");
  }

  if (!Number.isInteger(gameweek) || gameweek <= 0) {
    throw new Error("Invalid gameweek.");
  }

  return getGameweekPicks(teamId, gameweek);
}
