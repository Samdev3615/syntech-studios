import Anthropic from '@anthropic-ai/sdk';
import type { RawMessageStreamEvent } from '@anthropic-ai/sdk/resources/messages/messages.js';
import type { Response } from 'express';
import { env } from '../config/env.js';
import { logger } from '../middleware/logger.middleware.js';
import { AppError } from '../middleware/error.middleware.js';
import { trackUsage } from './cost.tracker.js';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  sessionId?: string;
}

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

function toAnthropicParams(messages: ChatMessage[]): {
  system: string | undefined;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
} {
  const systemParts = messages.filter((m) => m.role === 'system').map((m) => m.content);
  const system = systemParts.length > 0 ? systemParts.join('\n\n') : undefined;
  const msgs = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
  return { system, messages: msgs };
}

function extractTextFromEvent(event: RawMessageStreamEvent): string {
  if (
    event.type === 'content_block_delta' &&
    event.delta.type === 'text_delta'
  ) {
    return event.delta.text;
  }
  return '';
}

export class ClaudeService {
  private model = env.ANTHROPIC_MODEL;

  // ─── Completion simple (sans streaming) ────────────────────────────────────
  async complete(messages: ChatMessage[], options: ChatOptions = {}): Promise<string> {
    const { maxTokens = 1500, sessionId } = options;
    const { system, messages: msgs } = toAnthropicParams(messages);

    try {
      const response = await client.messages.create({
        model: this.model,
        max_tokens: maxTokens,
        thinking: { type: 'adaptive' },
        ...(system ? { system } : {}),
        messages: msgs,
      });

      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('');

      if (!text) throw new Error('Empty response from Claude');

      const { input_tokens, output_tokens } = response.usage;
      if (sessionId) {
        const usage = trackUsage(sessionId, this.model, input_tokens, output_tokens);
        logger.info(`[Claude] Completion — ${input_tokens + output_tokens} tokens | session cost: $${usage.costUSD.toFixed(4)}`);
      } else {
        logger.info(`[Claude] Completion — ${input_tokens + output_tokens} tokens`);
      }
      return text;

    } catch (err: unknown) {
      this.handleError(err);
    }
  }

  // ─── Streaming vers le client HTTP (SSE) ───────────────────────────────────
  async streamToResponse(
    messages: ChatMessage[],
    res: Response,
    options: ChatOptions = {}
  ): Promise<string> {
    const { maxTokens = 1500 } = options;
    const { system, messages: msgs } = toAnthropicParams(messages);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let fullContent = '';

    try {
      const stream = client.messages.stream({
        model: this.model,
        max_tokens: maxTokens,
        thinking: { type: 'adaptive' },
        ...(system ? { system } : {}),
        messages: msgs,
      });

      for await (const event of stream) {
        const chunk = extractTextFromEvent(event);
        if (chunk) {
          fullContent += chunk;
          res.write(`data: ${JSON.stringify({ delta: chunk, done: false })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ delta: '', done: true, model: this.model })}\n\n`);
      res.end();

      logger.info(`[Claude] SSE stream completed`);
      return fullContent;

    } catch (err: unknown) {
      res.write(`data: ${JSON.stringify({ error: 'AI service error', done: true })}\n\n`);
      res.end();
      this.handleError(err);
    }

    return fullContent;
  }

  // ─── Streaming via callback (pour WebSocket) ───────────────────────────────
  async streamWithCallback(
    messages: ChatMessage[],
    onChunk: (delta: string) => void,
    options: ChatOptions = {}
  ): Promise<string> {
    const { maxTokens = 800, sessionId } = options;
    const { system, messages: msgs } = toAnthropicParams(messages);

    let fullContent = '';

    try {
      const stream = client.messages.stream({
        model: this.model,
        max_tokens: maxTokens,
        thinking: { type: 'adaptive' },
        ...(system ? { system } : {}),
        messages: msgs,
      });

      for await (const event of stream) {
        const chunk = extractTextFromEvent(event);
        if (chunk) {
          fullContent += chunk;
          onChunk(chunk);
        }
      }

      const finalMsg = await stream.finalMessage();
      const { input_tokens, output_tokens } = finalMsg.usage;
      if (sessionId) {
        const usage = trackUsage(sessionId, this.model, input_tokens, output_tokens);
        logger.info(`[Claude] WS stream — ${input_tokens + output_tokens} tokens | session cost: $${usage.costUSD.toFixed(4)}`);
      } else {
        logger.info(`[Claude] WS stream completed`);
      }
      return fullContent;

    } catch (err: unknown) {
      this.handleError(err);
    }

    return fullContent;
  }

  // ─── Pruning du contexte (limite les tokens) ───────────────────────────────
  pruneContext(messages: ChatMessage[], maxMessages = 20): ChatMessage[] {
    if (messages.length <= maxMessages) return messages;
    const system = messages.filter((m) => m.role === 'system');
    const conversation = messages.filter((m) => m.role !== 'system');
    return [...system, ...conversation.slice(-maxMessages)];
  }

  // ─── Gestion des erreurs Claude ────────────────────────────────────────────
  private handleError(err: unknown): never {
    if (err instanceof Anthropic.APIError) {
      logger.error(`[Claude] API Error: ${err.status} — ${err.message}`);
      if (err.status === 401) throw new AppError(500, 'Claude authentication failed', 'CLAUDE_AUTH_ERROR');
      if (err.status === 429) throw new AppError(429, 'AI rate limit reached, please retry later', 'CLAUDE_RATE_LIMIT');
      if (err.status === 503) throw new AppError(503, 'Claude service unavailable', 'CLAUDE_UNAVAILABLE');
    }
    logger.error('[Claude] Unexpected error', { error: String(err) });
    throw new AppError(500, 'Unexpected AI error', 'CLAUDE_ERROR');
  }
}

export { ClaudeService as OpenAIService };
