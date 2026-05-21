import { Sparkles, X } from 'lucide-react';
import { useAIChat } from './AIChatContext';

/**
 * AIFAB — floating action button справа снизу.
 * Скрывается когда чат открыт, появляется когда закрыт.
 */
export function AIFAB() {
  const { isOpen, open } = useAIChat();

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Открыть AI-консьерж"
      className={`fixed bottom-6 right-6 z-40 group transition-all duration-300 ${
        isOpen ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100'
      }`}
    >
      {/* Тень-пульс под маскотом */}
      <span className="absolute inset-0 rounded-full bg-brand-600/20 blur-xl scale-150 -z-10 animate-pulse" />

      <span className="relative flex items-center gap-3 pl-2 pr-5 py-2 rounded-full bg-white border border-brand-200 shadow-[0_18px_44px_-12px_rgba(198,40,40,0.45)] hover:shadow-[0_24px_56px_-12px_rgba(198,40,40,0.6)] hover:-translate-y-1 transition-all">
        {/* Аватар маскота */}
        <span className="relative w-12 h-12 rounded-full bg-gradient-to-br from-brand-50 to-amber-500/15 border border-brand-200 overflow-hidden grid place-items-center shrink-0">
          <img
            src="https://freestyle.ru/images/cat-concierge.png"
            alt="Феликс"
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          {/* Online status dot */}
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-mint-500 border-2 border-white" />
        </span>

        <span className="text-left leading-tight">
          <span className="flex items-center gap-1 text-[10px] uppercase tracking-[.12em] font-bold text-brand-600">
            <Sparkles className="w-3 h-3" />
            AI · бесплатно
          </span>
          <span className="block font-display font-bold text-[14px] text-ink-900 mt-0.5">
            Спросить Феликса
          </span>
        </span>
      </span>
    </button>
  );
}

/**
 * AIFABMinimize — кнопка свернуть чат (показывается в шапке открытой модалки).
 */
export function AIFABMinimize() {
  const { close } = useAIChat();
  return (
    <button
      type="button"
      onClick={close}
      aria-label="Свернуть чат"
      className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white grid place-items-center transition-colors cursor-pointer"
    >
      <X className="w-4 h-4" />
    </button>
  );
}
