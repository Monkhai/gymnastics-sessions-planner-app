export type SkillFromDBType = {
  id: number;
  name: string;
  repetitions: number;
  description: string;
  show_reps: boolean;
};

export type SkillofSKillStation = {
  id: number;
  skill_id: number;
  skill_station_id: number;
  order: number;
};

export type SkillType = {
  id: number;
  skillOfStationId: number;
  station_id: number;
  name: string;
  repetitions: number;
  order: number;
  description: string;
  show_reps: boolean;
};
