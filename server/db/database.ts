import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { INITIAL_SOURCES, INITIAL_STORIES, INITIAL_SETTINGS } from '../../src/data/initialData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = Boolean(process.env.VERCEL);
const DATA_DIR = isVercel ? '/tmp/data' : path.resolve(__dirname, '../../data');
const DB_PATH = path.join(DATA_DIR, 'optimax.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');
const BUNDLED_DB_PATH = path.resolve(__dirname, '../../data/optimax.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In Vercel serverless environment, copy bundled seeded DB to /tmp if not yet present
if (isVercel && !fs.existsSync(DB_PATH) && fs.existsSync(BUNDLED_DB_PATH)) {
  try {
    fs.copyFileSync(BUNDLED_DB_PATH, DB_PATH);
  } catch (copyErr) {
    console.warn('[SQLite DB] Could not copy bundled DB to /tmp, will initialize freshly:', copyErr);
  }
}

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (dbInstance) return dbInstance;

  dbInstance = new DatabaseSync(DB_PATH);
  dbInstance.exec('PRAGMA foreign_keys = ON;');
  dbInstance.exec('PRAGMA journal_mode = WAL;');

  // Initialize Schema
  const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  dbInstance.exec(schemaSql);

  // Seed default data if empty
  seedInitialData(dbInstance);

  return dbInstance;
}

function seedInitialData(db: DatabaseSync) {
  // Check settings
  const checkSettings = db.prepare('SELECT COUNT(*) as count FROM settings').get() as { count: number };
  if (checkSettings.count === 0) {
    console.log('[SQLite DB] Seeding initial settings...');
    const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    for (const [key, val] of Object.entries(INITIAL_SETTINGS)) {
      insertSetting.run(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
    }
  }

  // Check sources
  const checkSources = db.prepare('SELECT COUNT(*) as count FROM sources').get() as { count: number };
  if (checkSources.count === 0) {
    console.log('[SQLite DB] Seeding initial HTA sources...');
    const insertSource = db.prepare(`
      INSERT INTO sources (id, organization, country, type, website, news_url, rss_url, topics, date_verified, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const src of INITIAL_SOURCES) {
      insertSource.run(
        src.id,
        src.organization,
        src.country,
        src.type,
        src.website,
        src.news_url,
        src.rss_url || '',
        src.topics,
        src.date_verified,
        src.active ? 1 : 0
      );
    }
  }

  // Check stories
  const checkStories = db.prepare('SELECT COUNT(*) as count FROM stories').get() as { count: number };
  if (checkStories.count === 0) {
    console.log('[SQLite DB] Seeding initial stories...');
    const insertStory = db.prepare(`
      INSERT INTO stories (
        id, status, format, template_style, organization, source_url,
        publication_date, event_date, announcement_status, supporting_evidence,
        relevance, post_text, hashtags, image_headline, image_subtitle,
        image_key_points, image_source_footer, alt_text, image_data_url,
        poll_data, carousel_slides, stat_figure, stat_label,
        comparison_left_title, comparison_left_points, comparison_right_title,
        comparison_right_points, scheduled_time, linkedin_post_id,
        created_at, published_at, reviewed_at, metrics
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?
      )
    `);

    for (const s of INITIAL_STORIES) {
      insertStory.run(
        s.id,
        s.status || 'pending',
        s.format || 'image',
        s.template_style || 'executive_navy',
        s.organization,
        s.source_url,
        s.publication_date,
        s.event_date || null,
        s.announcement_status || 'final_decision',
        s.supporting_evidence || '',
        s.relevance || '',
        s.post_text,
        JSON.stringify(s.hashtags || []),
        s.image_headline || '',
        s.image_subtitle || '',
        JSON.stringify(s.image_key_points || []),
        s.image_source_footer || '',
        s.alt_text || '',
        s.image_data_url || '',
        s.poll_data ? JSON.stringify(s.poll_data) : null,
        s.carousel_slides ? JSON.stringify(s.carousel_slides) : null,
        s.stat_figure || null,
        s.stat_label || null,
        s.comparison_left_title || null,
        s.comparison_left_points ? JSON.stringify(s.comparison_left_points) : null,
        s.comparison_right_title || null,
        s.comparison_right_points ? JSON.stringify(s.comparison_right_points) : null,
        s.scheduled_time || null,
        s.linkedin_post_id || null,
        s.created_at || new Date().toISOString(),
        s.published_at || null,
        s.reviewed_at || null,
        s.metrics ? JSON.stringify(s.metrics) : null
      );
    }
  }

  // Ensure default admin user exists
  const checkUser = db.prepare('SELECT COUNT(*) as count FROM users WHERE username = ?').get('admin') as { count: number };
  if (checkUser.count === 0) {
    const insertUser = db.prepare('INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)');
    insertUser.run('user-admin-1', 'admin', 'admin1234', 'admin');
  }
}

