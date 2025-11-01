import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export interface AttestationPayload {
  deviceId: string;
  buildFingerprint: string;
  platform: string;
  osVersion: string;
}

export class AttestationService {
  public async collect(): Promise<AttestationPayload> {
    return {
      deviceId: await DeviceInfo.getUniqueId(),
      buildFingerprint: Platform.OS === 'android' ? await DeviceInfo.getFingerprint() : 'ios',
      platform: Platform.OS,
      osVersion: DeviceInfo.getSystemVersion()
    };
  }
}
