import { ClaudeService as OpenAIService, type ChatMessage } from './openai.service.js';
import { MessageService, type MessageRole } from './message.service.js';
import { SessionService, type PrivacyMode } from './session.service.js';
import { PromptLibrary } from './prompt.library.js';
import { logger } from '../middleware/logger.middleware.js';
import { AppError } from '../middleware/error.middleware.js';

export type ConversationMode = 'interview' | 'document';

export interface SendMessageResult {
  userMessage: { id: string; content: string; timestamp: string };
  assistantMessage: { id: string; content: string; timestamp: string };
  briefReady: boolean;
}

export class ConversationEngine {
  private openai = new OpenAIService();
  private messageService = new MessageService();
  private sessionService = new SessionService();

  // Nombre minimum d'échanges avant de proposer un brief
  private static MIN_EXCHANGES_FOR_BRIEF = 8;

  // ─── Démarrer une conversation ────────────────────────────────────────────
  async startConversation(
    sessionId: string,
    privacyMode: PrivacyMode,
    mode: ConversationMode = 'interview'
  ): Promise<{ welcomeMessage: string }> {
    const session = await this.sessionService.getById(sessionId);
    if (!session) throw new AppError(404, 'Session not found', 'SESSION_NOT_FOUND');

    const welcome = PromptLibrary.WELCOME_MESSAGE(privacyMode);

    // Sauvegarde le message de bienvenue en tant qu'assistant
    await this.messageService.add(sessionId, 'assistant', welcome);

    // Sauvegarde le prompt système pour cette session
    const systemPrompt = mode === 'interview'
      ? PromptLibrary.SYSTEM_MAIN
      : PromptLibrary.SYSTEM_DOCUMENT_ANALYSIS;

    await this.messageService.add(sessionId, 'system', systemPrompt);

    logger.info(`[Engine] Conversation started — session: ${sessionId}, mode: ${mode}`);
    return { welcomeMessage: welcome };
  }

  // ─── Envoyer un message utilisateur et obtenir la réponse IA ──────────────
  async sendMessage(
    sessionId: string,
    userContent: string
  ): Promise<SendMessageResult> {
    const session = await this.sessionService.getById(sessionId);
    if (!session) throw new AppError(404, 'Session not found', 'SESSION_NOT_FOUND');
    if (session.status !== 'active') throw new AppError(409, 'Session is not active', 'SESSION_NOT_ACTIVE');

    // 1. Sauvegarde le message utilisateur
    const userMsg = await this.messageService.add(sessionId, 'user', userContent);

    // 2. Récupère l'historique complet de la conversation
    const history = await this.messageService.getBySession(sessionId);

    // 3. Formate pour OpenAI + pruning du contexte
    const openaiMessages = this.openai.pruneContext(
      this.messageService.toOpenAIFormat(history) as ChatMessage[],
      20
    );

    // 4. Appel OpenAI
    const assistantContent = await this.openai.complete(openaiMessages, {
      temperature: 0.7,
      maxTokens: 800,
      sessionId,
    });

    // 5. Sauvegarde la réponse IA
    const assistantMsg = await this.messageService.add(sessionId, 'assistant', assistantContent);

    // 6. Vérifie si le brief est prêt (assez d'échanges)
    const userMessages = history.filter((m) => m.role === 'user').length + 1;
    const briefReady = userMessages >= ConversationEngine.MIN_EXCHANGES_FOR_BRIEF;

    if (briefReady) {
      logger.info(`[Engine] Brief ready threshold reached for session ${sessionId}`);
    }

    return {
      userMessage: { id: userMsg.id, content: userMsg.content, timestamp: userMsg.timestamp },
      assistantMessage: { id: assistantMsg.id, content: assistantMsg.content, timestamp: assistantMsg.timestamp },
      briefReady,
    };
  }

  // ─── Analyser un document uploadé (Mode B) ────────────────────────────────
  async analyzeDocument(
    sessionId: string,
    documentText: string,
    filename: string
  ): Promise<{ analysis: string }> {
    const session = await this.sessionService.getById(sessionId);
    if (!session) throw new AppError(404, 'Session not found', 'SESSION_NOT_FOUND');

    const messages: ChatMessage[] = [
      { role: 'system', content: PromptLibrary.SYSTEM_DOCUMENT_ANALYSIS },
      {
        role: 'user',
        content: `Voici le contenu du document "${filename}" :\n\n${documentText.slice(0, 8000)}`,
      },
    ];

    const analysis = await this.openai.complete(messages, { temperature: 0.5, maxTokens: 1200, sessionId });

    // Sauvegarde l'analyse en tant que message assistant
    await this.messageService.add(sessionId, 'assistant', analysis);

    logger.info(`[Engine] Document analyzed for session ${sessionId}: ${filename}`);
    return { analysis };
  }

