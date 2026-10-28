import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import PlayerImage from "../src/components/shared/PlayerImage";
import TeamFormation from "../src/components/visualizations/TeamFormation";
import type { IFplPlayer } from "../src/interfaces/IFpl";
import "../src/index.css";

const root = createRoot(document.getElementById("root")!);
const results: string[] = [];
function check(condition: unknown, label: string) {
  if (!condition) throw new Error(label);
  results.push(`PASS: ${label}`);
}
const player: IFplPlayer = { id: 411, code: 223094, photo: "223094.jpg", team: 15, element_type: 4, now_cost: 140, total_points: 50, web_name: "Haaland", status: "a" };
const club = { id: 15, code: 43, name: "Manchester City", short_name: "MCI" };
function image() { return document.querySelector<HTMLImageElement>(".player-image img")!; }
try {
  flushSync(() => root.render(<PlayerImage player={player} club={club} />));
  check(image().src.endsWith("/223094.png"), "normal portrait source");
  check(image().alt === "", "adjacent names do not get redundant image announcements");
  flushSync(() => image().dispatchEvent(new Event("error")));
  check(image().src.endsWith("/shirt_43-110.png"), "missing portrait falls back to shirt");
  flushSync(() => image().dispatchEvent(new Event("error")));
  check(image().src.endsWith("/player-silhouette.svg"), "missing shirt falls back to local silhouette");
  flushSync(() => image().dispatchEvent(new Event("error")));
  check(image().src.endsWith("/player-silhouette.svg"), "terminal fallback does not loop");
  flushSync(() => root.render(<PlayerImage player={{ ...player, id: 1, code: 154561, element_type: 1 }} club={{ ...club, code: 3 }} />));
  check(image().src.endsWith("/154561.png"), "reused component resets when player changes");
  flushSync(() => image().dispatchEvent(new Event("error")));
  check(image().src.endsWith("/shirt_3_1-110.png"), "goalkeeper fallback uses goalkeeper shirt");
  flushSync(() => root.render(<PlayerImage player={player} club={{ ...club, code: 99999 }} />));
  check(document.querySelector<HTMLElement>(".player-image")!.style.getPropertyValue("--club-primary") === "#718078", "unknown club uses neutral colours");

  const squad = Array.from({ length: 15 }, (_, i) => ({
    element: i + 1, position: i + 1, multiplier: 1, is_captain: i === 0, is_vice_captain: i === 1,
    player: { ...player, id: i + 1, web_name: `Player ${i + 1}`, element_type: i === 0 || i === 11 ? 1 : i < 5 ? 2 : i < 9 ? 3 : 4, status: i === 0 || i === 12 ? "i" : "a", news: "Injured" }, club,
  }));
  window.fetch = async () => new Response(JSON.stringify({ history: [] }), { headers: { "Content-Type": "application/json" } });
  flushSync(() => root.render(<TeamFormation startingXI={squad.slice(0, 11)} bench={squad.slice(11)} gameweek={8} />));
  check(document.querySelectorAll(".team-pitch .player-image").length === 11, "starting XI portraits");
  check(document.querySelectorAll(".team-bench .player-image").length === 4, "bench portraits");
  check(document.querySelectorAll(".squad-player__captain").length === 2, "captain and vice captain indicators");
  check(document.querySelectorAll(".squad-player__status").length === 2, "injury indicators on starters and bench");
  check(document.documentElement.scrollWidth <= window.innerWidth, "formation fits viewport without horizontal overflow");
  const badge = document.querySelector(".squad-player__captain")!;
  const portrait = document.querySelector(".player-image")!;
  check(getComputedStyle(portrait).overflow === "hidden" && getComputedStyle(badge.parentElement!).overflow !== "hidden", "portrait clipping does not clip overlays");
  flushSync(() => document.querySelector<HTMLButtonElement>(".squad-player")!.click());
  check(document.querySelector("dialog")?.open, "player click still opens modal");
  check(document.querySelector("dialog .player-image"), "modal reuses player imagery");
  flushSync(() => document.querySelector<HTMLButtonElement>('[aria-label="Close player details"]')!.click());
  check(!document.querySelector("dialog"), "modal close interaction preserved");
  document.getElementById("results")!.textContent = results.join("\n") + "\nALL PASSED";
} catch (error) {
  document.getElementById("results")!.textContent = results.join("\n") + `\nFAILED: ${error}`;
}
