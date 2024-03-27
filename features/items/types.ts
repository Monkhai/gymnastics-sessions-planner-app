import { ListItemType, ListTable } from '@/Components/Lists/Types';

export type SecondaryTable =
  | 'athletes_of_groups'
  | 'sessions_of_groups'
  | 'sessions_of_athletes'
  | 'stations_of_sessions'
  | 'skills_of_skill_stations'
  | 'drills_of_drill_stations';

export type AllTables =
  | 'drills'
  | 'skills'
  | 'skills_of_skill_stations'
  | 'drills_of_drill_stations'
  | 'stations'
  | 'groups'
  | 'athletes'
  | 'sessions'
  | 'athletes_of_groups'
  | 'sessions_of_groups'
  | 'sessions_of_athletes';

export type CreateItemArgs = {
  table: 'groups';
  name: string;
  lastOrder: number;
};

export type UpdateItemArgs = {
  item_id: number;
  name: string;
  order: number;
};

export type DeleteItemArgs = {
  item_id: number;
};

export type CRUDItemArgs = {
  updateFn: (args: UpdateItemArgs) => void;
  deleteFn: <T>(args: DeleteItemArgs) => void;
};
