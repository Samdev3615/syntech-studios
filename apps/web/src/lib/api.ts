const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';

export type PrivacyMode = 'demo' | 'private' | 'nda';

export interface Session {
  id: string;
  privacyMode: PrivacyMode;
  status: string;
  createdAt: string;
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json() as { message?: string } & T;
  if (!res.ok) throw new Error((json as { message?: string }).message ?? 'Request failed');
  return json;
}

// ─── Session ──────────────────────────────────────────────────────────────────
export async function createSession(privacyMode: PrivacyMode): Promise<{ session: Session }> {
  return post('/api/v1/sessions', { privacyMode });
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
export async function startConversation(
  sessionId: string,
  privacyMode: PrivacyMode
): Promise<{ welcomeMessage: string }> {
  return post(`/api/v1/chat/${sessionId}/start`, { mode: 'interview', privacyMode });
}

// ─── NDA ──────────────────────────────────────────────────────────────────────
export interface CreateNDAResponse {
  success: boolean;
  data: { ndaId: string; pdfUrl: string; acceptUrl: string };
}

export async function createNDA(
  sessionId: string,
  clientName: string,
  clientEmail: string,
  companyName?: string
): Promise<CreateNDAResponse> {
  return post('/api/v1/nda', { sessionId, clientName, clientEmail, companyName });
}

export async function acceptNDA(ndaId: string): Promise<{ success: boolean }> {
  return post(`/api/v1/nda/${ndaId}/accept`);
}

// ─── Documents ────────────────────────────────────────────────────────────────
export async function startDocumentConversation(
  sessionId: string,
  privacyMode: PrivacyMode
): Promise<{ welcomeMessage: string }> {
  return post(`/api/v1/chat/${sessionId}/start`, { mode: 'document', privacyMode });
}

export interface UploadResult {
  analysis: string;
  gaps: string[];
  questions: string[];
}

export async function uploadDocument(sessionId: string, file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_URL}/api/v1/files/${sessionId}/upload`, {
    method: 'POST',
    body: formData,
  });
  const json = await res.json() as {
    message?: string;
    analysis?: { summary: string; gaps: string[]; questions: string[] };
  };
  if (!res.ok) throw new Error(json.message ?? 'Upload failed');
  return {
    analysis: json.analysis?.summary ?? '',
    gaps: json.analysis?.gaps ?? [],
    questions: json.analysis?.questions ?? [],
  };
}

// ─── URLs helpers ─────────────────────────────────────────────────────────────
export const getBriefPDFUrl  = (sessionId: string) => `${API_URL}/api/v1/briefs/${sessionId}/pdf`;
export const getNDAPDFUrl    = (ndaId: string)     => `${API_URL}/api/v1/nda/${ndaId}/pdf`;
