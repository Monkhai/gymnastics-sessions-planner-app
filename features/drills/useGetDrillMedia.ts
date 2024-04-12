import { useQuery } from '@tanstack/react-query';
import getDrillMedia from './getDrillMedia';
import { staleTime } from '@/Constants/Randoms';

type Args = {
  queryKey: string[];
  drill_id: number;
};

export default ({ queryKey, drill_id }: Args) => {
  return useQuery({
    queryKey,
    queryFn: async () => await getDrillMedia({ station_id: drill_id }),
    staleTime,
  });
};
