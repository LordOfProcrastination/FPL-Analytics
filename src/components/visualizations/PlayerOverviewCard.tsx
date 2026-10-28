import { useEffect, useState } from "react";
import { X } from "lucide-react";
import PlayerImage from "../shared/PlayerImage";
import { line, scaleLinear } from "d3";
import { getPlayerSummary } from "../../api/api";
import type { IPlayerHistoryRow } from "../../interfaces/IFpl";
import type { ISquadPlayer } from "../../hooks/UseTeamSquad";

const positions: Record<number, string> = { 1: "Goalkeeper", 2: "Defender", 3: "Midfielder", 4: "Forward" };

export default function PlayerOverviewCard({ pick, onClose }: { pick: ISquadPlayer; onClose: () => void }) {
  const [history, setHistory] = useState<IPlayerHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metric, setMetric] = useState<"goals" | "assists">("goals");

  useEffect(() => {
    const controller = new AbortController();
    getPlayerSummary(pick.element, controller.signal)
      .then((data) => { if (!controller.signal.aborted) setHistory(data.history); })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Could not load player statistics.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [pick.element]);

  // Sum fixtures within each round so double gameweeks have a single point.
  const rounds = new Map<number, { goals: number; assists: number; xg: number; xa: number }>();
  for (const row of history) {
    const round = rounds.get(row.round) ?? { goals: 0, assists: 0, xg: 0, xa: 0 };
    round.goals += row.goals_scored;
    round.assists += row.assists;
    round.xg += Number(row.expected_goals);
    round.xa += Number(row.expected_assists);
    rounds.set(row.round, round);
  }
  const lastRound = Math.max(0, ...rounds.keys());
  const totals = { goals: 0, assists: 0, xg: 0, xa: 0 };
  const points = Array.from({ length: lastRound }, (_, index) => {
    const round = rounds.get(index + 1);
    if (round) {
      totals.goals += round.goals;
      totals.assists += round.assists;
      totals.xg += round.xg;
      totals.xa += round.xa;
    }
    return { gw: index + 1, actual: totals[metric], expected: totals[metric === "goals" ? "xg" : "xa"] };
  });
  const label = metric === "goals" ? "Goals" : "Assists";
  const expectedLabel = metric === "goals" ? "xG" : "xA";
  const x = scaleLinear().domain([1, Math.max(2, lastRound)]).range([40, 400]);
  const y = scaleLinear().domain([0, Math.max(1, ...points.flatMap((p) => [p.actual, p.expected]))]).nice(4).range([230, 20]);
  const actualPath = line<(typeof points)[number]>().x((p) => x(p.gw)).y((p) => y(p.actual))(points);
  const expectedPath = line<(typeof points)[number]>().x((p) => x(p.gw)).y((p) => y(p.expected))(points);
  const ticks = [...new Set([1, Math.ceil(lastRound / 3), Math.ceil(lastRound * 2 / 3), lastRound])].filter((gw) => gw > 0);

  return (
    <section className="player-card" aria-label={`${pick.player.web_name} player overview`}>
      <header className="player-card__header">
        <span className="player-card__icon"><PlayerImage player={pick.player} club={pick.club} /></span>
        <div><h3>{pick.player.web_name}</h3><p>{positions[pick.player.element_type]} · Player overview</p></div>
        <button className="player-card__close" type="button" aria-label="Close player details" onClick={onClose}><X size={20} /></button>
      </header>
      <div className="player-card__summary"><span><strong>£{(pick.player.now_cost / 10).toFixed(1)}m</strong> price</span><span><strong>{pick.player.total_points}</strong> season points</span></div>
      {loading ? <p className="player-card__status" role="status">Loading player statistics…</p> : error ? <p className="player-card__status" role="alert">{error}</p> : !history.length ? <p className="player-card__status">No gameweek statistics are available yet.</p> : (
        <>
          <div className="player-card__totals">
            <p className="player-card__eyebrow">Season totals · GW 1–{lastRound}</p>
            <table><thead><tr><th scope="col">Returns</th><th scope="col">Actual</th><th scope="col">Expected</th><th scope="col">Difference</th></tr></thead>
              <tbody>{(["goals", "assists"] as const).map((key) => {
                const expected = totals[key === "goals" ? "xg" : "xa"];
                const difference = totals[key] - expected;
                return <tr key={key}><th scope="row">{key === "goals" ? "Goals" : "Assists"}</th><td className="player-card__actual">{totals[key]}</td><td>{expected.toFixed(2)} <span className="player-card__muted">{key === "goals" ? "xG" : "xA"}</span></td><td><span className={`player-card__difference ${difference >= 0 ? "is-positive" : "is-negative"}`}>{difference >= 0 ? "+" : ""}{difference.toFixed(2)}</span></td></tr>;
              })}</tbody>
            </table>
          </div>
          <div className="player-card__chart-section">
            <div className="player-card__tabs" role="group" aria-label="Player chart statistic">
              {(["goals", "assists"] as const).map((key) => <button key={key} type="button" aria-pressed={metric === key} onClick={() => setMetric(key)}>{key === "goals" ? "Goals" : "Assists"}</button>)}
            </div>
            <h4>{label} vs expected {metric}</h4>
            <div className="player-card__legend"><span><i />{label}</span><span><i className="is-expected" />{expectedLabel}</span></div>
            <svg viewBox="0 0 450 290" role="img" aria-label={`Cumulative ${metric} compared with ${expectedLabel} by gameweek`}>
              <desc>{points.map((p) => `GW ${p.gw}: ${p.actual} ${metric}, ${p.expected.toFixed(2)} ${expectedLabel}`).join(". ")}</desc>
              {y.ticks(4).map((tick) => <g key={tick}><line x1="40" x2="400" y1={y(tick)} y2={y(tick)} stroke="#e1e9e5" /><text x="27" y={y(tick) + 4} textAnchor="end">{tick}</text></g>)}
              <path d={expectedPath ?? ""} fill="none" stroke="#879a90" strokeWidth="2.5" strokeDasharray="6 5" />
              <path d={actualPath ?? ""} fill="none" stroke="#32ae7c" strokeWidth="3.5" />
              {points.slice(-1).map((p) => <g key={p.gw}><circle cx={x(p.gw)} cy={y(p.actual)} r="4" fill="#32ae7c" /><circle cx={x(p.gw)} cy={y(p.expected)} r="4" fill="#879a90" /></g>)}
              {ticks.map((gw) => <text key={gw} x={x(gw)} y="254" textAnchor="middle">{gw}</text>)}
              <text x="220" y="280" textAnchor="middle">Gameweek</text>
            </svg>
            <p className="player-card__footnote">Cumulative totals · FPL season data</p>
          </div>
        </>
      )}
    </section>
  );
}
