import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { Database } from '../db/Database';
import { SlotEventRecord } from '../../domain/models/Slot';

const mapRow = (row: any): SlotEventRecord => ({
  id: row.id,
  slotId: row.slot_id,
  event: row.event,
  ts: row.ts,
  lat: row.lat,
  lon: row.lon,
  h3: row.h3,
  speedMps: row.speed_mps,
  vision: {
    framesProcessed: row.frames_processed,
    framesSkipped: row.frames_skipped,
    facesSeen: row.faces_seen,
    avgDwellSec: row.avg_dwell_sec,
    lightingOkRatio: row.lighting_ok_ratio,
    medianDistanceM: row.median_distance_m,
    confAvg: row.conf_avg
  },
  system: {
    sysFps: row.sys_fps,
    thermC: row.therm_c,
    batteryMv: row.battery_mv
  },
  syncState: row.sync_state,
  retryCount: row.retry_count
});

export class EventsRepository {
  constructor(private readonly database: Database) {}

  private async getDb(): Promise<SQLiteDatabase> {
    return this.database.open();
  }

  public async insertEvent(event: SlotEventRecord): Promise<void> {
    const db = await this.getDb();
    await db.executeSql(
      `INSERT INTO slot_event (
        id, slot_id, event, ts, lat, lon, h3, speed_mps, frames_processed, frames_skipped, faces_seen,
        avg_dwell_sec, lighting_ok_ratio, median_distance_m, conf_avg, sys_fps, therm_c, battery_mv,
        sync_state, retry_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        event.id,
        event.slotId,
        event.event,
        event.ts,
        event.lat,
        event.lon,
        event.h3,
        event.speedMps,
        event.vision.framesProcessed,
        event.vision.framesSkipped,
        event.vision.facesSeen,
        event.vision.avgDwellSec,
        event.vision.lightingOkRatio,
        event.vision.medianDistanceM,
        event.vision.confAvg,
        event.system.sysFps,
        event.system.thermC,
        event.system.batteryMv,
        event.syncState,
        event.retryCount
      ]
    );
  }

  public async listPendingEvents(limit: number): Promise<SlotEventRecord[]> {
    const db = await this.getDb();
    const result = await db.executeSql(
      'SELECT * FROM slot_event WHERE sync_state = ? ORDER BY ts ASC LIMIT ?;',
      ['pending', limit]
    );
    const rows = result[0].rows;
    const events: SlotEventRecord[] = [];
    for (let i = 0; i < rows.length; i += 1) {
      events.push(mapRow(rows.item(i)));
    }
    return events;
  }

  public async markEventsSynced(ids: string[]): Promise<void> {
    if (ids.length === 0) {
      return;
    }
    const db = await this.getDb();
    const placeholders = ids.map(() => '?').join(',');
    await db.executeSql(
      `UPDATE slot_event SET sync_state = 'acked', retry_count = 0 WHERE id IN (${placeholders});`,
      ids
    );
  }

  public async incrementRetry(id: string, nextState: 'pending' | 'failed'): Promise<void> {
    const db = await this.getDb();
    const targetState = nextState === 'pending' ? 'pending' : 'failed';
    await db.executeSql(
      'UPDATE slot_event SET retry_count = retry_count + 1, sync_state = ? WHERE id = ?;',
      [targetState, id]
    );
  }
}
