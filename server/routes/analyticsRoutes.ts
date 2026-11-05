import { Router } from 'express';
import { StoryRepository } from '../db/storyRepository.ts';

export const analyticsRouter = Router();

analyticsRouter.get('/', (req, res) => {
  const allStories = StoryRepository.getAll();
  const publishedStories = allStories.filter((s) => s.status === 'published');

  let totalImpressions = 0;
  let totalClicks = 0;
  let totalReactions = 0;
  let totalComments = 0;
  let totalReposts = 0;

  publishedStories.forEach((s) => {
    if (s.metrics) {
      totalImpressions += s.metrics.impressions || 0;
      totalClicks += s.metrics.clicks || 0;
      totalReactions += s.metrics.reactions || 0;
      totalComments += s.metrics.comments || 0;
      totalReposts += s.metrics.reposts || 0;
    }
  });

  const totalInteractions = totalClicks + totalReactions + totalComments + totalReposts;
  const avgEngagementRate = totalImpressions > 0
    ? Number(((totalInteractions / totalImpressions) * 100).toFixed(2))
    : 0;

  // Breakdown by format
  const formatStats: Record<string, { count: number; impressions: number; reactions: number; clicks: number; avgEr: number }> = {
    image: { count: 0, impressions: 0, reactions: 0, clicks: 0, avgEr: 0 },
    carousel: { count: 0, impressions: 0, reactions: 0, clicks: 0, avgEr: 0 },
    poll: { count: 0, impressions: 0, reactions: 0, clicks: 0, avgEr: 0 },
    article_link: { count: 0, impressions: 0, reactions: 0, clicks: 0, avgEr: 0 },
    text_only: { count: 0, impressions: 0, reactions: 0, clicks: 0, avgEr: 0 },
  };

  publishedStories.forEach((s) => {
    const fmt = s.format || 'image';
    if (!formatStats[fmt]) {
      formatStats[fmt] = { count: 0, impressions: 0, reactions: 0, clicks: 0, avgEr: 0 };
    }
    formatStats[fmt].count += 1;
    if (s.metrics) {
      formatStats[fmt].impressions += s.metrics.impressions || 0;
      formatStats[fmt].reactions += s.metrics.reactions || 0;
      formatStats[fmt].clicks += s.metrics.clicks || 0;
    }
  });

  Object.keys(formatStats).forEach((fmt) => {
    const item = formatStats[fmt];
    const interactions = item.reactions + item.clicks;
    item.avgEr = item.impressions > 0 ? Number(((interactions / item.impressions) * 100).toFixed(2)) : 0;
  });

  // Breakdown by authority / organization
  const authorityStats: Record<string, { count: number; impressions: number; avgEr: number }> = {};
  publishedStories.forEach((s) => {
    const org = s.organization.split('(')[0].trim() || 'Other';
    if (!authorityStats[org]) {
      authorityStats[org] = { count: 0, impressions: 0, avgEr: 0 };
    }
    authorityStats[org].count += 1;
    if (s.metrics) {
      authorityStats[org].impressions += s.metrics.impressions || 0;
      authorityStats[org].avgEr += s.metrics.engagement_rate || 0;
    }
  });

  Object.keys(authorityStats).forEach((org) => {
    const item = authorityStats[org];
    item.avgEr = item.count > 0 ? Number((item.avgEr / item.count).toFixed(2)) : 0;
  });

  res.json({
    success: true,
    data: {
      overview: {
        total_published: publishedStories.length,
        total_pending: allStories.filter((s) => s.status === 'pending').length,
        total_approved: allStories.filter((s) => s.status === 'approved').length,
        total_impressions: totalImpressions,
        total_clicks: totalClicks,
        total_reactions: totalReactions,
        total_comments: totalComments,
        total_reposts: totalReposts,
        avg_engagement_rate: avgEngagementRate,
      },
      by_format: formatStats,
      by_authority: authorityStats,
      published_posts: publishedStories,
    },
  });
});

