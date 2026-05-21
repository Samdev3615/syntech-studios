'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { createSocket, type Socket } from '@/lib/socket';
import {
  createSession, startConversation, startDocumentConversation, uploadDocument,
  createNDA, acceptNDA,
  type PrivacyMode,
} from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────
export type ChatState =
  | 'mode-select'
  | 'doc-check'
  | 'nda-form'
  | 'nda-pending'
  | 'chatting'
  | 'brief-ready'
  | 'brief-complete';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface BriefResult {
  brief: Record<string, unknown>;
  briefId: string;
  pdfUrl: string;
}

const MIN_EXCHANGES = 8;

// ─── Persistence ──────────────────────────────────────────────────────────────
const STORAGE_KEY = 'syntech_session_v1';
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24h

interface PersistedState {
  sessionId: string;
  privacyMode: PrivacyMode;
  chatState: ChatState;
  messages: Message[];
  ndaId: string | null;
  ndaPdfUrl: string | null;
  briefResult: BriefResult | null;
  savedAt: number;
}

const RESTORABLE_STATES: ChatState[] = ['chatting', 'brief-ready', 'brief-complete'];

function saveToStorage(state: Omit<PersistedState, 'savedAt'>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, savedAt: Date.now() }));
  } catch { /* storage full or unavailable */ }
}

function loadFromStorage(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PersistedState;
    if (Date.now() - data.savedAt > SESSION_TTL) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return RESTORABLE_STATES.includes(data.chatState) ? data : null;
  } catch {
    return null;
  }
}

