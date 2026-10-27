import EntrySearch from "../components/entry/EntrySearch";
import TeamFormation from "../components/visualizations/TeamFormation";
import GameweekPerformance from "../components/visualizations/GameweekPerformance";
import { useEntry } from "../contexts/EntryContext";
import { useTeamSquad } from "../hooks/UseTeamSquad";

export default function TeamPage() {
  const { entry, loading, error, fetchEntryById } = useEntry();
  const squad = useTeamSquad(entry?.id ?? null);
  const rank = entry?.summary_overall_rank;
  const totalPlayers = squad.totalPlayers;
  const topPercentage = rank && totalPlayers && rank > 0 && rank <= totalPlayers
    ? (rank / totalPlayers) * 100
    : null;

  return (
    <main className="team-page">
      <header className="team-page__heading">
        <div>
          <h1>My Team</h1>
          <p>Interactive squad dashboard</p>
        </div>
      </header>
      <div className="team-page__search">
        <EntrySearch onSearch={fetchEntryById} loading={loading} error={error} />
      </div>
      {entry ? (
        <>
          <p className="team-page__manager">{entry.name} · {entry.player_first_name} {entry.player_last_name}</p>
          <dl className="team-stats">
            <div><dt>Total Points</dt><dd>{entry.summary_overall_points.toLocaleString()}</dd></div>
            <div>
              <dt>Overall Rank</dt>
              <dd>{entry.summary_overall_rank?.toLocaleString() ?? "—"}</dd>
              {topPercentage !== null && (
                <p className="team-stats__percentile" title={`Based on ${totalPlayers!.toLocaleString()} FPL managers worldwide`}>
                  Top {topPercentage < 0.01 ? "<0.01" : topPercentage.toFixed(2)}% worldwide
                  <span>{(100 - topPercentage).toFixed(2)}th percentile</span>
                </p>
              )}
            </div>
            <div><dt>Squad Value</dt><dd>£{(entry.last_deadline_value / 10).toFixed(1)}m</dd></div>
          </dl>
          {squad.loading && <p className="team-page__status" role="status">Loading your squad…</p>}
          {squad.error && <p className="team-page__status" role="alert">{squad.error}</p>}
          {squad.data && <TeamFormation key={`${entry.id}-${squad.data.gameweek}`} {...squad.data} />}
          <GameweekPerformance key={entry.id} teamId={entry.id} />
        </>
      ) : (
        <p className="team-page__status">Enter your FPL Team ID to see your stats, starting XI, and bench.</p>
      )}
    </main>
  );
}
