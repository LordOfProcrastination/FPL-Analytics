import { useState } from "react";

type Props = {
  onSearch: (teamId: number) => void;
  loading?: boolean;
  error?: string | null;
};

export default function EntrySearch({
  onSearch,
  loading = false,
  error = null,
}: Props) {
  const [value, setValue] = useState("");

  function submit() {
    const id = Number(value);
    onSearch(id);
  }

  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
      <label htmlFor="teamId">Team ID (Entry ID)</label>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          id="teamId"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="e.g. 123456"
          inputMode="numeric"
        />
        <button onClick={submit} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <div style={{ fontWeight: 600 }}>{error}</div>}
    </div>
  );
}
