import { Router, type Router as ExpressRouter } from 'express';
import { createSession, getSession, deleteSession } from '../controllers/session.controller.js';
import { strictRateLimiter } from '../middleware/rate-limit.middleware.js';

export const sessionRouter: ExpressRouter = Router();

// POST /api/v1/sessions — créer une session
sessionRouter.post('/', strictRateLimiter, createSession);

// GET /api/v1/sessions/:id — récupérer une session
sessionRouter.get('/:id', getSession);

// DELETE /api/v1/sessions/:id — supprimer une session
sessionRouter.delete('/:id', deleteSession);
