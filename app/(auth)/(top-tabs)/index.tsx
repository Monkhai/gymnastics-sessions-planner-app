import BaseView from '@/Components/GeneralComponents/BaseView';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import { ScreenContext } from './_layout';

import List from '@/Components/Lists/List';
import { ListItemType } from '@/Components/Lists/Types';

const index = () => {
  const { setScreen } = useContext(ScreenContext);

  const isScreenFocused = useIsFocused();

  useEffect(() => {
    if (isScreenFocused) {
      setScreen('index');
    }
  }, [isScreenFocused]);

  const item: ListItemType = { id: 1, name: 'hello' };

  const items: ListItemType[] = [
    { id: 1, name: 'hello' },
    { id: 2, name: 'world' },
  ];

  return (
    <BottomSheetModalProvider>
      <BaseView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <List items={items} />
      </BaseView>
    </BottomSheetModalProvider>
  );
};

export default index;
