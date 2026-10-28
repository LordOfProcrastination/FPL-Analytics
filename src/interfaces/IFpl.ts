export interface IFplPlayer {
  id: number;
  code: number;
  photo: string;
  web_name: string;
  team: number;
  element_type: number;
  now_cost: number;
  total_points: number;
  status?: string;
  news?: string;
}

export interface IFplTeam {
  id: number;
  code: number;
  name: string;
  short_name: string;
}

export interface IFplEvent {
  id: number;
  name: string;
  is_current: boolean;
  is_next: boolean;
  finished: boolean;
}

export interface IBootstrapData {
  total_players: number;
  teams: IFplTeam[];
  elements: IFplPlayer[];
  events: IFplEvent[];
}

export interface IFplPick {
  element: number;
  position: number;
  multiplier: number;
  is_captain: boolean;
  is_vice_captain: boolean;
}

export interface IGameweekPicks {
  picks: IFplPick[];
}

export interface IGameweekHistory {
  event: number;
  points: number;
  total_points: number;
}

export interface IEntryHistory {
  current: IGameweekHistory[];
}

export interface IPlayerHistoryRow {
  round: number;
  goals_scored: number;
  assists: number;
  expected_goals: string;
  expected_assists: string;
}

export interface IPlayerSummary {
  history: IPlayerHistoryRow[];
}
