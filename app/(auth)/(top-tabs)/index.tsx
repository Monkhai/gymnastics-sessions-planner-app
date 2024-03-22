import BaseView from '@/Components/GeneralComponents/BaseView';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
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

  const [items, setItems] = useState<ListItemType[]>([
    { order: 1, id: 2, name: 'hello' },
    { order: 2, id: 3, name: 'world' },
    { order: 3, id: 4, name: 'this' },
    { order: 4, id: 5, name: 'is' },
    { order: 5, id: 6, name: 'a' },
    { order: 6, id: 7, name: 'list' },
  ]);

  return (
    <BottomSheetModalProvider>
      <BaseView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <List items={items} setItems={setItems} />
      </BaseView>
    </BottomSheetModalProvider>
  );
};

export default index;
