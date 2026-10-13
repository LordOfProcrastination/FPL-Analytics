import type { IEntry } from "./IEntry";

export interface IEntryContext {
  entry: IEntry | null;
  loading: boolean;
  error: string | null;
  fetchEntryById: (teamId: number) => Promise<void>;
  clearEntry: () => void;
}
