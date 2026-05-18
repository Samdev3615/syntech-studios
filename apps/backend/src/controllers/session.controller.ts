import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { SessionService } from '../services/session.service.js';
import { AppError } from '../middleware/error.middleware.js';

const sessionService = new SessionService();

const CreateSessionSchema = z.object({
  privacyMode: z.enum(['demo', 'private', 'nda']),
  clientName: z.string().optional(),
  clientEmail: z.string().email().optional(),
});

export async function createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = CreateSessionSchema.parse(req.body);
    const session = await sessionService.create(body.privacyMode, {
      clientName: body.clientName,
      clientEmail: body.clientEmail,
    });

    res.status(201).json({ session });
  } catch (err) {
    next(err);
  }
}

export async function getSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const session = await sessionService.getById(id);

    if (!session) {
      throw new AppError(404, 'Session not found', 'SESSION_NOT_FOUND');
    }

    res.json({ session });
  } catch (err) {
    next(err);
  }
}

export async function deleteSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await sessionService.delete(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
