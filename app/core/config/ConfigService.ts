import axios from 'axios';
import Config from 'react-native-config';
import { DeviceRegistrationRequest, RemoteConfig } from '../../domain/models/Device';
import { getJSON, setJSON } from '../../data/kv/AppStorage';
import { Logger } from '../logger/Logger';

const CONFIG_KEY = 'remote-config';

const DEFAULT_CONFIG: RemoteConfig = {
  slotLenSec: Number(Config.SLOT_LEN_SEC ?? 10),
  motionIdleTimeoutMs: 3000,
  detectorConfMin: 0.6,
  dwellMinSec: 1.5,
  yawDegMax: 25,
  pitchDegMax: 20,
  brightnessMinMax: [40, 220],
  thermalHotC: 80,
  uploadMaxBatch: 50,
  flags: {},
  thresholds: {}
};

const mapRemoteConfig = (input: any): RemoteConfig => ({
  slotLenSec: input?.slot_len_sec ?? input?.slotLenSec ?? DEFAULT_CONFIG.slotLenSec,
  motionIdleTimeoutMs:
    input?.motion_idle_timeout_ms ?? input?.motionIdleTimeoutMs ?? DEFAULT_CONFIG.motionIdleTimeoutMs,
  detectorConfMin: input?.detector_conf_min ?? input?.detectorConfMin ?? DEFAULT_CONFIG.detectorConfMin,
  dwellMinSec: input?.dwell_min_sec ?? input?.dwellMinSec ?? DEFAULT_CONFIG.dwellMinSec,
  yawDegMax: input?.yaw_deg_max ?? input?.yawDegMax ?? DEFAULT_CONFIG.yawDegMax,
  pitchDegMax: input?.pitch_deg_max ?? input?.pitchDegMax ?? DEFAULT_CONFIG.pitchDegMax,
  brightnessMinMax:
    input?.brightness_min_max ?? input?.brightnessMinMax ?? DEFAULT_CONFIG.brightnessMinMax,
  thermalHotC: input?.thermal_hot_c ?? input?.thermalHotC ?? DEFAULT_CONFIG.thermalHotC,
  uploadMaxBatch: input?.upload_max_batch ?? input?.uploadMaxBatch ?? DEFAULT_CONFIG.uploadMaxBatch,
  flags: input?.flags ?? DEFAULT_CONFIG.flags,
  thresholds: input?.thresholds ?? DEFAULT_CONFIG.thresholds
});

export class ConfigService {
  private current: RemoteConfig = this.loadConfig();

  private loadConfig(): RemoteConfig {
    return getJSON<RemoteConfig>(CONFIG_KEY) ?? DEFAULT_CONFIG;
  }

  public getConfig(): RemoteConfig {
    return this.current;
  }

  public async refresh(registration: DeviceRegistrationRequest): Promise<RemoteConfig> {
    try {
      const response = await axios.post(`${Config.BASE_URL}/v1/device/register`, {
        device_id: registration.deviceId,
        operator_id: registration.operatorId,
        class: registration.class,
        fw: registration.firmwareVersion,
        calib_hash: registration.calibrationHash,
        build_fingerprint: registration.buildFingerprint
      });
      if (response.data?.config) {
        this.current = mapRemoteConfig(response.data.config);
        setJSON(CONFIG_KEY, this.current);
        Logger.info('CONFIG', 'Remote config refreshed', { config: this.current });
      }
    } catch (error) {
      Logger.warn('CONFIG', 'Failed to refresh config', { error });
    }
    return this.current;
  }
}

export const configService = new ConfigService();
