import { Router } from 'express';
import { detectLinkedInIdentity, publishStoryToLinkedIn } from '../services/linkedinService.ts';

export const linkedinRouter = Router();

// Auto-detect identity from access token
linkedinRouter.get('/detect-identity', async (req, res) => {
  try {
    const token = req.query.token as string | undefined;
    const identity = await detectLinkedInIdentity(token);
    res.json({ success: true, data: identity });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Detection failed' });
  }
});

// Publish story directly or simulated
linkedinRouter.post('/publish', async (req, res) => {
  try {
    const { storyId, forceSimulate = false } = req.body;
    if (!storyId) {
      return res.status(400).json({ success: false, error: 'storyId is required' });
    }
    const result = await publishStoryToLinkedIn(storyId, forceSimulate);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Publishing error' });
  }
});

