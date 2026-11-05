-- SQLite Schema for Optimax LinkedIn Automation Studio

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  organization TEXT NOT NULL,
  country TEXT NOT NULL,
  type TEXT NOT NULL,
  website TEXT NOT NULL,
  news_url TEXT NOT NULL,
  rss_url TEXT,
  topics TEXT NOT NULL,
  date_verified TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'pending',
  format TEXT NOT NULL DEFAULT 'image',
  template_style TEXT NOT NULL DEFAULT 'executive_navy',
  organization TEXT NOT NULL,
  source_url TEXT NOT NULL,
  publication_date TEXT NOT NULL,
  event_date TEXT,
  announcement_status TEXT NOT NULL DEFAULT 'final_decision',
  supporting_evidence TEXT,
  relevance TEXT,
  post_text TEXT NOT NULL,
  hashtags TEXT NOT NULL,
  image_headline TEXT,
  image_subtitle TEXT,
  image_key_points TEXT,
  image_source_footer TEXT,
  alt_text TEXT,
  image_data_url TEXT,
  poll_data TEXT,
  carousel_slides TEXT,
  stat_figure TEXT,
  stat_label TEXT,
  comparison_left_title TEXT,
  comparison_left_points TEXT,
  comparison_right_title TEXT,
  comparison_right_points TEXT,
  scheduled_time TEXT,
  linkedin_post_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  published_at TEXT,
  reviewed_at TEXT,
  metrics TEXT
);

CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_scheduled_time ON stories(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_sources_active ON sources(active);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

