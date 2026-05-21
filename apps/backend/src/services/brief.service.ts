import { randomUUID } from 'crypto';
import { eq, desc } from 'drizzle-orm';
import { db } from '../database/client.js';
import { briefs } from '../database/schema/index.js';
import { logger } from '../middleware/logger.middleware.js';
import { AppError } from '../middleware/error.middleware.js';

// Briefs DEMO : en mémoire (sessions démo non présentes en DB → pas de FK)
const demoBriefs = new Map<string, { id: string; data: Record<string, unknown> }>();

export interface BriefData {
  projectName?: string;
  summary?: string;
  targetAudience?: { description?: string; estimatedUsers?: string };
  objectives?: string[];
  mvpFeatures?: { name?: string; description?: string; priority?: 'high' | 'medium' | 'low' }[];
  v2Features?: string[];
  technicalStack?: { frontend?: string; backend?: string; database?: string; hosting?: string };
  constraints?: { budget?: string; deadline?: string; technical?: string[] };
  openQuestions?: string[];
  successCriteria?: string[];
  confidenceScore?: number;
}

export class BriefService {

  // ─── Sauvegarder un brief ─────────────────────────────────────────────────
  async save(sessionId: string, data: Record<string, unknown>): Promise<{ id: string }> {
    try {
      const [brief] = await db.insert(briefs).values({
        sessionId,
        data,
        status: 'complete',
      }).returning({ id: briefs.id });

      if (!brief) throw new AppError(500, 'Failed to save brief', 'BRIEF_SAVE_ERROR');

      logger.info(`[Brief] Saved — session: ${sessionId}, brief: ${brief.id}`);
      return { id: brief.id };
    } catch (err) {
      if (err instanceof AppError) throw err;
      // Session démo (FK manquante) → stockage en mémoire
      const id = randomUUID();
      demoBriefs.set(sessionId, { id, data });
      logger.info(`[Brief] Demo brief saved in memory — session: ${sessionId}, brief: ${id}`);
      return { id };
    }
  }

  // ─── Récupérer le dernier brief d'une session ─────────────────────────────
  async getBySession(sessionId: string) {
    // Sessions démo → mémoire
    const demo = demoBriefs.get(sessionId);
    if (demo) return { id: demo.id, data: demo.data, sessionId, status: 'complete' };

    const result = await db
      .select()
      .from(briefs)
      .where(eq(briefs.sessionId, sessionId))
      .orderBy(desc(briefs.createdAt))
      .limit(1);

    return result[0] ?? null;
  }

  // ─── Récupérer un brief par ID ────────────────────────────────────────────
  async getById(briefId: string) {
    const result = await db
      .select()
      .from(briefs)
      .where(eq(briefs.id, briefId))
      .limit(1);

    return result[0] ?? null;
  }
}
