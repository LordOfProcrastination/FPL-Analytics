export interface IFplPlayer {
  id: number;
  web_name: string;
  team: number;
  element_type: number;
  now_cost: number;
  total_points: number;
}

export interface IFplEvent {
  id: number;
  name: string;
  is_current: boolean;
  is_next: boolean;
  finished: boolean;
}

export interface IBootstrapData {
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
