import { getDatabase } from './database.ts';
import { Story, PostMetrics, PostFormat, TemplateStyle, AnnouncementStatus, PostStatus, PollData, CarouselSlide } from '../../src/types/index.ts';

export class StoryRepository {
  private static mapRowToStory(r: any): Story {
    return {
      id: r.id,
      status: r.status as PostStatus,
      format: (r.format || 'image') as PostFormat,
      template_style: (r.template_style || 'executive_navy') as TemplateStyle,
      organization: r.organization,
      source_url: r.source_url,
      publication_date: r.publication_date,
      event_date: r.event_date || undefined,
      announcement_status: (r.announcement_status || 'final_decision') as AnnouncementStatus,
      supporting_evidence: r.supporting_evidence || '',
      relevance: r.relevance || '',
      post_text: r.post_text,
      hashtags: r.hashtags ? JSON.parse(r.hashtags) : [],
      image_headline: r.image_headline || '',
      image_subtitle: r.image_subtitle || '',
      image_key_points: r.image_key_points ? JSON.parse(r.image_key_points) : [],
      image_source_footer: r.image_source_footer || '',
      alt_text: r.alt_text || '',
      image_data_url: r.image_data_url || '',
      poll_data: r.poll_data ? JSON.parse(r.poll_data) : undefined,
      carousel_slides: r.carousel_slides ? JSON.parse(r.carousel_slides) : undefined,
      stat_figure: r.stat_figure || undefined,
      stat_label: r.stat_label || undefined,
      comparison_left_title: r.comparison_left_title || undefined,
      comparison_left_points: r.comparison_left_points ? JSON.parse(r.comparison_left_points) : undefined,
      comparison_right_title: r.comparison_right_title || undefined,
      comparison_right_points: r.comparison_right_points ? JSON.parse(r.comparison_right_points) : undefined,
      scheduled_time: r.scheduled_time || undefined,
      linkedin_post_id: r.linkedin_post_id || undefined,
      created_at: r.created_at,
      published_at: r.published_at || undefined,
      reviewed_at: r.reviewed_at || undefined,
      metrics: r.metrics ? JSON.parse(r.metrics) : undefined,
    };
  }

  static getAll(): Story[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM stories ORDER BY created_at DESC').all() as any[];
    return rows.map(this.mapRowToStory);
  }

  static getById(id: string): Story | null {
    const db = getDatabase();
    const r = db.prepare('SELECT * FROM stories WHERE id = ?').get(id) as any;
    if (!r) return null;
    return this.mapRowToStory(r);
  }

