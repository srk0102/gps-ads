import axios, { AxiosInstance } from 'axios';
import Config from 'react-native-config';
import { EventsRepository } from '../repo/EventsRepository';
import { SlotEventRecord } from '../../domain/models/Slot';
import { RemoteConfig } from '../../domain/models/Device';

export interface SyncOutboxItem {
  id: string;
  endpoint: string;
  payload: unknown;
  attempts: number;
  status: 'pending' | 'sent' | 'failed';
  lastAttempt?: string;
  error?: string;
}

export class SyncOutboxWorker {
  private readonly client: AxiosInstance;
  private isRunning = false;

  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly config: RemoteConfig
  ) {
    this.client = axios.create({
      baseURL: Config.BASE_URL,
      timeout: 10000
    });
  }

  public async pump(): Promise<void> {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;

    let pending: SlotEventRecord[] = [];

    try {
      pending = await this.eventsRepository.listPendingEvents(this.config.uploadMaxBatch);
      if (pending.length === 0) {
        return;
      }

      const payload = {
        device_id: Config.DEVICE_ID,
        batch: pending.map((event) => this.mapEvent(event))
      };

      const response = await this.client.post('/v1/track', payload);
      if (response.data?.acks) {
        await this.eventsRepository.markEventsSynced(response.data.acks);
      }
    } catch (error) {
      for (const event of pending) {
        await this.eventsRepository.incrementRetry(event.id, 'pending');
      }
      console.warn('Sync failure', error);
    } finally {
      this.isRunning = false;
    }
  }

  private mapEvent(event: SlotEventRecord): Record<string, unknown> {
    return {
      id: event.id,
      slot_id: event.slotId,
      event: event.event,
      ts: event.ts,
      lat: event.lat,
      lon: event.lon,
      h3: event.h3,
      speed_mps: event.speedMps,
      frames_processed: event.vision.framesProcessed,
      frames_skipped: event.vision.framesSkipped,
      faces_seen: event.vision.facesSeen,
      avg_dwell_sec: event.vision.avgDwellSec,
      lighting_ok_ratio: event.vision.lightingOkRatio,
      median_distance_m: event.vision.medianDistanceM,
      conf_avg: event.vision.confAvg,
      sys_fps: event.system.sysFps,
      therm_c: event.system.thermC,
      battery_mv: event.system.batteryMv,
      sync_state: event.syncState,
      retry_count: event.retryCount
    };
  }
}
