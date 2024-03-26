import { staleTime } from '@/Constants/Randoms';
import { useQuery } from '@tanstack/react-query';
import getAthletes from './getAthletes';

type Args = {
  queryKey: string[];
  group_id: string;
};

const useGetAthletes = ({ queryKey, group_id }: Args) => {
  return useQuery({
    queryKey,
    queryFn: async () => await getAthletes({ group_id: Number(group_id) }),
    staleTime,
  });
};

export default useGetAthletes;
