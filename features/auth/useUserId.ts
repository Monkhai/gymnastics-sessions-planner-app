import { secureStoreKey } from '@/Constants/supabaseSecureStoreKey';
import * as SecureStore from 'expo-secure-store';
const useUserId = () => {
  const data = SecureStore.getItem(secureStoreKey);
  if (!data) {
    throw new Error('User data not found');
  }
  const parsedData = JSON.parse(data);

  return parsedData.user.id;
};

export default useUserId;
