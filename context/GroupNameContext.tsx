import { Dispatch, SetStateAction, createContext } from 'react';

type ContextArgs = {
  setGroupName: Dispatch<SetStateAction<string>>;
};

export const GroupNameContext = createContext<ContextArgs>({
  setGroupName: () => {},
});
