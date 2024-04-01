export type StationTypeType = 'drillStation' | 'skillStation';

export type StationFromDB = {
  id: number;
  user_id: string;
  name: string;
  duration: string;
  show_duration: boolean;
  type: StationTypeType;
};

export type StationType = StationFromDB & { order: number };

export type StationOfSessionFromDB = {
  id: number;
  user_id: string;
  station_id: number;
  session_id: number;
  order: number;
};
