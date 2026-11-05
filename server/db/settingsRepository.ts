import { getDatabase } from './database.ts';
import { AppSettings } from '../../src/types/index.ts';
import { INITIAL_SETTINGS } from '../../src/data/initialData.ts';

export class SettingsRepository {
  static getSettings(): AppSettings {
    const db = getDatabase();
    const rows = db.prepare('SELECT key, value FROM settings').all() as Array<{ key: string; value: string }>;
    
    if (rows.length === 0) {
      return INITIAL_SETTINGS;
    }

    const settingsObj: Record<string, any> = {};
    for (const r of rows) {
      try {
        settingsObj[r.key] = JSON.parse(r.value);
      } catch {
        settingsObj[r.key] = r.value;
      }
    }

    return {
      ...INITIAL_SETTINGS,
      ...settingsObj,
    } as AppSettings;
  }

  static updateSettings(partial: Partial<AppSettings>): AppSettings {
    const db = getDatabase();
    const updateStmt = db.prepare(`
      INSERT INTO settings (key, value, updated_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = datetime('now')
    `);

    for (const [key, val] of Object.entries(partial)) {
      if (val !== undefined) {
        updateStmt.run(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
      }
    }

    return this.getSettings();
  }

  static getSettingByKey<T = any>(key: string): T | null {
    const db = getDatabase();
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
    if (!row) return null;
    try {
      return JSON.parse(row.value) as T;
    } catch {
      return row.value as unknown as T;
    }
  }
}

