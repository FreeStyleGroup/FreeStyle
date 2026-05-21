import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

/**
 * AIChatContext — глобальное состояние AI-консьержа.
 * Сейчас: UI-only (chat history в state клиента, без backend).
 * Позже: подключим к /api/ai/chat с историей в БД (Фаза 5 ADMIN_CMS_BLOG.md).
 */

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  ts: number;
}

interface AIChatContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  reset: () => void;
}

const GREETING: ChatMessage = {
  id: 'greet-1',
  role: 'assistant',
  text:
    'Здравствуйте! Меня зовут Феликс, я ваш AI-консьерж по путешествиям. ' +
    'Помогу подобрать рейс, отель, тур или ответить на любые вопросы о визах и документах. С чего начнём?',
  ts: Date.now(),
};

const Context = createContext<AIChatContextValue | null>(null);

export function AIChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const reset = useCallback(() => setMessages([GREETING]), []);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text: trimmed, ts: Date.now() },
    ]);

    // TODO Фаза 5: реальный запрос на /api/ai/chat
    // Пока — заглушка с задержкой, чтобы продемонстрировать UX
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text:
            'Отличный вопрос — секунду, я уточню детали по партнёрам. ' +
            '(Это пока демо-ответ. Реальное подключение к AI появится в следующей итерации.)',
          ts: Date.now(),
        },
      ]);
    }, 900);
  }, []);

  return (
    <Context.Provider value={{ isOpen, open, close, toggle, messages, sendMessage, reset }}>
      {children}
    </Context.Provider>
  );
}

export function useAIChat() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useAIChat must be used inside AIChatProvider');
  return ctx;
}
