import { staleTime } from '@/Constants/Randoms';
import { useQuery } from '@tanstack/react-query';
import getDrills from './getDrills';

type Args = {
  queryKey: string[];
  station_id: number;
};

const useGetDrills = ({ queryKey, station_id }: Args) => {
  return useQuery({
    queryKey,
    queryFn: async () => await getDrills({ station_id }),
    staleTime,
    retry: 3,
  });
};

export default useGetDrills;
