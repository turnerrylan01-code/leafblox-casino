import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getUserTags, ALL_TAGS } from '../data/tags';

export interface ChatMessage {
  id: string;
  username: string;
  avatar: string;
  rank: string;
  message: string;
  timestamp: number;
}

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (text: string, username: string, avatar: string) => void;
  onlineCount: number;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineCount] = useState(40);
  const { walletAddress } = useAuth();

  const sendMessage = useCallback((text: string, username: string, avatar: string) => {
    if (!text.trim()) return;
    const ownedTagIds = getUserTags(walletAddress || '');
    const ownedTags = ALL_TAGS.filter(tag => ownedTagIds.includes(tag.id));
    const rank = ownedTags.map(tag => `${tag.emoji} ${tag.name}`).join(' ') || '';
    const msg: ChatMessage = {
      id: Date.now().toString(),
      username: username || '',
      avatar: avatar || '',
      rank,
      message: text.trim(),
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev.slice(-99), msg]);
  }, [walletAddress]);

  return (
    <ChatContext.Provider value={{ messages, sendMessage, onlineCount }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
