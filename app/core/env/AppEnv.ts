import Config from 'react-native-config';

export interface AppEnv {
  baseUrl: string;
  cdnBase: string;
  deviceId: string;
  slotLenSec: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export const getAppEnv = (): AppEnv => ({
  baseUrl: Config.BASE_URL,
  cdnBase: Config.CDN_BASE,
  deviceId: Config.DEVICE_ID ?? 'UNKNOWN',
  slotLenSec: Number(Config.SLOT_LEN_SEC ?? 10),
  logLevel: (Config.LOG_LEVEL ?? 'info') as AppEnv['logLevel']
});
