import { Router } from 'express';
import { getSessionUsage, getAllSessions } from '../services/cost.tracker.js';

export const costRouter = Router();

// GET /api/v1/cost — toutes les sessions
costRouter.get('/', (_req, res) => {
  const sessions = getAllSessions();
  const totalCostUSD = sessions.reduce((sum, s) => sum + s.costUSD, 0);
  res.json({ sessions, totalCostUSD });
});

// GET /api/v1/cost/:sessionId — coût d'une session
costRouter.get('/:sessionId', (req, res) => {
  const usage = getSessionUsage(req.params.sessionId);
  if (!usage) {
    res.status(404).json({ error: 'Session not found or no usage recorded' });
    return;
  }
  res.json(usage);
});
