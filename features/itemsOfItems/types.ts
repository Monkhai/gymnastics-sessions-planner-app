import { MainTable } from '@/Components/Lists/Types';
import { SecondaryTable } from '../general/types';

export interface CreateItemOfItemArgs {
  mainTable: MainTable;
  secondaryTable: SecondaryTable;
  name: string;
  lastOrder: number;
  parentItemId: number;
}

export interface UpdateItemOfItemArgs {
  mainTable: MainTable;
  secondaryTable: SecondaryTable;
  item_id: number;
  name: string;
  order: number;
}

export interface deleteItemOfItemArgs {
  mainTable: MainTable;
  secondaryTable: SecondaryTable;
  item_id: number;
}

export interface CRUDItemOfItemArgs {
  updateFn: (args: UpdateItemOfItemArgs) => void;
  deleteFn: (args: deleteItemOfItemArgs) => void;
}
