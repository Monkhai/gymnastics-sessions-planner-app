import { Dispatch, SetStateAction, createContext } from 'react';

type ContextArgs = {
  setGroupName: Dispatch<SetStateAction<string>>;
};

export const GroupContext = createContext<ContextArgs>({
  setGroupName: () => {},
});
