import EntrySearch from "../components/entry/EntrySearch";
import EntrySummary from "../components/entry/EntrySummary";
import { useEntry } from "../contexts/EntryContext";

export default function TeamPage() {
  const { entry, loading, error, fetchEntryById } = useEntry();

  return (
    <div style={{ padding: 12 }}>
      <h1>Find your FPL Team</h1>

      <EntrySearch onSearch={fetchEntryById} loading={loading} error={error} />

      {entry && <EntrySummary entry={entry} />}
    </div>
  );
}
