import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { Database } from '../db/Database';
import { SlotPlan } from '../../domain/models/Slot';
import { Logger } from '../../core/logger/Logger';

export class SlotsRepository {
  constructor(private readonly database: Database) {}

  private async getDb(): Promise<SQLiteDatabase> {
    return this.database.open();
  }

  public async insertSlotPlan(plan: SlotPlan): Promise<void> {
    const db = await this.getDb();
    await db.executeSql(
      `INSERT INTO slot_plan (
        id, ad_id, campaign_id, slot_start, slot_len_sec, decision_token, h3, lat, lon, source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        plan.id,
        plan.adId,
        plan.campaignId,
        plan.slotStart,
        plan.slotLenSec,
        plan.decisionToken,
        plan.h3,
        plan.lat,
        plan.lon,
        plan.source
      ]
    );
  }

  public async getLastSlotPlan(): Promise<SlotPlan | null> {
    const db = await this.getDb();
    const result = await db.executeSql(
      'SELECT * FROM slot_plan ORDER BY slot_start DESC LIMIT 1;'
    );
    const rows = result[0].rows;
    if (rows.length === 0) {
      return null;
    }
    const row = rows.item(0);
    return {
      id: row.id,
      adId: row.ad_id,
      campaignId: row.campaign_id,
      slotStart: row.slot_start,
      slotLenSec: row.slot_len_sec,
      decisionToken: row.decision_token,
      h3: row.h3,
      lat: row.lat,
      lon: row.lon,
      source: row.source
    };
  }

  public async recordSlotScheduled(plan: SlotPlan, pricePerSlot: number): Promise<void> {
    Logger.info('DECISION', 'Slot scheduled', {
      slotId: plan.id,
      pricePerSlot
    });
  }
}
