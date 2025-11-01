export type NetworkType = 'wifi' | 'cell' | 'none';

export interface HealthSample {
  id: string;
  ts: string;
  cpuPct: number;
  memMb: number;
  thermC: number;
  net: NetworkType;
  gpsFix: boolean;
  errors?: string;
}

export interface HealthStatusPill {
  label: string;
  ok: boolean;
  description: string;
}

export interface HealthStatus {
  pills: HealthStatusPill[];
  lastSample?: HealthSample;
}
