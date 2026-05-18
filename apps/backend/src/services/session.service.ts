import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '../database/client.js';
import { sessions } from '../database/schema/index.js';
import { redisHelpers } from '../database/redis.js';
import { logger } from '../middleware/logger.middleware.js';
import { AppError } from '../middleware/error.middleware.js';

export type PrivacyMode = 'demo' | 'private' | 'nda';

export interface SessionData {
  id: string;
  privacyMode: PrivacyMode;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  expiresAt?: string;
  metadata?: {
    clientName?: string;
    clientEmail?: string;
    [key: string]: unknown;
  };
}

export interface CreateSessionOptions {
  clientName?: string;
  clientEmail?: string;
}

// Sessions DEMO : en mémoire, purgées au restart
const demoStore = new Map<string, SessionData>();

export class SessionService {

  async create(privacyMode: PrivacyMode, options: CreateSessionOptions = {}): Promise<SessionData> {
    const id = randomUUID();
    const now = new Date();

    const sessionData: SessionData = {
      id,
      privacyMode,
      status: 'active',
      createdAt: now.toISOString(),
      metadata: options as SessionData['metadata'],
    };

    switch (privacyMode) {
      case 'demo': {
        // En mémoire — auto-purge après 30min
        demoStore.set(id, sessionData);
        setTimeout(() => demoStore.delete(id), 30 * 60 * 1000);
        logger.info(`[Session] Demo session created: ${id}`);
        break;
      }

      case 'private': {
        // Redis avec TTL 2h
        const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
        sessionData.expiresAt = expiresAt;
        await redisHelpers.setSession(id, sessionData);
        logger.info(`[Session] Private session created: ${id} (expires: ${expiresAt})`);
        break;
      }

      case 'nda': {
        // PostgreSQL — persistance complète
        await db.insert(sessions).values({
          id,
          privacyMode: 'nda',
          status: 'active',
          createdAt: now,
          metadata: options,
        });
        logger.info(`[Session] NDA session created in DB: ${id}`);
        break;
      }

      default:
        throw new AppError(400, `Unknown privacy mode: ${privacyMode}`, 'INVALID_PRIVACY_MODE');
    }

    return sessionData;
  }

  async getById(id: string): Promise<SessionData | null> {
    // 1. Cherche en mémoire (demo)
    if (demoStore.has(id)) {
      return demoStore.get(id)!;
    }

    // 2. Cherche dans Redis (private)
    const cached = await redisHelpers.getSession(id);
    if (cached) {
      return cached as SessionData;
    }

    // 3. Cherche dans PostgreSQL (nda)
    const [row] = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1);
    if (!row) return null;

    return {
      id: row.id,
      privacyMode: row.privacyMode as PrivacyMode,
      status: row.status as SessionData['status'],
      createdAt: row.createdAt.toISOString(),
      expiresAt: row.expiresAt?.toISOString(),
      metadata: row.metadata as SessionData['metadata'],
    };
  }

  async updateStatus(id: string, status: SessionData['status']): Promise<void> {
    // Mise à jour en DB pour les sessions NDA
    await db.update(sessions).set({ status }).where(eq(sessions.id, id));

    // Mise à jour dans Redis si présent
    const cached = await redisHelpers.getSession(id);
    if (cached) {
      await redisHelpers.setSession(id, { ...cached, status });
    }

    // Mise à jour en mémoire si demo
    const demo = demoStore.get(id);
    if (demo) {
      demoStore.set(id, { ...demo, status });
    }

    logger.info(`[Session] Status updated: ${id} → ${status}`);
  }

  async delete(id: string): Promise<void> {
    // Purge dans tous les stores
    demoStore.delete(id);
    await redisHelpers.deleteSession(id);
    await db.delete(sessions).where(eq(sessions.id, id));
    logger.info(`[Session] Session deleted: ${id}`);
  }
}
