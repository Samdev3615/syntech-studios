import type { Metadata } from 'next';
import { ChatInterface } from '@/components/chat/ChatInterface';

export const metadata: Metadata = {
  title: 'Assistant Projet — SynTech Studios',
  description: 'Transformez votre idée en cahier des charges structuré grâce à notre assistant IA.',
};

export default function ChatPage() {
  return <ChatInterface />;
}
