import { Router } from 'express';
import { StoryRepository } from '../db/storyRepository.ts';
import { executeMultiAgentGeneration } from '../services/geminiService.ts';

export const storiesRouter = Router();

storiesRouter.get('/', (req, res) => {
  const stories = StoryRepository.getAll();
  res.json({ success: true, data: stories });
});

storiesRouter.post('/', (req, res) => {
  const created = StoryRepository.create(req.body);
  res.json({ success: true, data: created });
});

storiesRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  const updated = StoryRepository.update(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Story not found' });
  }
  res.json({ success: true, data: updated });
});

storiesRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  const success = StoryRepository.delete(id);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Story not found' });
  }
  res.json({ success: true, message: 'Story deleted' });
});

// Update story performance metrics
storiesRouter.put('/:id/metrics', (req, res) => {
  const { id } = req.params;
  const updated = StoryRepository.updateMetrics(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Story not found' });
  }
  res.json({ success: true, data: updated });
});

// Interactive poll voting endpoint
storiesRouter.post('/:id/poll-vote', (req, res) => {
  const { id } = req.params;
  const { optionId } = req.body;
  if (!optionId) {
    return res.status(400).json({ success: false, error: 'optionId is required' });
  }
  const updated = StoryRepository.recordPollVote(id, optionId);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Story not found or does not have poll data' });
  }
  res.json({ success: true, data: updated });
});

// AI Research & Draft Generation Endpoint (Agent Chaining Engine)
storiesRouter.post('/generate-post', async (req, res) => {
  try {
    const generatedDraft = await executeMultiAgentGeneration(req.body);
    const createdStory = StoryRepository.create(generatedDraft);
    res.json({ success: true, data: createdStory });
  } catch (err: any) {
    console.error('Error generating post:', err);
    res.status(500).json({ success: false, error: err.message || 'Generation failed' });
  }
});

