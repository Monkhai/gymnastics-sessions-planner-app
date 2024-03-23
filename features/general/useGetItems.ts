import { queryKeyFactory } from '@/utils/queryFactories';
import { useQuery } from '@tanstack/react-query';
import getItems, { Table } from './getItems';
import { staleTime } from '@/Constants/Randoms';
import { ListItemType } from '@/Components/Lists/Types';

type Args = {
  table: Table;
};

const useGetItems = ({ table }: Args) => {
  const queryKey = queryKeyFactory.groups();

  return useQuery({
    queryKey,
    queryFn: async () => await getItems<ListItemType[]>({ table }),
    staleTime,
  });
};

export default useGetItems;
