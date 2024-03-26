import { staleTime } from '@/Constants/Randoms';
import { useQuery } from '@tanstack/react-query';
import getGroupSessions from './getSessions';
import { SessionJoinTable } from './types';

type Args = {
  queryKey: string[];
  group_id: string;
  joinTable: SessionJoinTable;
};

const useGetSessions = ({ queryKey, group_id, joinTable }: Args) => {
  return useQuery({
    queryKey,
    queryFn: async () => await getGroupSessions({ group_id: Number(group_id), joinTable }),
    staleTime,
  });
};

export default useGetSessions;
