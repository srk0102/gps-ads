import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({ id: 'gps-ads-storage' });

export const setJSON = (key: string, value: unknown): void => {
  storage.set(key, JSON.stringify(value));
};

export const getJSON = <T>(key: string): T | undefined => {
  const value = storage.getString(key);
  if (!value) {
    return undefined;
  }
  return JSON.parse(value) as T;
};
