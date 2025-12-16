import { Redis } from '@upstash/redis'
import { env } from '../config/env'

if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Upstash Redis configuration is missing')
}

/**
 * Client Redis Upstash (REST API)
 * Utilisé pour :
 * - Sessions temporaires (mode PRIVÉ avec TTL 2h)
 * - Cache des prompts récurrents
 * - Rate limiting
 */
export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

/**
 * Helper functions pour gérer les sessions temporaires
 */
export const redisHelpers = {
  /**
   * Stocke une session en mode PRIVÉ avec TTL automatique (2 heures)
   */
  async setSession(sessionId: string, data: any): Promise<void> {
    const TTL_SECONDS = 2 * 60 * 60 // 2 heures
    await redis.setex(`session:${sessionId}`, TTL_SECONDS, JSON.stringify(data))
  },

  /**
   * Récupère une session
   */
  async getSession(sessionId: string): Promise<any | null> {
    const data = await redis.get(`session:${sessionId}`)
    return data ? JSON.parse(data as string) : null
  },

  /**
   * Supprime une session
   */
  async deleteSession(sessionId: string): Promise<void> {
    await redis.del(`session:${sessionId}`)
  },

  /**
   * Stocke un message dans le cache
   */
  async setMessage(messageId: string, data: any, ttl: number = 7200): Promise<void> {
    await redis.setex(`message:${messageId}`, ttl, JSON.stringify(data))
  },

  /**
   * Récupère un message du cache
   */
  async getMessage(messageId: string): Promise<any | null> {
    const data = await redis.get(`message:${messageId}`)
    return data ? JSON.parse(data as string) : null
  },

  /**
   * Vérifie si une clé existe
   */
  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key)
    return result === 1
  },

  /**
   * Définit un TTL sur une clé existante
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    const result = await redis.expire(key, seconds)
    return result === 1
  },
}

// Export par défaut
export default redis
