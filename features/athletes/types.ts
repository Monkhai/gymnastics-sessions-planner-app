export type AthleteFromDB = {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
};

export type AthleteWithOrder = AthleteFromDB & { order: number };
