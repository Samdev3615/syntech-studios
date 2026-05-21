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

// Messages DEMO : en mémoire (les sessions démo ne sont pas en DB → pas de FK)
const demoMessages = new Map<string, MessageData[]>();

export class MessageService {

  async add(sessionId: string, role: MessageRole, content: string): Promise<MessageData> {
    const id = randomUUID();
    const now = new Date();

    const msg: MessageData = { id, sessionId, role, content, timestamp: now.toISOString() };

    try {
      await db.insert(messages).values({ id, sessionId, role, content, timestamp: now });
      await redisHelpers.setMessage(id, msg, MESSAGE_CACHE_TTL);
    } catch {
      // Session démo (non présente en DB) → stockage en mémoire
      const list = demoMessages.get(sessionId) ?? [];
      list.push(msg);
      demoMessages.set(sessionId, list);
    }

    logger.info(`[Message] Added ${role} message to session ${sessionId}`);
    return msg;
  }

  async getBySession(sessionId: string): Promise<MessageData[]> {
    // Sessions démo → mémoire
    if (demoMessages.has(sessionId)) {
      return demoMessages.get(sessionId) ?? [];
    }

    // Sessions private/NDA → DB
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
