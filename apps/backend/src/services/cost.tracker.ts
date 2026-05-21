// Tarifs Anthropic (mai 2026)
const PRICES: Record<string, { input: number; output: number }> = {
  'claude-opus-4-7':   { input: 5 / 1_000_000,  output: 25 / 1_000_000 },
  'claude-sonnet-4-6': { input: 3 / 1_000_000,  output: 15 / 1_000_000 },
  'claude-haiku-4-5':  { input: 1 / 1_000_000,  output:  5 / 1_000_000 },
};

export interface SessionUsage {
  sessionId: string;
  model: string;
  calls: number;
  inputTokens: number;
  outputTokens: number;
  costUSD: number;
  startedAt: string;
  updatedAt: string;
}

const store = new Map<string, SessionUsage>();

export function trackUsage(
  sessionId: string,
  model: string,
  inputTokens: number,
  outputTokens: number
): SessionUsage {
  const price = PRICES[model] ?? PRICES['claude-opus-4-7'];
  const existing = store.get(sessionId);
  const now = new Date().toISOString();

  const updated: SessionUsage = {
    sessionId,
    model,
    calls: (existing?.calls ?? 0) + 1,
    inputTokens: (existing?.inputTokens ?? 0) + inputTokens,
    outputTokens: (existing?.outputTokens ?? 0) + outputTokens,
    costUSD: 0,
    startedAt: existing?.startedAt ?? now,
    updatedAt: now,
  };

  updated.costUSD =
    updated.inputTokens * price.input +
    updated.outputTokens * price.output;

  store.set(sessionId, updated);
  return updated;
}

export function getSessionUsage(sessionId: string): SessionUsage | null {
  return store.get(sessionId) ?? null;
}

export function getAllSessions(): SessionUsage[] {
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
