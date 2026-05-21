import { Sparkles } from 'lucide-react';
import { useAIChat } from './AIChatContext';

/**
 * AIChip — компактная кликабельная плашка в Header.
 * Открывает чат с Феликсом-консьержем.
 */
export function AIChip() {
  const { open } = useAIChat();

  return (
    <button
      type="button"
      onClick={open}
      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-gradient-to-r from-brand-50 to-amber-500/10 border border-brand-200 hover:border-brand-500 hover:from-brand-100 transition-all group cursor-pointer"
      title="AI-консьерж Феликс"
    >
      {/* Аватар маскота */}
      <span className="relative w-7 h-7 rounded-full bg-white border border-brand-200 overflow-hidden grid place-items-center shrink-0">
        <img
          src="https://freestyle.ru/images/cat-concierge.png"
          alt="Феликс"
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        {/* Пульсирующий sparkle-badge в углу */}
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 grid place-items-center rounded-full bg-brand-600 text-white">
          <Sparkles className="w-2 h-2" />
        </span>
      </span>

      <span className="leading-tight text-left">
        <span className="block font-bold text-[12px] text-brand-700 tracking-tight">
          AI Ассистент
        </span>
        <span className="block text-[10px] text-ink-500 font-medium">
          Феликс · онлайн
        </span>
      </span>
    </button>
  );
}
