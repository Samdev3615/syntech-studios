import { Router, type Router as ExpressRouter } from 'express';
import { createNDA, getNDAPDF, acceptNDA, getNDAStatus } from '../controllers/nda.controller.js';

export const ndaRouter: ExpressRouter = Router();

// POST /api/v1/nda                       — Créer un NDA
ndaRouter.post('/', createNDA);

// GET  /api/v1/nda/session/:sessionId    — Statut NDA d'une session
ndaRouter.get('/session/:sessionId', getNDAStatus);

// GET  /api/v1/nda/:ndaId/pdf            — Visualiser le PDF
ndaRouter.get('/:ndaId/pdf', getNDAPDF);

// POST /api/v1/nda/:ndaId/accept         — Accepter (signer) le NDA
ndaRouter.post('/:ndaId/accept', acceptNDA);
