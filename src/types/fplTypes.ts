// types/fplTypes.ts
export interface Player {
  id: number;
  code: number;
  photo: string;
  element_type: number;
  first_name: string;
  second_name: string;
  team: number;
  web_name: string;
  total_points: number;
}

export interface Team {
  id: number;
  code: number;
  name: string;
  short_name: string;
}

export interface BootstrapResponse {
  elements: Player[];
  teams: Team[];
}

export interface Entry {
  id: number;
  name: string;
  player_first_name: string;
  player_last_name: string;
  summary_overall_points: number;
  summary_overall_rank: number;
  last_deadline_value: number;
  last_deadline_bank: number;
}