  // ─── Générer le brief final ────────────────────────────────────────────────
  async generateBrief(sessionId: string): Promise<Record<string, unknown>> {
    const history = await this.messageService.getBySession(sessionId);

    if (history.filter((m) => m.role === 'user').length < 4) {
      throw new AppError(400, 'Not enough conversation to generate a brief', 'INSUFFICIENT_CONTEXT');
    }

    // Formate la conversation (sans le prompt système) pour le brief
    const conversation = history
      .filter((m) => m.role !== 'system')
      .map((m) => `${m.role === 'user' ? 'Client' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    const messages: ChatMessage[] = [
      { role: 'system', content: PromptLibrary.SYSTEM_BRIEF_GENERATION },
      { role: 'user', content: `Conversation à analyser :\n\n${conversation}` },
    ];

    const rawBrief = await this.openai.complete(messages, { temperature: 0.3, maxTokens: 2000, sessionId });

    try {
      const brief = JSON.parse(rawBrief) as Record<string, unknown>;
      logger.info(`[Engine] Brief generated for session ${sessionId}`);
      return brief;
    } catch {
      logger.error(`[Engine] Failed to parse brief JSON for session ${sessionId}`);
      throw new AppError(500, 'Failed to generate structured brief', 'BRIEF_PARSE_ERROR');
    }
  }

  // ─── Streaming WebSocket (chunks via callback) ────────────────────────────
  async streamMessageWS(
    sessionId: string,
    userContent: string,
    onChunk: (delta: string) => void
  ): Promise<SendMessageResult> {
    const session = await this.sessionService.getById(sessionId);
    if (!session) throw new AppError(404, 'Session not found', 'SESSION_NOT_FOUND');
    if (session.status !== 'active') throw new AppError(409, 'Session is not active', 'SESSION_NOT_ACTIVE');

    // 1. Sauvegarde le message utilisateur
    const userMsg = await this.messageService.add(sessionId, 'user', userContent);

    // 2. Récupère l'historique
    const history = await this.messageService.getBySession(sessionId);

    // 3. Formate + pruning
    const openaiMessages = this.openai.pruneContext(
      this.messageService.toOpenAIFormat(history) as ChatMessage[],
      20
    );

    // 4. Stream avec callback (chunks envoyés en temps réel)
    const fullContent = await this.openai.streamWithCallback(openaiMessages, onChunk, {
      temperature: 0.7,
      maxTokens: 800,
      sessionId,
    });

    // 5. Sauvegarde la réponse complète
    const assistantMsg = await this.messageService.add(sessionId, 'assistant', fullContent);

    // 6. Vérifie briefReady
    const userMessages = history.filter((m) => m.role === 'user').length + 1;
    const briefReady = userMessages >= ConversationEngine.MIN_EXCHANGES_FOR_BRIEF;

    if (briefReady) {
      logger.info(`[Engine] Brief ready — session: ${sessionId}`);
    }

    return {
      userMessage: { id: userMsg.id, content: userMsg.content, timestamp: userMsg.timestamp },
      assistantMessage: { id: assistantMsg.id, content: assistantMsg.content, timestamp: assistantMsg.timestamp },
      briefReady,
    };
  }

  // ─── Streaming vers le client HTTP (SSE) ──────────────────────────────────
  async streamMessage(
    sessionId: string,
    userContent: string,
    res: import('express').Response
  ): Promise<void> {
    const session = await this.sessionService.getById(sessionId);
    if (!session) throw new AppError(404, 'Session not found', 'SESSION_NOT_FOUND');

    // Sauvegarde message utilisateur
    await this.messageService.add(sessionId, 'user', userContent);

    const history = await this.messageService.getBySession(sessionId);
    const openaiMessages = this.openai.pruneContext(
      this.messageService.toOpenAIFormat(history) as ChatMessage[],
      20
    );

    // Stream la réponse + sauvegarde
    const fullContent = await this.openai.streamToResponse(openaiMessages, res, {
      temperature: 0.7,
      maxTokens: 800,
    });

    if (fullContent) {
      await this.messageService.add(sessionId, 'assistant', fullContent);
    }
  }
}
