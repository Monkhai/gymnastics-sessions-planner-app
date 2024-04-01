import { useQuery } from '@tanstack/react-query';
import getStations from './getStations';
import { staleTime } from '@/Constants/Randoms';

type Args = {
  queryKey: string[];
  session_id: string;
};

const useGetStations = ({ queryKey, session_id }: Args) => {
  return useQuery({
    queryKey,
    queryFn: async () => await getStations({ session_id }),
    staleTime,
  });
};

export default useGetStations;
