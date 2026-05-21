import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { Send, Sparkles, RotateCw, X } from 'lucide-react';
import { useAIChat } from './AIChatContext';

/**
 * AIChatModal — выезжающее окно чата справа снизу.
 * Header (gradient brand) + сообщения + быстрые подсказки + textbar.
 */

const QUICK_PROMPTS = [
  '✈️ Куда полететь летом до 30 000 ₽',
  '🏝 Лучшие отели в Дубае с пляжем',
  '🛂 Виза в Китай для россиян',
  '🚂 Поезд из Москвы в Питер',
];

export function AIChatModal() {
  const { isOpen, close, messages, sendMessage, reset } = useAIChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Автоскролл вниз при новых сообщениях
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Фокус на инпут при открытии
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (text: string) => {
    sendMessage(text);
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-[calc(100vw-48px)] sm:w-[420px] h-[600px] max-h-[calc(100vh-48px)] transition-all duration-300 ${
        isOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <div className="h-full flex flex-col bg-white rounded-3xl shadow-[0_40px_80px_-20px_rgba(15,23,42,0.35)] border border-ink-100 overflow-hidden">
        {/* ─── HEADER ─── */}
        <div className="relative px-5 py-4 hero-gradient text-white flex items-center gap-3 overflow-hidden">
          <div className="absolute inset-0 hero-overlay opacity-50" />

          <div className="relative shrink-0 w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/25 overflow-hidden grid place-items-center">
            <img
              src="https://freestyle.ru/images/cat-concierge.png"
              alt="Феликс"
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-mint-500 border-2 border-brand-700" />
          </div>

          <div className="relative flex-1 min-w-0">
            <div className="font-display font-extrabold text-[16px] leading-tight">Феликс</div>
            <div className="text-[11px] text-white/80 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
              AI-консьерж · онлайн
            </div>
          </div>

          <button
            type="button"
            onClick={reset}
            aria-label="Начать заново"
            title="Начать заново"
            className="relative w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white grid place-items-center transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={close}
            aria-label="Закрыть чат"
            className="relative w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white grid place-items-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── MESSAGES ─── */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-surface-1">
          {messages.map((m) =>
            m.role === 'assistant' ? <AssistantBubble key={m.id} text={m.text} /> : <UserBubble key={m.id} text={m.text} />
          )}

          {/* Quick prompts — показываем только пока ничего не отправлено пользователем */}
          {messages.filter((m) => m.role === 'user').length === 0 && (
            <div className="flex flex-col gap-2 pt-2">
              <div className="text-[10.5px] uppercase tracking-[.1em] font-bold text-ink-400 px-1">
                Популярные запросы
              </div>
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleQuickPrompt(p)}
                  className="text-left px-4 py-3 rounded-2xl bg-white border border-ink-100 hover:border-brand-300 hover:bg-brand-50/40 transition-all text-[13.5px] text-ink-700 hover:text-ink-900 cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── INPUT ─── */}
        <div className="px-4 py-3 bg-white border-t border-ink-100">
          <div className="flex items-end gap-2 bg-surface-2 rounded-2xl pr-1.5 pl-4 py-1.5 focus-within:bg-white focus-within:shadow-[0_0_0_2px_rgba(198,40,40,0.18)] transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Спросите Феликса о путешествиях…"
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-[14px] font-medium text-ink-900 placeholder:text-ink-400 py-2 max-h-[120px]"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim()}
              aria-label="Отправить"
              className="shrink-0 w-10 h-10 rounded-xl grid place-items-center bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[10px] text-ink-400 mt-1.5 px-2">
            Enter — отправить · Shift+Enter — новая строка
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Bubbles ───
function AssistantBubble({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="shrink-0 w-8 h-8 rounded-full bg-white border border-brand-200 overflow-hidden grid place-items-center">
        <img
          src="https://freestyle.ru/images/cat-concierge.png"
          alt="Феликс"
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <div className="bg-white rounded-2xl rounded-tl-md border border-ink-100 px-4 py-2.5 max-w-[85%] shadow-sm">
        <p className="text-[14px] leading-relaxed text-ink-900 whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl rounded-tr-md text-white px-4 py-2.5 max-w-[85%] shadow-md">
        <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}
