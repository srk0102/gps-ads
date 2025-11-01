import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { CREATE_TABLES_SQL, SCHEMA_VERSION } from './schema';

SQLite.enablePromise(true);

export class Database {
  private db?: SQLiteDatabase;

  public async open(): Promise<SQLiteDatabase> {
    if (this.db) {
      return this.db;
    }

    this.db = await SQLite.openDatabase({
      name: 'gps_ads.db',
      location: 'default'
    });

    for (const sql of CREATE_TABLES_SQL) {
      await this.db.executeSql(sql);
    }
    await this.db.executeSql('PRAGMA user_version = ?;', [SCHEMA_VERSION]);

    return this.db;
  }

  public async close(): Promise<void> {
    if (!this.db) {
      return;
    }
    await this.db.close();
    this.db = undefined;
  }
}