function clearStorage() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useChat() {
  const [chatState,        setChatState]        = useState<ChatState>('mode-select');
  const [messages,         setMessages]         = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [isTyping,         setIsTyping]         = useState(false);
  const [sessionId,        setSessionId]        = useState<string | null>(null);
  const [privacyMode,      setPrivacyMode]      = useState<PrivacyMode | null>(null);
  const [ndaId,            setNdaId]            = useState<string | null>(null);
  const [ndaPdfUrl,        setNdaPdfUrl]        = useState<string | null>(null);
  const [briefResult,      setBriefResult]      = useState<BriefResult | null>(null);
  const [error,            setError]            = useState<string | null>(null);
  const [isLoading,        setIsLoading]        = useState(false);
  const [lastSuggestions,  setLastSuggestions]  = useState<string[]>([]);
  const [savedSession,     setSavedSession]     = useState<PersistedState | null>(null);

  const socketRef = useRef<Socket | null>(null);

  const userMessageCount = messages.filter(m => m.role === 'user').length;
  const progressPct = Math.min(100, Math.round((userMessageCount / MIN_EXCHANGES) * 100));

  // ─── Charger la session persistée au montage ─────────────────────────────
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) setSavedSession(saved);
  }, []);

  // ─── Sauvegarder l'état en localStorage à chaque changement important ────
  useEffect(() => {
    if (!sessionId || !privacyMode || !RESTORABLE_STATES.includes(chatState)) return;
    saveToStorage({ sessionId, privacyMode, chatState, messages, ndaId, ndaPdfUrl, briefResult });
  }, [sessionId, privacyMode, chatState, messages, ndaId, ndaPdfUrl, briefResult]);

  // ─── Cleanup socket on unmount ───────────────────────────────────────────
  useEffect(() => {
    return () => { socketRef.current?.disconnect(); };
  }, []);

  // ─── Connecter le WebSocket et écouter les events ─────────────────────────
  const connectSocket = useCallback((sid: string, initialMessages: Message[], targetState: ChatState = 'chatting') => {
    const socket = createSocket(sid);
    socketRef.current = socket;

    setMessages(initialMessages);

    socket.on('connect', () => { setChatState(targetState); });

    socket.on('chat:typing', ({ isTyping: typing }: { isTyping: boolean }) => {
      setIsTyping(typing);
      if (!typing) setStreamingContent('');
    });

    socket.on('chat:chunk', ({ delta }: { delta: string }) => {
      setIsTyping(false);
      setStreamingContent(prev => prev + delta);
    });

    socket.on('chat:response', ({ assistantMessage, briefReady, suggestions }: {
      userMessage: Message;
      assistantMessage: Message;
      briefReady: boolean;
      suggestions?: string[];
    }) => {
      setMessages(prev => [...prev, assistantMessage]);
      setStreamingContent('');
      setLastSuggestions(suggestions ?? []);
      if (briefReady) setChatState('brief-ready');
    });

    socket.on('brief:ready', () => { setChatState('brief-ready'); });

    socket.on('brief:complete', (data: BriefResult) => {
      setBriefResult(data);
      setChatState('brief-complete');
    });

    socket.on('error', ({ message }: { message: string }) => { setError(message); });
    socket.on('connect_error', (err: Error) => {
      // Session expirée côté serveur — on efface le cache et on repart de zéro
      if (err.message === 'SESSION_NOT_FOUND' || err.message === 'SESSION_NOT_ACTIVE') {
        clearStorage();
        setSavedSession(null);
        setChatState('mode-select');
        setMessages([]);
        setSessionId(null);
        setPrivacyMode(null);
      } else {
        setError(`Connexion impossible : ${err.message}`);
      }
    });
  }, []);

  // ─── Reprendre une session sauvegardée ───────────────────────────────────
  const restoreSession = useCallback(() => {
    if (!savedSession) return;
    const s = savedSession;
    setSavedSession(null);
    setSessionId(s.sessionId);
    setPrivacyMode(s.privacyMode);
    setNdaId(s.ndaId);
    setNdaPdfUrl(s.ndaPdfUrl);

    if (s.chatState === 'brief-complete' && s.briefResult) {
      setBriefResult(s.briefResult);
      setMessages(s.messages);
      setChatState('brief-complete');
      return;
    }

    connectSocket(s.sessionId, s.messages, s.chatState);
  }, [savedSession, connectSocket]);

  // ─── Ignorer la session sauvegardée et repartir de zéro ──────────────────
  const discardSavedSession = useCallback(() => {
    clearStorage();
    setSavedSession(null);
  }, []);

  // ─── Sélectionner un mode ─────────────────────────────────────────────────
  const selectMode = useCallback(async (mode: PrivacyMode) => {
    setIsLoading(true);
    setError(null);
    try {
      const { session } = await createSession(mode);
      setSessionId(session.id);
      setPrivacyMode(mode);
      setChatState(mode === 'nda' ? 'nda-form' : 'doc-check');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Soumettre le formulaire NDA ─────────────────────────────────────────
  const submitNDAForm = useCallback(async (
    clientName: string,
    clientEmail: string,
    companyName?: string
  ) => {
    if (!sessionId) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await createNDA(sessionId, clientName, clientEmail, companyName);
      setNdaId(data.ndaId);
      setNdaPdfUrl(data.pdfUrl);
      setChatState('nda-pending');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du NDA');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // ─── Accepter le NDA ─────────────────────────────────────────────────────
  const handleAcceptNDA = useCallback(async () => {
    if (!ndaId || !sessionId || !privacyMode) return;
    setIsLoading(true);
    setError(null);
    try {
      await acceptNDA(ndaId);
      setChatState('doc-check');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'acceptation du NDA");
    } finally {
      setIsLoading(false);
    }
  }, [ndaId, sessionId, privacyMode]);

  // ─── Partir de zéro (sans document) ──────────────────────────────────────
  const skipDocAndStart = useCallback(async () => {
    if (!sessionId || !privacyMode) return;
    setIsLoading(true);
    setError(null);
    try {
      const { welcomeMessage } = await startConversation(sessionId, privacyMode);
      connectSocket(sessionId, [{
        id: 'welcome',
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date().toISOString(),
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, privacyMode, connectSocket]);

  // ─── Uploader un document existant ────────────────────────────────────────
  const uploadDocAndStart = useCallback(async (file: File) => {
    if (!sessionId || !privacyMode) return;
    setIsLoading(true);
    setError(null);
    try {
      const { welcomeMessage } = await startDocumentConversation(sessionId, privacyMode);
      connectSocket(sessionId, [{
        id: 'welcome',
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date().toISOString(),
      }]);
      setIsTyping(true);
      const result = await uploadDocument(sessionId, file);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: `doc-${Date.now()}`,
        role: 'assistant' as const,
        content: result.analysis,
        timestamp: new Date().toISOString(),
      }]);
    } catch (err) {
      setIsTyping(false);
      setError(err instanceof Error ? err.message : "Erreur lors de l'analyse du document");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, privacyMode, connectSocket]);

  // ─── Envoyer un message ──────────────────────────────────────────────────
  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current?.connected || !content.trim()) return;
    const tempMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);
    setError(null);
    setLastSuggestions([]);
    socketRef.current.emit('chat:message', { content: content.trim() });
  }, []);

  // ─── Générer le brief ────────────────────────────────────────────────────
  const generateBrief = useCallback(() => {
    if (!socketRef.current?.connected) return;
    setIsLoading(true);
    socketRef.current.emit('brief:generate');
  }, []);

  useEffect(() => {
    if (briefResult) setIsLoading(false);
  }, [briefResult]);

  return {
    chatState,
    messages,
    streamingContent,
    isTyping,
    sessionId,
    privacyMode,
    ndaId,
    ndaPdfUrl,
    briefResult,
    error,
    isLoading,
    userMessageCount,
    progressPct,
    minExchanges: MIN_EXCHANGES,
    lastSuggestions,
    savedSession,
    selectMode,
    submitNDAForm,
    handleAcceptNDA,
    skipDocAndStart,
    uploadDocAndStart,
    sendMessage,
    generateBrief,
    restoreSession,
    discardSavedSession,
    clearError: () => setError(null),
  };
}
