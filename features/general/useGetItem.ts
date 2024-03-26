import { MainTable } from '@/Components/Lists/Types';
import { useQuery } from '@tanstack/react-query';
import getItem from './getItem';
import { staleTime } from '@/Constants/Randoms';

type Args = {
  item_id: number;
  queryKey: string[];
  table: MainTable;
};

const useGetItem = <T>({ item_id, queryKey, table }: Args) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      return await getItem<T>({ item_id, table });
    },
    staleTime,
  });
};

export default useGetItem;
