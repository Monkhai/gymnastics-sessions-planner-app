import { ListItemType, ListTable, MainTable } from '@/Components/Lists/Types';
import updateItem from './updateListItem';
import { SecondaryTable } from './types';
import { StationType } from '../stations/types';
import { SkillType } from '../skills/types';
import { DrillType } from '../drills/types';

type Args = {
  table: MainTable;
  items: ListItemType[] | StationType[] | SkillType[] | DrillType[];
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
