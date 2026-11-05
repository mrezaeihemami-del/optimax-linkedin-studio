import { Router } from 'express';
import { SourceRepository } from '../db/sourceRepository.ts';

export const sourcesRouter = Router();

sourcesRouter.get('/', (req, res) => {
  const sources = SourceRepository.getAll();
  res.json({ success: true, data: sources });
});

sourcesRouter.post('/', (req, res) => {
  const created = SourceRepository.create(req.body);
  res.json({ success: true, data: created });
});

sourcesRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  const updated = SourceRepository.update(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Source not found' });
  }
  res.json({ success: true, data: updated });
});

sourcesRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  const success = SourceRepository.delete(id);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Source not found' });
  }
  res.json({ success: true, message: 'Source deleted' });
});

