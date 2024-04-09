import { staleTime } from '@/Constants/Randoms';
import { queryKeyFactory } from '@/utils/queryFactories';
import { useQuery } from '@tanstack/react-query';
import getSkills from './getSkills';

type Args = {
  station_id: string;
  queryKey: string[];
};

export default ({ queryKey, station_id }: Args) => {
  return useQuery({
    queryKey,
    queryFn: async () => await getSkills({ station_id }),
    staleTime,
  });
};
