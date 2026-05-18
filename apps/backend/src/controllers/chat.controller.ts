import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ConversationEngine } from '../services/conversation.engine.js';

const engine = new ConversationEngine();

const StartSchema = z.object({
  mode: z.enum(['interview', 'document']).default('interview'),
  privacyMode: z.enum(['demo', 'private', 'nda']),
});

const SendMessageSchema = z.object({
  content: z.string().min(1).max(32000),
});

// POST /api/v1/chat/:sessionId/start
export async function startConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { sessionId } = req.params;
    const { mode, privacyMode } = StartSchema.parse(req.body);

    const result = await engine.startConversation(sessionId, privacyMode, mode);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/chat/:sessionId/message
export async function sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { sessionId } = req.params;
    const { content } = SendMessageSchema.parse(req.body);

    const result = await engine.sendMessage(sessionId, content);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/chat/:sessionId/stream
export async function streamMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { sessionId } = req.params;
    const { content } = SendMessageSchema.parse(req.body);

    await engine.streamMessage(sessionId, content, res);
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/chat/:sessionId/brief
export async function generateBrief(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { sessionId } = req.params;
    const brief = await engine.generateBrief(sessionId);
    res.json({ brief });
  } catch (err) {
    next(err);
  }
}
