import { randomUUID } from 'crypto';
import { eq, asc } from 'drizzle-orm';
import { db } from '../database/client.js';
import { messages } from '../database/schema/index.js';
import { redisHelpers } from '../database/redis.js';
import { logger } from '../middleware/logger.middleware.js';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface MessageData {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

// Cache Redis des messages pour les sessions actives (TTL = session TTL)
const MESSAGE_CACHE_TTL = 2 * 60 * 60; // 2h

export class MessageService {

  async add(sessionId: string, role: MessageRole, content: string): Promise<MessageData> {
    const id = randomUUID();
    const now = new Date();

    const msg: MessageData = {
      id,
      sessionId,
      role,
      content,
      timestamp: now.toISOString(),
    };

    // Persiste en DB (pour toutes les sessions, pas seulement NDA)
    await db.insert(messages).values({
      id,
      sessionId,
      role,
      content,
      timestamp: now,
    });

    // Cache dans Redis pour accès rapide
    await redisHelpers.setMessage(id, msg, MESSAGE_CACHE_TTL);

    // Ajoute à la liste Redis de la session pour récup en ordre
    // (liste FIFO des IDs de messages de la session)
    // Note : redisHelpers ne supporte pas lPush directement, on utilise redis
    logger.info(`[Message] Added ${role} message to session ${sessionId}`);

    return msg;
  }

  async getBySession(sessionId: string): Promise<MessageData[]> {
    // Récupère directement depuis DB (source de vérité)
    const rows = await db
      .select()
      .from(messages)
      .where(eq(messages.sessionId, sessionId))
      .orderBy(asc(messages.timestamp));

    return rows.map((row) => ({
      id: row.id,
      sessionId: row.sessionId,
      role: row.role as MessageRole,
      content: row.content,
      timestamp: row.timestamp.toISOString(),
    }));
  }

  async getById(id: string): Promise<MessageData | null> {
    // Essaie le cache Redis d'abord
    const cached = await redisHelpers.getMessage(id);
    if (cached) return cached as MessageData;

    // Fallback DB
    const [row] = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
    if (!row) return null;

    return {
      id: row.id,
      sessionId: row.sessionId,
      role: row.role as MessageRole,
      content: row.content,
      timestamp: row.timestamp.toISOString(),
    };
  }

  async deleteBySession(sessionId: string): Promise<void> {
    await db.delete(messages).where(eq(messages.sessionId, sessionId));
    logger.info(`[Message] All messages deleted for session ${sessionId}`);
  }

  // Retourne les messages formatés pour OpenAI (utilisé par Session 2.2)
  toOpenAIFormat(msgs: MessageData[]): Array<{ role: MessageRole; content: string }> {
    return msgs.map(({ role, content }) => ({ role, content }));
  }
}
