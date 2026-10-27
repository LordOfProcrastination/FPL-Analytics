import { useEffect, useState } from "react";
import { line, scaleLinear, scalePoint } from "d3";
import { getEntryHistory } from "../../api/api";
import type { IGameweekHistory } from "../../interfaces/IFpl";

export default function GameweekPerformance({ teamId }: { teamId: number }) {
  const [history, setHistory] = useState<IGameweekHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"weekly" | "cumulative">("weekly");

  useEffect(() => {
    let cancelled = false;
    getEntryHistory(teamId)
      .then((data) => {
        if (!cancelled) setHistory([...data.current].sort((a, b) => a.event - b.event));
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load gameweek history.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [teamId]);

  const points = history.map((week) => ({
    gameweek: week.event,
    points: mode === "weekly" ? week.points : week.total_points,
  }));
  const width = Math.max(800, points.length * 42);
  const height = 440;
  const x = scalePoint<number>().domain(points.map((p) => p.gameweek)).range([70, width - 28]);
  const values = points.map((p) => p.points);
  const min = Math.min(0, ...values);
  const max = Math.max(1, ...values);
  const y = scaleLinear().domain([min, max]).nice(5).range([height - 48, 24]);
  const path = line<(typeof points)[number]>().x((p) => x(p.gameweek)!).y((p) => y(p.points))(points);

  return (
    <section className="gameweek-performance" aria-labelledby="performance-title">
      <div className="gameweek-performance__heading">
        <div>
          <h2 id="performance-title">Gameweek performance</h2>
          <p>{mode === "weekly" ? "Compare your weekly points throughout the season" : "Track your total points throughout the season"}</p>
        </div>
        <div className="gameweek-performance__controls" role="group" aria-label="Points display">
          <button type="button" aria-pressed={mode === "weekly"} onClick={() => setMode("weekly")}>Weekly points</button>
          <button type="button" aria-pressed={mode === "cumulative"} onClick={() => setMode("cumulative")}>Cumulative points</button>
        </div>
      </div>
      {loading ? <p role="status">Loading gameweek history…</p> : error ? <p role="alert">{error}</p> : !points.length ? <p>No gameweek history is available yet.</p> : (
        <>
          <div className="gameweek-performance__chart" tabIndex={0} role="region" aria-label="Points chart, scroll horizontally to see all gameweeks">
            <svg viewBox={`0 0 ${width} ${height}`} style={{ minWidth: width }} role="img" aria-labelledby="points-chart-title points-chart-description">
              <title id="points-chart-title">{mode === "weekly" ? "Weekly" : "Cumulative"} FPL points</title>
              <desc id="points-chart-description">{points.map((p) => `Gameweek ${p.gameweek}: ${p.points} points`).join(". ")}</desc>
              {y.ticks(5).map((tick) => (
                <g key={tick}>
                  <line x1={58} x2={width - 15} y1={y(tick)} y2={y(tick)} stroke="#e8e8e8" strokeDasharray="5 5" />
                  <text x={44} y={y(tick)} textAnchor="end" dominantBaseline="middle" className="gameweek-performance__label">{tick.toLocaleString()}</text>
                </g>
              ))}
              <path d={path ?? ""} fill="none" stroke="#5096ff" strokeWidth={3} />
              {points.map((p) => (
                <g key={p.gameweek}>
                  <circle cx={x(p.gameweek)} cy={y(p.points)} r={6} fill="#5096ff" stroke="#fcfcfc" strokeWidth={3}>
                    <title>GW{p.gameweek}: {p.points} points</title>
                  </circle>
                  <text x={x(p.gameweek)} y={height - 16} textAnchor="middle" className="gameweek-performance__label">GW{p.gameweek}</text>
                </g>
              ))}
            </svg>
          </div>
          <p className="gameweek-performance__note">{mode === "weekly" ? "Gameweek scores before transfer deductions." : "Official season totals, including transfer deductions."}</p>
        </>
      )}
    </section>
  );
}
