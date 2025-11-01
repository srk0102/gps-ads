export interface Device {
  id: string;
  operatorId: string;
  class: string;
  firmwareVersion: string;
  calibrationHash: string;
  createdAt: string;
  updatedAt: string;
  token?: string;
}

export interface DeviceRegistrationRequest {
  deviceId: string;
  operatorId: string;
  class: string;
  firmwareVersion: string;
  calibrationHash: string;
  buildFingerprint: string;
}

export interface DeviceRegistrationResponse {
  ok: boolean;
  token: string;
  config: RemoteConfig;
  cdnBase: string;
}

export interface RemoteConfig {
  slotLenSec: number;
  motionIdleTimeoutMs: number;
  detectorConfMin: number;
  dwellMinSec: number;
  yawDegMax: number;
  pitchDegMax: number;
  brightnessMinMax: [number, number];
  thermalHotC: number;
  uploadMaxBatch: number;
  flags?: Record<string, boolean>;
  thresholds?: Record<string, number>;
}
