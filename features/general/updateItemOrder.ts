import { ListItemType, ListTable } from '@/Components/Lists/Types';
import updateItem from './updateItem';

type Args = {
  table: ListTable;
  items: ListItemType[];
};

export default async ({ items, table }: Args) => {
  try {
    const updatedItems = Promise.all(
      items.map(async (item, index) => {
        const newItem = await updateItem({ table, name: item.name, item_id: item.id, order: index + 1 });
        return newItem;
      })
    );

    return updatedItems;
  } catch (error) {
    throw error;
  }
};
