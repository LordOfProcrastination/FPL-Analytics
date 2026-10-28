import { useState } from "react";
import type { CSSProperties } from "react";
import type { IFplPlayer, IFplTeam } from "../../interfaces/IFpl";
import { getClubColours, getPlayerImageSources } from "../../utils/playerImages";

interface Props {
  player: IFplPlayer;
  club?: IFplTeam;
  decorative?: boolean;
}

function ImageWithFallback({ sources, label }: { sources: string[]; label: string }) {
  const [index, setIndex] = useState(0);
  return <img
    src={sources[index]}
    width={110}
    height={140}
    alt={label}
    decoding="async"
    className={sources[index].includes("/shirts/") ? "player-image__asset player-image__asset--shirt" : "player-image__asset"}
    onError={index < sources.length - 1 ? () => setIndex((current) => Math.min(current + 1, sources.length - 1)) : undefined}
  />;
}

export default function PlayerImage({ player, club, decorative = true }: Props) {
  const colours = getClubColours(club?.code);
  const sources = getPlayerImageSources(player, club);
  const style = { "--club-primary": colours.primary, "--club-secondary": colours.secondary } as CSSProperties;
  return (
    <span className="player-image" style={style}>
      <ImageWithFallback key={`${player.id}:${sources.join("|")}`} sources={sources} label={decorative ? "" : `${player.web_name}${club ? `, ${club.name}` : ""}`} />
    </span>
  );
}
