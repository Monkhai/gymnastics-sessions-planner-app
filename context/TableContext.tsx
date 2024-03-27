import { ListTable } from '@/Components/Lists/Types';
import { DeleteItemArgs, SecondaryTable, UpdateItemArgs } from '@/features/items/types';
import { createContext } from 'react';

type ContextProps = {
  table: ListTable;
  secondaryTable?: SecondaryTable;
  queryKey: string[];
  updateItem: (args: UpdateItemArgs) => void;
  deleteItem: (args: DeleteItemArgs) => void;
};

export const ListContext = createContext<ContextProps>({
  table: 'groups',
  secondaryTable: undefined,
  queryKey: ['groups'],
  updateItem: () => {},
  deleteItem: () => {},
});
