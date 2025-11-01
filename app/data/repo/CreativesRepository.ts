import { Database } from '../db/Database';
import { Creative, CreativeStatus } from '../../domain/models/Creative';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

const mapRow = (row: any): Creative => ({
  id: row.id,
  campaignId: row.campaign_id,
  mime: row.mime,
  durationSec: row.duration_sec,
  url: row.url,
  sha256: row.sha256,
  sizeBytes: row.size_bytes,
  status: row.status as CreativeStatus,
  localPath: row.local_path ?? undefined,
  ttlSec: row.ttl_sec,
  updatedAt: row.updated_at
});

export class CreativesRepository {
  constructor(private readonly database: Database) {}

  private async getDb(): Promise<SQLiteDatabase> {
    return this.database.open();
  }

  public async upsertCreative(creative: Creative): Promise<void> {
    const db = await this.getDb();
    await db.executeSql(
      `INSERT OR REPLACE INTO creative (
        id, campaign_id, mime, duration_sec, url, sha256, size_bytes, status, local_path, ttl_sec, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        creative.id,
        creative.campaignId,
        creative.mime,
        creative.durationSec,
        creative.url,
        creative.sha256,
        creative.sizeBytes,
        creative.status,
        creative.localPath ?? null,
        creative.ttlSec,
        creative.updatedAt
      ]
    );
  }

  public async listCreativesByStatus(status: CreativeStatus): Promise<Creative[]> {
    const db = await this.getDb();
    const result = await db.executeSql('SELECT * FROM creative WHERE status = ?;', [status]);
    const rows = result[0].rows;
    const creatives: Creative[] = [];
    for (let i = 0; i < rows.length; i += 1) {
      creatives.push(mapRow(rows.item(i)));
    }
    return creatives;
  }

  public async updateCreativeStatus(id: string, status: CreativeStatus, localPath?: string): Promise<void> {
    const db = await this.getDb();
    await db.executeSql('UPDATE creative SET status = ?, local_path = ?, updated_at = ? WHERE id = ?;', [
      status,
      localPath ?? null,
      new Date().toISOString(),
      id
    ]);
  }
}
