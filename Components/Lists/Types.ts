export type MainTable = 'groups' | 'athletes' | 'sessions' | 'stations' | 'drills' | 'skills';

export type ListTable = 'groups' | 'athletes' | 'sessions';

export type ListQueryKeyFactoryKeys = 'groups' | 'athletes' | 'groupSessions' | 'athletesSessions';

export type ListItemType = {
  id: number;
  name: string;
  order: number;
  user_id: number;
  created_at: string;
};
