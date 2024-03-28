import { staleTime } from '@/Constants/Randoms';
import { useQuery } from '@tanstack/react-query';
import getGroupSessions from './getSessions';
import { SessionJoinTable } from './types';

type Args = {
  queryKey: string[];
  parent_id: string;
  sessionTable: SessionJoinTable;
};

const useGetSessions = ({ queryKey, parent_id, sessionTable }: Args) => {
  return useQuery({
    queryKey,
    queryFn: async () => await getGroupSessions({ parent_id: Number(parent_id), sessionTable }),
    staleTime,
    retry: 3,
  });
};

export default useGetSessions;
