import OpenAI, { APIError } from 'openai';
import type { Response } from 'express';
import { env } from '../config/env.js';
import { logger } from '../middleware/logger.middleware.js';
import { AppError } from '../middleware/error.middleware.js';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export class OpenAIService {
  private model = env.OPENAI_MODEL;
  private fallbackModel = env.OPENAI_FALLBACK_MODEL;

  // ─── Completion simple (sans streaming) ────────────────────────────────────
  async complete(messages: ChatMessage[], options: ChatOptions = {}): Promise<string> {
    const { temperature = 0.7, maxTokens = 1500 } = options;

    for (const model of [this.model, this.fallbackModel]) {
      try {
        const response = await client.chat.completions.create({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error('Empty response from OpenAI');

        logger.info(`[OpenAI] Completion with ${model} — ${response.usage?.total_tokens ?? '?'} tokens`);
        return content;

      } catch (err: unknown) {
        const isRateLimit = err instanceof APIError && err.status === 429;
        const isServerError = err instanceof APIError && err.status >= 500;

        if ((isRateLimit || isServerError) && model !== this.fallbackModel) {
          logger.warn(`[OpenAI] ${model} unavailable (${(err as APIError).status}), trying fallback...`);
          continue;
        }

        this.handleError(err);
      }
    }

    throw new AppError(503, 'OpenAI service unavailable', 'OPENAI_UNAVAILABLE');
  }

  // ─── Streaming vers le client HTTP (SSE) ───────────────────────────────────
  async streamToResponse(
    messages: ChatMessage[],
    res: Response,
    options: ChatOptions = {}
  ): Promise<string> {
    const { temperature = 0.7, maxTokens = 1500 } = options;

    // Headers SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let fullContent = '';
    let modelUsed = this.model;

    for (const model of [this.model, this.fallbackModel]) {
      try {
        const stream = await client.chat.completions.create({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: true,
        });

        modelUsed = model;

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content ?? '';
          if (delta) {
            fullContent += delta;
            res.write(`data: ${JSON.stringify({ delta, done: false })}\n\n`);
          }
        }

        // Signal de fin
        res.write(`data: ${JSON.stringify({ delta: '', done: true, model: modelUsed })}\n\n`);
        res.end();

        logger.info(`[OpenAI] Stream completed with ${modelUsed}`);
        return fullContent;

      } catch (err: unknown) {
        const isRateLimit = err instanceof APIError && err.status === 429;
        const isServerError = err instanceof APIError && err.status >= 500;

        if ((isRateLimit || isServerError) && model !== this.fallbackModel) {
          logger.warn(`[OpenAI] Stream: ${model} unavailable, trying fallback...`);
          continue;
        }

        // Envoie l'erreur au client via SSE
        res.write(`data: ${JSON.stringify({ error: 'AI service error', done: true })}\n\n`);
        res.end();
        this.handleError(err);
      }
    }

    return fullContent;
  }

  // ─── Streaming via callback (pour WebSocket) ───────────────────────────────
  async streamWithCallback(
    messages: ChatMessage[],
    onChunk: (delta: string) => void,
    options: ChatOptions = {}
  ): Promise<string> {
    const { temperature = 0.7, maxTokens = 800 } = options;
    let fullContent = '';

    for (const model of [this.model, this.fallbackModel]) {
      try {
        const stream = await client.chat.completions.create({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: true,
        });

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content ?? '';
          if (delta) {
            fullContent += delta;
            onChunk(delta);
          }
        }

        logger.info(`[OpenAI] WS stream completed with ${model}`);
        return fullContent;

      } catch (err: unknown) {
        const isRateLimit = err instanceof APIError && err.status === 429;
        const isServerError = err instanceof APIError && err.status >= 500;

        if ((isRateLimit || isServerError) && model !== this.fallbackModel) {
          logger.warn(`[OpenAI] WS stream: ${model} unavailable, trying fallback...`);
          continue;
        }

        this.handleError(err);
      }
    }

    return fullContent;
  }

  // ─── Pruning du contexte (limite les tokens) ───────────────────────────────
  pruneContext(messages: ChatMessage[], maxMessages = 20): ChatMessage[] {
    if (messages.length <= maxMessages) return messages;

    // Garde toujours le message system + les N derniers messages
    const system = messages.filter((m) => m.role === 'system');
    const conversation = messages.filter((m) => m.role !== 'system');
    const pruned = conversation.slice(-maxMessages);

    return [...system, ...pruned];
  }

  // ─── Gestion des erreurs OpenAI ────────────────────────────────────────────
  private handleError(err: unknown): never {
    if (err instanceof APIError) {
      logger.error(`[OpenAI] API Error: ${err.status} — ${err.message}`);

      if (err.status === 401) throw new AppError(500, 'OpenAI authentication failed', 'OPENAI_AUTH_ERROR');
      if (err.status === 429) throw new AppError(429, 'AI rate limit reached, please retry later', 'OPENAI_RATE_LIMIT');
      if (err.status === 503) throw new AppError(503, 'OpenAI service unavailable', 'OPENAI_UNAVAILABLE');
    }

    logger.error('[OpenAI] Unexpected error', { error: String(err) });
    throw new AppError(500, 'Unexpected AI error', 'OPENAI_ERROR');
  }
}
