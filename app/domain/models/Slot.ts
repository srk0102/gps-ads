export type SlotSource = 'decided' | 'fallback';
export type SlotEventType = 'start' | 'q1' | 'q2' | 'q3' | 'complete' | 'error';
export type SlotSyncState = 'pending' | 'sent' | 'acked';

export interface SlotPlan {
  id: string;
  adId: string;
  campaignId: string;
  slotStart: string;
  slotLenSec: number;
  decisionToken: string;
  h3: string;
  lat: number;
  lon: number;
  source: SlotSource;
}

export interface SlotEventVisionStats {
  framesProcessed: number;
  framesSkipped: number;
  facesSeen: number;
  avgDwellSec: number;
  lightingOkRatio: number;
  medianDistanceM: number;
  confAvg: number;
}

export interface SlotEventSystemStats {
  sysFps: number;
  thermC: number;
  batteryMv: number;
}

export interface SlotEventRecord {
  id: string;
  slotId: string;
  event: SlotEventType;
  ts: string;
  lat: number;
  lon: number;
  h3: string;
  speedMps: number;
  vision: SlotEventVisionStats;
  system: SlotEventSystemStats;
  syncState: SlotSyncState;
  retryCount: number;
}

export interface SlotSummary {
  totalSlots: number;
  completedSlots: number;
  facesDetected: number;
  averageDwellSec: number;
}
