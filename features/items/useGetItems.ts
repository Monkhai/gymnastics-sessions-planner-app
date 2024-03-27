import { queryKeyFactory } from '@/utils/queryFactories';
import { useQuery } from '@tanstack/react-query';
import getItems from './getItems';
import { staleTime } from '@/Constants/Randoms';
import { ListItemType, MainTable } from '@/Components/Lists/Types';

type Args = {
  table: MainTable;
  queryKey: string[];
};

const useGetItems = ({ table, queryKey }: Args) => {
  return useQuery({
    queryKey,
    queryFn: async () => await getItems<ListItemType[]>({ table }),
    staleTime,
  });
};

export default useGetItems;
