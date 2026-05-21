import type { Server as HTTPServer } from 'http';
import { Server as SocketServer, type Socket } from 'socket.io';
import { ConversationEngine } from '../services/conversation.engine.js';
import { SessionService } from '../services/session.service.js';
import { BriefService } from '../services/brief.service.js';
import { logger } from '../middleware/logger.middleware.js';
import { AppError } from '../middleware/error.middleware.js';

// ─── Rate limiting (par session) ──────────────────────────────────────────────
const MAX_MESSAGES_PER_MINUTE = 30;
const RATE_WINDOW_MS = 60_000;
const rateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(sessionId);

  if (!entry || now > entry.resetAt) {
    rateMap.set(sessionId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_MESSAGES_PER_MINUTE) return false;
  entry.count++;
  return true;
}

// ─── Setup Socket.io ──────────────────────────────────────────────────────────
export function setupWebSocket(httpServer: HTTPServer, frontendUrl: string): SocketServer {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: true,
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60_000,
    pingInterval: 25_000,
  });

  const engine = new ConversationEngine();
  const sessionService = new SessionService();
  const briefService = new BriefService();

  // ─── Auth middleware ─────────────────────────────────────────────────────────
  io.use(async (socket, next) => {
    const sessionId = socket.handshake.auth?.sessionId as string | undefined;

    if (!sessionId) {
      return next(new Error('SESSION_REQUIRED'));
    }

    try {
      const session = await sessionService.getById(sessionId);
      if (!session) return next(new Error('SESSION_NOT_FOUND'));
      if (session.status !== 'active') return next(new Error('SESSION_NOT_ACTIVE'));

      socket.data.sessionId = sessionId;
      next();
    } catch {
      next(new Error('AUTH_ERROR'));
    }
  });

  // ─── Connexion ───────────────────────────────────────────────────────────────
  io.on('connection', (socket: Socket) => {
    const sessionId = socket.data.sessionId as string;
    logger.info(`[WS] Connected — session: ${sessionId}, socket: ${socket.id}`);

    // Rejoindre la room de la session (pour futures broadcasts)
    socket.join(sessionId);

    // ── chat:message ─────────────────────────────────────────────────────────
    // Le client envoie : { content: string }
    // Le serveur répond :
    //   chat:typing     { isTyping: true }
    //   chat:chunk      { delta: string }      (streaming temps réel)
    //   chat:typing     { isTyping: false }
    //   chat:response   { userMessage, assistantMessage, briefReady }
    //   brief:ready     { message: string }    (si threshold atteint)
    socket.on('chat:message', async (data: unknown) => {
      // Validation payload
      if (!data || typeof data !== 'object' || !('content' in data)) {
        socket.emit('error', { code: 'INVALID_MESSAGE', message: 'content is required' });
        return;
      }
      const content = (data as { content: unknown }).content;
      if (typeof content !== 'string' || !content.trim()) {
        socket.emit('error', { code: 'INVALID_MESSAGE', message: 'content must be a non-empty string' });
        return;
      }

      // Rate limiting
      if (!checkRateLimit(sessionId)) {
        socket.emit('error', { code: 'RATE_LIMIT', message: 'Trop de messages — merci de patienter un moment' });
        return;
      }

      try {
        // 1. Signal de frappe en cours
        socket.emit('chat:typing', { isTyping: true });

        // 2. Stream avec chunks temps réel
        const result = await engine.streamMessageWS(sessionId, content.trim(), (delta) => {
          socket.emit('chat:chunk', { delta });
        });

        // 3. Fin du stream + réponse complète
        socket.emit('chat:typing', { isTyping: false });
        socket.emit('chat:response', {
          userMessage: result.userMessage,
          assistantMessage: result.assistantMessage,
          briefReady: result.briefReady,
        });

        // 4. Notification si le brief est prêt
        if (result.briefReady) {
          socket.emit('brief:ready', {
            message: "Nous avons collecté suffisamment d'informations. Voulez-vous générer votre brief maintenant ?",
          });
        }

        logger.info(`[WS] Message handled — session: ${sessionId}`);
      } catch (err) {
        socket.emit('chat:typing', { isTyping: false });

        if (err instanceof AppError) {
          socket.emit('error', { code: err.code, message: err.message });
        } else {
          socket.emit('error', { code: 'INTERNAL_ERROR', message: 'Une erreur inattendue est survenue' });
          logger.error(`[WS] Unhandled error — session: ${sessionId}`, { error: String(err) });
        }
      }
    });

    // ── brief:generate ───────────────────────────────────────────────────────
    // Le client demande la génération du brief
    // Le serveur répond :
    //   brief:complete { brief, briefId }
    //   + le brief est sauvegardé en DB
    //   + PDF téléchargeable via GET /api/v1/briefs/:sessionId/pdf
    socket.on('brief:generate', async () => {
      try {
        const brief = await engine.generateBrief(sessionId);
        const { id: briefId } = await briefService.save(sessionId, brief);

        socket.emit('brief:complete', {
          brief,
          briefId,
          pdfUrl: `/api/v1/briefs/${sessionId}/pdf`,
        });
        logger.info(`[WS] Brief generated & saved — session: ${sessionId}, brief: ${briefId}`);
      } catch (err) {
        if (err instanceof AppError) {
          socket.emit('error', { code: err.code, message: err.message });
        } else {
          socket.emit('error', { code: 'BRIEF_ERROR', message: 'Impossible de générer le brief' });
          logger.error(`[WS] Brief error — session: ${sessionId}`, { error: String(err) });
        }
      }
    });

    // ── Disconnect ───────────────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      logger.info(`[WS] Disconnected — session: ${sessionId}, reason: ${reason}`);
    });
  });

  logger.info('[WS] Socket.io initialized');
  return io;
}
