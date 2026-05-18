import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { MessageService } from '../services/message.service.js';
import { SessionService } from '../services/session.service.js';
import { AppError } from '../middleware/error.middleware.js';

const messageService = new MessageService();
const sessionService = new SessionService();

const AddMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(32000),
});

export async function getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { sessionId } = req.params;

    // Vérifie que la session existe
    const session = await sessionService.getById(sessionId);
    if (!session) {
      throw new AppError(404, 'Session not found', 'SESSION_NOT_FOUND');
    }

    const msgs = await messageService.getBySession(sessionId);
    res.json({ messages: msgs, count: msgs.length });
  } catch (err) {
    next(err);
  }
}

export async function addMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { sessionId } = req.params;
    const body = AddMessageSchema.parse(req.body);

    // Vérifie que la session existe et est active
    const session = await sessionService.getById(sessionId);
    if (!session) {
      throw new AppError(404, 'Session not found', 'SESSION_NOT_FOUND');
    }
    if (session.status !== 'active') {
      throw new AppError(409, 'Session is not active', 'SESSION_NOT_ACTIVE');
    }

    const msg = await messageService.add(sessionId, body.role, body.content);
    res.status(201).json({ message: msg });
  } catch (err) {
    next(err);
  }
}
