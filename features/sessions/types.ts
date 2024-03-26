export type SessionFromDB = {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
};

export type SessionWithOrder = SessionFromDB & { order: number };

export type SessionJoinTable = 'sessions_of_groups' | 'sessions_of_athletes';
