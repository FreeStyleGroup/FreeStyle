import { useEffect, useRef, useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * LanguageSwitcher — переключатель языков (UI-only пока).
 * 3 языка: RU / EN / ZH. Реальное переключение i18next подключим позже.
 */

interface Lang {
  code: 'ru' | 'en' | 'zh';
  badge: string;
  label: string;
  sub: string;
}

const LANGS: Lang[] = [
  { code: 'ru', badge: 'RU', label: 'Русский', sub: 'Россия' },
  { code: 'en', badge: 'EN', label: 'English', sub: 'International' },
  { code: 'zh', badge: '中', label: '中文',    sub: '中国' },
];

export function LanguageSwitcher() {
  const [active, setActive] = useState<Lang['code']>('ru');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Закрытие по клику снаружи + Escape
  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const current = LANGS.find((l) => l.code === active) ?? LANGS[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-2 rounded-lg transition-colors cursor-pointer',
          open ? 'bg-surface-2 text-ink-900' : 'text-ink-500 hover:text-ink-900 hover:bg-surface-2',
        )}
        aria-label="Сменить язык"
        aria-expanded={open}
      >
        <Globe className="w-4 h-4" />
        <span className="text-[12px] font-bold uppercase tracking-wider">{current.code}</span>
        <ChevronDown className={cn('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] right-0 z-50 w-56 bg-white border border-ink-100 rounded-2xl shadow-[var(--shadow-hover)] p-1.5 animate-modal-in">
          {LANGS.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => { setActive(lang.code); setOpen(false); }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left cursor-pointer',
                lang.code === active
                  ? 'bg-brand-50 text-brand-700'
                  : 'hover:bg-surface-2 text-ink-700',
              )}
            >
              <span
                className={cn(
                  'grid place-items-center w-8 h-8 rounded-lg text-[12px] font-extrabold tracking-tight shrink-0',
                  lang.code === active ? 'bg-brand-100 text-brand-700' : 'bg-surface-2 text-ink-600',
                )}
              >
                {lang.badge}
              </span>
              <span className="flex-1 leading-tight">
                <span className="block font-bold text-[13.5px]">{lang.label}</span>
                <span className="block text-[11px] text-ink-400">{lang.sub}</span>
              </span>
              {lang.code === active && <Check className="w-4 h-4 text-brand-600 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