  static create(story: Partial<Story>): Story {
    const db = getDatabase();
    const id = story.id || `story-${Date.now()}`;
    const stmt = db.prepare(`
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

    stmt.run(
      id,
      story.status || 'pending',
      story.format || 'image',
      story.template_style || 'executive_navy',
      story.organization || 'HTA Authority',
      story.source_url || 'https://',
      story.publication_date || new Date().toISOString().split('T')[0],
      story.event_date || null,
      story.announcement_status || 'final_decision',
      story.supporting_evidence || '',
      story.relevance || '',
      story.post_text || '',
      JSON.stringify(story.hashtags || ['MarketAccess', 'HTA']),
      story.image_headline || '',
      story.image_subtitle || '',
      JSON.stringify(story.image_key_points || []),
      story.image_source_footer || '',
      story.alt_text || '',
      story.image_data_url || '',
      story.poll_data ? JSON.stringify(story.poll_data) : null,
      story.carousel_slides ? JSON.stringify(story.carousel_slides) : null,
      story.stat_figure || null,
      story.stat_label || null,
      story.comparison_left_title || null,
      story.comparison_left_points ? JSON.stringify(story.comparison_left_points) : null,
      story.comparison_right_title || null,
      story.comparison_right_points ? JSON.stringify(story.comparison_right_points) : null,
      story.scheduled_time || null,
      story.linkedin_post_id || null,
      story.created_at || new Date().toISOString(),
      story.published_at || null,
      story.reviewed_at || null,
      story.metrics ? JSON.stringify(story.metrics) : null
    );

    return this.getById(id)!;
  }

  static update(id: string, partial: Partial<Story>): Story | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const merged = { ...existing, ...partial };
    const db = getDatabase();
    const stmt = db.prepare(`
      UPDATE stories SET
        status = ?, format = ?, template_style = ?, organization = ?, source_url = ?,
        publication_date = ?, event_date = ?, announcement_status = ?, supporting_evidence = ?,
        relevance = ?, post_text = ?, hashtags = ?, image_headline = ?, image_subtitle = ?,
        image_key_points = ?, image_source_footer = ?, alt_text = ?, image_data_url = ?,
        poll_data = ?, carousel_slides = ?, stat_figure = ?, stat_label = ?,
        comparison_left_title = ?, comparison_left_points = ?, comparison_right_title = ?,
        comparison_right_points = ?, scheduled_time = ?, linkedin_post_id = ?,
        published_at = ?, reviewed_at = ?, metrics = ?
      WHERE id = ?
    `);

    (stmt.run as any)(
      merged.status,
      merged.format,
      merged.template_style,
      merged.organization,
      merged.source_url,
      merged.publication_date,
      merged.event_date || null,
      merged.announcement_status,
      merged.supporting_evidence,
      merged.relevance,
      merged.post_text,
      JSON.stringify(merged.hashtags || []),
      merged.image_headline,
      merged.image_subtitle,
      JSON.stringify(merged.image_key_points || []),
      merged.image_source_footer,
      merged.alt_text,
      merged.image_data_url,
      merged.poll_data ? JSON.stringify(merged.poll_data) : null,
      merged.carousel_slides ? JSON.stringify(merged.carousel_slides) : null,
      merged.stat_figure || null,
      merged.stat_label || null,
      merged.comparison_left_title || null,
      merged.comparison_left_points ? JSON.stringify(merged.comparison_left_points) : null,
      merged.comparison_right_title || null,
      merged.comparison_right_points ? JSON.stringify(merged.comparison_right_points) : null,
      merged.scheduled_time || null,
      merged.linkedin_post_id || null,
      merged.published_at || null,
      merged.reviewed_at || null,
      merged.metrics ? JSON.stringify(merged.metrics) : null,
      id
    );

    return this.getById(id);
  }

  static delete(id: string): boolean {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM stories WHERE id = ?');
    const res = stmt.run(id);
    return res.changes > 0;
  }

  static updateMetrics(id: string, metrics: Partial<PostMetrics>): Story | null {
    const story = this.getById(id);
    if (!story) return null;

    const imp = Math.max(0, parseInt(String(metrics.impressions ?? 0), 10) || 0);
    const clk = Math.max(0, parseInt(String(metrics.clicks ?? 0), 10) || 0);
    const rct = Math.max(0, parseInt(String(metrics.reactions ?? 0), 10) || 0);
    const cmt = Math.max(0, parseInt(String(metrics.comments ?? 0), 10) || 0);
    const rep = Math.max(0, parseInt(String(metrics.reposts ?? 0), 10) || 0);
    const totalInteractions = clk + rct + cmt + rep;
    const er = imp > 0 ? Number(((totalInteractions / imp) * 100).toFixed(2)) : 0;

    const updatedMetrics: PostMetrics = {
      impressions: imp,
      clicks: clk,
      reactions: rct,
      comments: cmt,
      reposts: rep,
      engagement_rate: er,
      recorded_at: new Date().toISOString(),
    };

    return this.update(id, { metrics: updatedMetrics });
  }

  static recordPollVote(id: string, optionId: string): Story | null {
    const story = this.getById(id);
    if (!story || !story.poll_data) return null;

    const pollData: PollData = { ...story.poll_data };
    const opt = pollData.options.find((o) => o.id === optionId);
    if (opt) {
      opt.votes = (opt.votes || 0) + 1;
      pollData.total_votes = (pollData.total_votes || 0) + 1;
      pollData.user_voted_option_id = optionId;
      return this.update(id, { poll_data: pollData });
    }
    return story;
  }

  static getDueScheduledStories(): Story[] {
    const db = getDatabase();
    const nowIso = new Date().toISOString();
    const rows = db.prepare(`
      SELECT * FROM stories 
      WHERE status = 'approved' 
        AND scheduled_time IS NOT NULL 
        AND scheduled_time <= ?
    `).all(nowIso) as any[];
    return rows.map(this.mapRowToStory);
  }
}
