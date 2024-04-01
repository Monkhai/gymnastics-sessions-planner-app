import { staleTime } from '@/Constants/Randoms';
import { queryKeyFactory } from '@/utils/queryFactories';
import { useQuery } from '@tanstack/react-query';
import getSkills from './getSkills';

type Args = {
  session_id: string;
  station_id: string;
};

export default ({ session_id, station_id }: Args) => {
  const queryKey = queryKeyFactory.skills({ session_id, station_id });
  return useQuery({
    queryKey,
    queryFn: () => getSkills({ station_id }),
    staleTime,
  });
};
