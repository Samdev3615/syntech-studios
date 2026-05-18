import { Router, type Router as ExpressRouter } from 'express';
import { getBrief, downloadPDF } from '../controllers/brief.controller.js';

export const briefRouter: ExpressRouter = Router();

// GET /api/v1/briefs/:sessionId        — JSON du brief
briefRouter.get('/:sessionId', getBrief);

// GET /api/v1/briefs/:sessionId/pdf    — Téléchargement PDF
briefRouter.get('/:sessionId/pdf', downloadPDF);
