import type { IFplPlayer, IFplTeam } from "../interfaces/IFpl";

export const neutralColours = { primary: "#718078", secondary: "#e8eeeb" };
// Stable Premier League club codes, not season-specific FPL team IDs.
export const clubColours: Record<number, { primary: string; secondary: string }> = {
  1: { primary: "#da291c", secondary: "#ffffff" }, // Manchester United
  2: { primary: "#ffcd00", secondary: "#ffffff" }, // Leeds
  3: { primary: "#ef0107", secondary: "#ffffff" }, // Arsenal
  4: { primary: "#241f20", secondary: "#ffffff" }, // Newcastle
  6: { primary: "#132257", secondary: "#ffffff" }, // Tottenham
  7: { primary: "#670e36", secondary: "#95bfe5" }, // Aston Villa
  8: { primary: "#034694", secondary: "#ffffff" }, // Chelsea
  9: { primary: "#6caddf", secondary: "#ffffff" }, // Coventry
  11: { primary: "#003399", secondary: "#ffffff" }, // Everton
  14: { primary: "#c8102e", secondary: "#ffffff" }, // Liverpool
  17: { primary: "#dd0000", secondary: "#ffffff" }, // Nottingham Forest
  31: { primary: "#1b458f", secondary: "#c4122e" }, // Crystal Palace
  36: { primary: "#0057b8", secondary: "#ffffff" }, // Brighton
  40: { primary: "#0057b8", secondary: "#ffffff" }, // Ipswich
  43: { primary: "#6cabdd", secondary: "#ffffff" }, // Manchester City
  54: { primary: "#222222", secondary: "#ffffff" }, // Fulham
  56: { primary: "#eb172b", secondary: "#ffffff" }, // Sunderland
  88: { primary: "#f5a12d", secondary: "#222222" }, // Hull
  91: { primary: "#da291c", secondary: "#222222" }, // Bournemouth
  94: { primary: "#e30613", secondary: "#ffffff" }, // Brentford
};

export function getClubColours(code?: number) {
  return (code === undefined ? undefined : clubColours[code]) ?? neutralColours;
}

export function getPlayerImageSources(player: Pick<IFplPlayer, "code" | "photo" | "element_type">, club?: Pick<IFplTeam, "code">) {
  // photo is an image code filename; never substitute the season-specific player ID.
  const photoCode = player.photo?.match(/^(\d+)\.(?:jpg|png)$/i)?.[1];
  const code = Number.isInteger(player.code) && player.code > 0 ? player.code : Number(photoCode);
  const portrait = code > 0 ? `https://resources.premierleague.com/premierleague25/photos/players/110x140/${code}.png` : null;
  const shirt = club && club.code > 0
    ? `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${club.code}${player.element_type === 1 ? "_1" : ""}-110.png`
    : null;
  return [...(portrait ? [portrait] : []), ...(shirt ? [shirt] : []), "/images/player-silhouette.svg"];
}
