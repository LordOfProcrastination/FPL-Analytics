import { useState } from "react";
import { Shirt } from "lucide-react";
import PlayerOverviewModal from "./PlayerOverviewModal";
import type { ISquadPlayer } from "../../hooks/UseTeamSquad";

interface Props {
  startingXI: ISquadPlayer[];
  bench: ISquadPlayer[];
  gameweek?: number;
}

const positionNames: Record<number, string> = {
  1: "Goalkeeper", 2: "Defender", 3: "Midfielder", 4: "Forward",
};

export default function TeamFormation({ startingXI, bench, gameweek }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<ISquadPlayer | null>(null);
  const rows = [1, 2, 3, 4].map((position) =>
    startingXI.filter((pick) => pick.player.element_type === position),
  );
  const formation = rows.slice(1).map((row) => row.length).join("–");

  function playerButton(pick: ISquadPlayer, substitute = false) {
    return (
      <button
        key={pick.element}
        type="button"
        className={`squad-player${substitute ? " squad-player--bench" : ""}`}
        onClick={() => setSelectedPlayer(pick)}
        aria-label={`View ${pick.player.web_name}, ${positionNames[pick.player.element_type]}${pick.is_captain ? ", captain" : pick.is_vice_captain ? ", vice captain" : ""}`}
      >
        <span className="squad-player__shirt">
          <Shirt aria-hidden="true" />
          {(pick.is_captain || pick.is_vice_captain) && (
            <span className="squad-player__captain">{pick.is_captain ? "C" : "V"}</span>
          )}
        </span>
        <span className="squad-player__name">{pick.player.web_name}</span>
      </button>
    );
  }

  return (
    <section aria-label="Squad formation">
      <div className="team-pitch">
        <div className="team-pitch__heading">
          <h2>Starting XI</h2>
          <span>{gameweek ? `GW ${gameweek} · ` : ""}{formation}</span>
        </div>
        <div className="team-pitch__rows">
          {rows.map((players, index) => (
            <div className="team-pitch__row" key={index}>
              {players.map((pick) => playerButton(pick))}
            </div>
          ))}
        </div>
      </div>
      <div className="team-bench" aria-label="Substitutes">
        {bench.map((pick) => playerButton(pick, true))}
      </div>
      {selectedPlayer && (
        <PlayerOverviewModal key={selectedPlayer.element} pick={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      )}
    </section>
  );
}
