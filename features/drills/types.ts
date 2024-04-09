export type MediaDimensions = { height: number; width: number };

export type SignedUrls = {
  url: string;
  type: string;
  dimensions: MediaDimensions;
  name: string;
};

export type DrillFromDBType = {
  id: number;
  name: string;
  duration: string;
  show_duration: boolean;
  description: string;
  comments: string;
  show_comments: boolean;
  show_media: boolean;
  show_edit_media: boolean;
};

export type DrillOfDrillStation = {
  id: number;
  drill_id: number;
  drill_station_id: number;
  order: number;
  user_id: string;
};

export type DrillType = DrillFromDBType & {
  user_id: string;
  order: number;
  station_id: number;
  drillOfStationId: number;
};
