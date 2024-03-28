import { Dispatch, SetStateAction, createContext } from 'react';

type ContextArgs = {
  setGroupName: Dispatch<SetStateAction<string>>;
  group_id: string;
  setGroup_id: Dispatch<SetStateAction<string>>;
  setAthleteName: Dispatch<SetStateAction<string>>;
  setSessionName: Dispatch<SetStateAction<string>>;
};

export const GroupContext = createContext<ContextArgs>({
  setGroupName: () => {},
  group_id: '',
  setGroup_id: () => {},
  setAthleteName: () => {},
  setSessionName: () => {},
});
