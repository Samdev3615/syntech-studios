import { eq, desc } from 'drizzle-orm';
import { db } from '../database/client.js';
import { ndas } from '../database/schema/index.js';
import { logger } from '../middleware/logger.middleware.js';
import { AppError } from '../middleware/error.middleware.js';

export interface CreateNDAInput {
  sessionId: string;
  clientName: string;
  clientEmail: string;
  companyName?: string;
}

export class NDAService {

  // ─── Créer un NDA (statut: pending) ──────────────────────────────────────
  async create(input: CreateNDAInput): Promise<{ id: string }> {
    const ndaId = crypto.randomUUID();
    const documentUrl = `/api/v1/nda/${ndaId}/pdf`;

    const [nda] = await db.insert(ndas).values({
      id: ndaId,
      sessionId: input.sessionId,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      companyName: input.companyName ?? null,
      documentUrl,
      status: 'pending',
    }).returning({ id: ndas.id });

    if (!nda) throw new AppError(500, 'Failed to create NDA', 'NDA_CREATE_ERROR');

    logger.info(`[NDA] Created — session: ${input.sessionId}, nda: ${nda.id}`);
    return { id: nda.id };
  }

  // ─── Accepter un NDA (signature électronique) ────────────────────────────
  async accept(ndaId: string, ipAddress: string, userAgent: string): Promise<void> {
    const existing = await this.getById(ndaId);
    if (!existing) throw new AppError(404, 'NDA not found', 'NDA_NOT_FOUND');
    if (existing.status === 'accepted') throw new AppError(409, 'NDA already accepted', 'NDA_ALREADY_ACCEPTED');

    await db.update(ndas)
      .set({ status: 'accepted', acceptedAt: new Date(), ipAddress, userAgent })
      .where(eq(ndas.id, ndaId));

    logger.info(`[NDA] Accepted — nda: ${ndaId}, ip: ${ipAddress}`);
  }

  // ─── Récupérer un NDA par ID ──────────────────────────────────────────────
  async getById(ndaId: string) {
    const result = await db
      .select()
      .from(ndas)
      .where(eq(ndas.id, ndaId))
      .limit(1);

    return result[0] ?? null;
  }

  // ─── Récupérer le NDA d'une session ──────────────────────────────────────
  async getBySession(sessionId: string) {
    const result = await db
      .select()
      .from(ndas)
      .where(eq(ndas.sessionId, sessionId))
      .orderBy(desc(ndas.generatedAt))
      .limit(1);

    return result[0] ?? null;
  }

  // ─── Vérifier si le NDA d'une session est signé ───────────────────────────
  async isAccepted(sessionId: string): Promise<boolean> {
    const nda = await this.getBySession(sessionId);
    return nda?.status === 'accepted';
  }
}
