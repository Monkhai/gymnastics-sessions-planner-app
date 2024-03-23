import BaseView from '@/Components/GeneralComponents/BaseView';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React, { useState } from 'react';

import List from '@/Components/Lists/List';
import { ListItemType } from '@/Components/Lists/Types';

const index = () => {
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
        <List items={items} areItemsLoading={false} error={null} />
      </BaseView>
    </BottomSheetModalProvider>
  );
};

export default index;
