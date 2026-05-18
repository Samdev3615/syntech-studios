'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { createSocket, type Socket } from '@/lib/socket';
import {
  createSession, startConversation, createNDA, acceptNDA,
  type PrivacyMode,
} from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────
export type ChatState =
  | 'mode-select'
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

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useChat() {
  const [chatState,       setChatState]       = useState<ChatState>('mode-select');
  const [messages,        setMessages]        = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [isTyping,        setIsTyping]        = useState(false);
  const [sessionId,       setSessionId]       = useState<string | null>(null);
  const [privacyMode,     setPrivacyMode]     = useState<PrivacyMode | null>(null);
  const [ndaId,           setNdaId]           = useState<string | null>(null);
  const [ndaPdfUrl,       setNdaPdfUrl]       = useState<string | null>(null);
  const [briefResult,     setBriefResult]     = useState<BriefResult | null>(null);
  const [error,           setError]           = useState<string | null>(null);
  const [isLoading,       setIsLoading]       = useState(false);

  const socketRef = useRef<Socket | null>(null);

  // ─── Cleanup socket on unmount ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // ─── Connecter le WebSocket et écouter les events ─────────────────────────
  const connectSocket = useCallback((sid: string, welcomeMsg: string) => {
    const socket = createSocket(sid);
    socketRef.current = socket;

    // Welcome message (already received via HTTP, show it)
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: welcomeMsg,
      timestamp: new Date().toISOString(),
    }]);

    socket.on('connect', () => {
      setChatState('chatting');
    });

    socket.on('chat:typing', ({ isTyping: typing }: { isTyping: boolean }) => {
      setIsTyping(typing);
      if (!typing) setStreamingContent('');
    });

    socket.on('chat:chunk', ({ delta }: { delta: string }) => {
      setIsTyping(false);
      setStreamingContent(prev => prev + delta);
    });

    socket.on('chat:response', ({ assistantMessage, briefReady }: {
      userMessage: Message;
      assistantMessage: Message;
      briefReady: boolean;
    }) => {
      setMessages(prev => [...prev, assistantMessage]);
      setStreamingContent('');
      if (briefReady) setChatState('brief-ready');
    });

    socket.on('brief:ready', () => {
      setChatState('brief-ready');
    });

    socket.on('brief:complete', (data: BriefResult) => {
      setBriefResult(data);
      setChatState('brief-complete');
    });

    socket.on('error', ({ message }: { message: string }) => {
      setError(message);
    });

    socket.on('connect_error', (err: Error) => {
      setError(`Connexion impossible : ${err.message}`);
    });
  }, []);

  // ─── Sélectionner un mode et démarrer la session ─────────────────────────
  const selectMode = useCallback(async (mode: PrivacyMode) => {
    setIsLoading(true);
    setError(null);
    try {
      const { session } = await createSession(mode);
      setSessionId(session.id);
      setPrivacyMode(mode);

      if (mode === 'nda') {
        setChatState('nda-form');
      } else {
        const { welcomeMessage } = await startConversation(session.id, mode);
        connectSocket(session.id, welcomeMessage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [connectSocket]);

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
      const { welcomeMessage } = await startConversation(sessionId, privacyMode);
      connectSocket(sessionId, welcomeMessage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'acceptation du NDA');
    } finally {
      setIsLoading(false);
    }
  }, [ndaId, sessionId, privacyMode, connectSocket]);

  // ─── Envoyer un message ──────────────────────────────────────────────────
  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current?.connected || !content.trim()) return;

    // Ajout optimiste du message utilisateur
    const tempMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);
    setError(null);

    socketRef.current.emit('chat:message', { content: content.trim() });
  }, []);

  // ─── Générer le brief ────────────────────────────────────────────────────
  const generateBrief = useCallback(() => {
    if (!socketRef.current?.connected) return;
    setIsLoading(true);
    socketRef.current.emit('brief:generate');
    // isLoading cleared when brief:complete arrives
  }, []);

  // Clear isLoading when brief arrives
  useEffect(() => {
    if (briefResult) setIsLoading(false);
  }, [briefResult]);

  return {
    // State
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
    // Actions
    selectMode,
    submitNDAForm,
    handleAcceptNDA,
    sendMessage,
    generateBrief,
    clearError: () => setError(null),
  };
}
