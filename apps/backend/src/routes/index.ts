import { Router, type Router as ExpressRouter } from 'express';
import { healthRouter } from './health.routes.js';
import { sessionRouter } from './session.routes.js';
import { messageRouter } from './message.routes.js';
import { chatRouter } from './chat.routes.js';
import { fileRouter } from './file.routes.js';
import { briefRouter } from './brief.routes.js';
import { ndaRouter } from './nda.routes.js';

export const apiRouter: ExpressRouter = Router();

// Health (pas de préfixe /api/v1)
apiRouter.use('/health', healthRouter);

// API v1
apiRouter.use('/api/v1/sessions', sessionRouter);
apiRouter.use('/api/v1/sessions/:sessionId/messages', messageRouter);
apiRouter.use('/api/v1/chat', chatRouter);
apiRouter.use('/api/v1/files', fileRouter);
apiRouter.use('/api/v1/briefs', briefRouter);
apiRouter.use('/api/v1/nda', ndaRouter);
