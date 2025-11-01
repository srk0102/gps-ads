import { NativeModules, Platform } from 'react-native';
import { Logger } from '../../../core/logger/Logger';

export interface BatteryHints {
  thermC: number;
  batteryMv: number;
}

export class BatteryService {
  public async sample(): Promise<BatteryHints> {
    try {
      if (Platform.OS === 'android' && NativeModules.BatteryManager?.getBatteryTemperature) {
        const thermC = await NativeModules.BatteryManager.getBatteryTemperature();
        const batteryMv = await NativeModules.BatteryManager.getBatteryVoltage();
        return { thermC, batteryMv };
      }
    } catch (error) {
      Logger.warn('HEALTH', 'Battery service failed to query native module', { error });
    }

    Logger.warn('HEALTH', 'Battery service fallback values used');
    return {
      thermC: 0,
      batteryMv: 0
    };
  }
}
