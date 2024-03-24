import { ListQueryKeyFactoryKeys, ListTable, MainTable } from '@/Components/Lists/Types';
import { createContext } from 'react';

type ContextProps = {
  table: ListTable;
  queryKey: string[];
};

export const TableContext = createContext<ContextProps>({
  table: 'groups',
  queryKey: ['groups'],
});
