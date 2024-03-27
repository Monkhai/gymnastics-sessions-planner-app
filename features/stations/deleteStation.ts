import deleteMultipleDrills from '../drills/deleteMultipleDrills';
import { DrillType } from '../drills/types';
import deleteItem from '../items/deleteItem';
import deleteMultipleSkills from '../skills/deleteMultipleSkills';
import { SkillType } from '../skills/types';
import { StationTypeType } from './types';

type Args = {
  station_id: number;
  childrenArray: SkillType[] | DrillType[];
  type: StationTypeType;
};

export default async ({ type, station_id, childrenArray }: Args) => {
  try {
    if (type === 'drillStation') {
      const drill_ids = childrenArray.map((drill) => drill.id);
      await deleteMultipleDrills({ drill_ids });
    } else {
      const skill_ids = childrenArray.map((skill) => skill.id);
      await deleteMultipleSkills({ skill_ids });
    }

    await deleteItem({ table: 'stations', item_id: station_id });
  } catch (error) {
    throw error;
  }
};
