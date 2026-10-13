import type { IEntry } from "../../interfaces/IEntry";

export default function EntrySummary({ entry }: { entry: IEntry }) {
  return (
    <div style={{ marginTop: 12 }}>
      <h2 style={{ marginBottom: 6 }}>{entry.name}</h2>
      <div>
        <b>Manager:</b> {entry.player_first_name} {entry.player_last_name}
      </div>
      <div>
        <b>Overall points:</b> {entry.summary_overall_points}
      </div>
      <div>
        <b>Overall rank:</b> {entry.summary_overall_rank}
      </div>
      <div>
        <b>Team value:</b> {entry.last_deadline_value / 10}m
      </div>
      <div>
        <b>Bank:</b> {entry.last_deadline_bank / 10}m
      </div>
    </div>
  );
}
