import express from 'express';
import dotenv from 'dotenv';
import { getDatabase } from './db/database.ts';
import { authRouter } from './routes/authRoutes.ts';
import { settingsRouter } from './routes/settingsRoutes.ts';
import { sourcesRouter } from './routes/sourcesRoutes.ts';
import { storiesRouter } from './routes/storiesRoutes.ts';
import { analyticsRouter } from './routes/analyticsRoutes.ts';
import { linkedinRouter } from './routes/linkedinRoutes.ts';

dotenv.config();

export const app = express();

app.use(express.json({ limit: '25mb' }));

// Initialize SQLite Database
getDatabase();

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/sources', sourcesRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/linkedin', linkedinRouter);

// Backward Compatibility Aliases for Frontend
app.post('/api/generate-post', (req, res, next) => {
  req.url = '/generate-post';
  storiesRouter(req, res, next);
});

app.post('/api/publish-linkedin', (req, res, next) => {
  req.url = '/publish';
  linkedinRouter(req, res, next);
});

app.post('/api/test-connection', (req, res, next) => {
  req.url = '/test-connection';
  settingsRouter(req, res, next);
});

// Vercel Cron Endpoint for scheduled posting
app.get('/api/cron/scheduled-posts', async (req, res) => {
  try {
    const { StoryRepository } = await import('./db/storyRepository.ts');
    const { publishStoryToLinkedIn } = await import('./services/linkedinService.ts');
    const dueStories = StoryRepository.getDueScheduledStories();
    const published = [];

    for (const story of dueStories) {
      try {
        const r = await publishStoryToLinkedIn(story.id);
        published.push({ id: story.id, result: r });
      } catch (err: any) {
        published.push({ id: story.id, error: err.message });
      }
    }

    res.json({ success: true, processed: published.length, results: published });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default app;
