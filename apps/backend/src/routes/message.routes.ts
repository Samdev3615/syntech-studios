import { Router, type Router as ExpressRouter } from 'express';
import { getMessages, addMessage } from '../controllers/message.controller.js';

export const messageRouter: ExpressRouter = Router({ mergeParams: true });

// GET  /api/v1/sessions/:sessionId/messages
messageRouter.get('/', getMessages);

// POST /api/v1/sessions/:sessionId/messages
messageRouter.post('/', addMessage);
