import { ListItemType, ListTable } from '@/Components/Lists/Types';
import updateItem from './updateListItem';
import { SecondaryTable } from './types';

type Args = {
  table: ListTable;
  items: ListItemType[];
  secondaryTable?: SecondaryTable;
};

export default async ({ items, table, secondaryTable }: Args) => {
  try {
    const updatedItems = Promise.all(
      items.map(async (item, index) => {
        const newItem = await updateItem({
          table,
          name: item.name,
          item_id: item.id,
          order: index + 1,
          secondaryTable: secondaryTable ? secondaryTable : undefined,
        });
        return newItem;
      })
    );

    return updatedItems;
  } catch (error) {
    throw error;
  }
};
