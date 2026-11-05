import { getDatabase } from './database.ts';
import { SourceRegisterItem } from '../../src/types/index.ts';

export class SourceRepository {
  static getAll(): SourceRegisterItem[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM sources ORDER BY organization ASC').all() as any[];
    return rows.map((r) => ({
      id: r.id,
      organization: r.organization,
      country: r.country,
      type: r.type,
      website: r.website,
      news_url: r.news_url,
      rss_url: r.rss_url || '',
      topics: r.topics,
      date_verified: r.date_verified,
      active: Boolean(r.active),
    }));
  }

  static getById(id: string): SourceRegisterItem | null {
    const db = getDatabase();
    const r = db.prepare('SELECT * FROM sources WHERE id = ?').get(id) as any;
    if (!r) return null;
    return {
      id: r.id,
      organization: r.organization,
      country: r.country,
      type: r.type,
      website: r.website,
      news_url: r.news_url,
      rss_url: r.rss_url || '',
      topics: r.topics,
      date_verified: r.date_verified,
      active: Boolean(r.active),
    };
  }

  static create(item: Omit<SourceRegisterItem, 'id'> & { id?: string }): SourceRegisterItem {
    const db = getDatabase();
    const id = item.id || `src-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO sources (id, organization, country, type, website, news_url, rss_url, topics, date_verified, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      item.organization,
      item.country,
      item.type,
      item.website,
      item.news_url,
      item.rss_url || '',
      item.topics,
      item.date_verified || new Date().toISOString().split('T')[0],
      item.active ? 1 : 0
    );
    return this.getById(id)!;
  }

  static update(id: string, partial: Partial<SourceRegisterItem>): SourceRegisterItem | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const merged = { ...existing, ...partial };
    const db = getDatabase();
    const stmt = db.prepare(`
      UPDATE sources
      SET organization = ?, country = ?, type = ?, website = ?, news_url = ?, rss_url = ?, topics = ?, date_verified = ?, active = ?, updated_at = datetime('now')
      WHERE id = ?
    `);
    stmt.run(
      merged.organization,
      merged.country,
      merged.type,
      merged.website,
      merged.news_url,
      merged.rss_url || '',
      merged.topics,
      merged.date_verified,
      merged.active ? 1 : 0,
      id
    );
    return this.getById(id);
  }

  static delete(id: string): boolean {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM sources WHERE id = ?');
    const res = stmt.run(id);
    return res.changes > 0;
  }
}

