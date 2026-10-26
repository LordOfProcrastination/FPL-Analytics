import { useEffect, useState } from "react";

import { fetchBootstrapData } from "../services/PlayerService";
import { fetchGameweekPicks } from "../services/GameweekService";

import type { IFplPick, IFplPlayer } from "../interfaces/IFpl";

export interface ISquadPlayer extends IFplPick {
  player: IFplPlayer;
}

interface ITeamSquad {
  gameweek: number;
  startingXI: ISquadPlayer[];
  bench: ISquadPlayer[];
}

export function useTeamSquad(teamId: number | null) {
  const [data, setData] = useState<ITeamSquad | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (teamId === null) {
      return;
    }

    let cancelled = false;

    async function loadSquad() {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const bootstrap = await fetchBootstrapData();

        // Find the current or latest finished gameweek
        const gameweek =
          bootstrap.events.find((event) => event.is_current) ??
          [...bootstrap.events].reverse().find((event) => event.finished);

        if (!gameweek) {
          throw new Error("No gameweek available.");
        }

        const picks = await fetchGameweekPicks(teamId!, gameweek.id);

        const playerMap = new Map(
          bootstrap.elements.map((player) => [player.id, player]),
        );

        const squad: ISquadPlayer[] = picks.picks.map((pick) => {
          const player = playerMap.get(pick.element);

          if (!player) {
            throw new Error(`Player ${pick.element} not found.`);
          }

          return {
            ...pick,
            player,
          };
        });

        if (!cancelled) {
          setData({
            gameweek: gameweek.id,
            startingXI: squad
              .filter((p) => p.position <= 11)
              .sort((a, b) => a.position - b.position),
            bench: squad
              .filter((p) => p.position > 11)
              .sort((a, b) => a.position - b.position),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load squad.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSquad();

    return () => {
      cancelled = true;
    };
  }, [teamId]);

  return { data, loading, error };
}
