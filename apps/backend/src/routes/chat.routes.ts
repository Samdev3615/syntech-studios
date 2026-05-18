import { Router, type Router as ExpressRouter } from 'express';
import {
  startConversation,
  sendMessage,
  streamMessage,
  generateBrief,
} from '../controllers/chat.controller.js';

export const chatRouter: ExpressRouter = Router();

// POST /api/v1/chat/:sessionId/start     — démarre la conversation
chatRouter.post('/:sessionId/start', startConversation);

// POST /api/v1/chat/:sessionId/message   — envoie un message (réponse complète)
chatRouter.post('/:sessionId/message', sendMessage);

// POST /api/v1/chat/:sessionId/stream    — envoie un message (SSE streaming)
chatRouter.post('/:sessionId/stream', streamMessage);

// POST /api/v1/chat/:sessionId/brief     — génère le brief final
chatRouter.post('/:sessionId/brief', generateBrief);
