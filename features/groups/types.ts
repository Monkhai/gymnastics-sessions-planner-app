import { ListTable } from '@/Components/Lists/Types';

export type GroupType = {
  id: number;
  name: string;
  order: number;
  user_id: number;
  created_at: string;
};

export type CreateGroupArgs = {
  name: string;
  lastOrder: number;
};

export type DeleteItem = {
  group_id: number;
};
