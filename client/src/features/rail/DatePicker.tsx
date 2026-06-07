import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * DatePicker — кастомный выпадающий календарь (RU, неделя с понедельника).
 * Заменяет нативный <input type=date>: единый вид во всех браузерах,
 * подсветка сегодня/выбранного, блокировка дат раньше min, быстрые действия.
 */
interface Props {
  label: string;
  value: string;                 // 'yyyy-mm-dd' | ''
  onChange: (v: string) => void;
  min?: string;                  // 'yyyy-mm-dd'
  placeholder?: string;
  clearable?: boolean;           // показать «×» для сброса (обратный билет)
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const pad = (n: number) => String(n).padStart(2, '0');
const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayKey = () => toKey(new Date());

function parseKey(key: string): { year: number; month: number } {
  const [y, m] = key.split('-').map(Number);
  if (!y || !m) {
    const t = new Date();
    return { year: t.getFullYear(), month: t.getMonth() };
  }
  return { year: y, month: m - 1 };
}

/** 6×7 сетка дней: с понедельника на/до 1-го числа. */
function buildGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Пн = 0
  const start = new Date(year, month, 1 - offset);
  return Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
}

function fmtTrigger(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const s = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', weekday: 'short' });
  return s.replace('.', ''); // «7 июн, вс»
}

export function DatePicker({ label, value, onChange, min, placeholder = 'Выберите дату', clearable }: Props) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => parseKey(value || min || todayKey()));
  const ref = useRef<HTMLDivElement | null>(null);

  // Если значение/мин изменились извне — подвинуть видимый месяц
  useEffect(() => {
    if (value) setView(parseKey(value));
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const grid = useMemo(() => buildGrid(view.year, view.month), [view]);
  const minKey = min ?? '';
  const today = todayKey();
  const monthTitle = new Date(view.year, view.month, 1)
    .toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
    .replace(/^./, (c) => c.toUpperCase());

  const pick = (d: Date) => {
    onChange(toKey(d));
    setOpen(false);
  };
  const shiftMonth = (delta: number) =>
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  return (
    <div ref={ref} className="block">
      <span className="block text-[12px] font-semibold text-ink-500 mb-1.5">{label}</span>
      <div className="relative">
        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none z-10" />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn('fs-rail-input text-left flex items-center', !value && 'text-ink-400')}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          {value ? fmtTrigger(value) : placeholder}
        </button>

        {clearable && value && !open && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(''); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 grid place-items-center rounded-md text-ink-400 hover:text-brand-600 hover:bg-surface-2"
            aria-label="Убрать дату"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {open && (
          <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-[19rem] max-w-[calc(100vw-2rem)] bg-white border border-ink-100 rounded-2xl shadow-[var(--shadow-hover)] p-3 animate-modal-in">
            {/* Заголовок месяца */}
            <div className="flex items-center justify-between mb-2">
              <button type="button" onClick={() => shiftMonth(-1)} className="w-8 h-8 grid place-items-center rounded-lg text-ink-500 hover:bg-surface-2 hover:text-brand-600" aria-label="Предыдущий месяц">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-display font-extrabold text-ink-900 text-[15px]">{monthTitle}</span>
              <button type="button" onClick={() => shiftMonth(1)} className="w-8 h-8 grid place-items-center rounded-lg text-ink-500 hover:bg-surface-2 hover:text-brand-600" aria-label="Следующий месяц">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Дни недели */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map((w, i) => (
                <div key={w} className={cn('text-center text-[11px] font-bold py-1', i >= 5 ? 'text-brand-400' : 'text-ink-400')}>{w}</div>
              ))}
            </div>

            {/* Сетка дней */}
            <div className="grid grid-cols-7 gap-1">
              {grid.map((d) => {
                const key = toKey(d);
                const inMonth = d.getMonth() === view.month;
                const disabled = minKey && key < minKey;
                const selected = key === value;
                const isToday = key === today;
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!!disabled}
                    onClick={() => pick(d)}
                    className={cn(
                      'h-9 rounded-lg text-[13px] font-semibold transition-colors tabular-nums',
                      selected
                        ? 'bg-brand-600 text-white shadow-sm'
                        : disabled
                          ? 'text-ink-300 cursor-not-allowed'
                          : inMonth
                            ? 'text-ink-700 hover:bg-brand-50 hover:text-brand-700'
                            : 'text-ink-300 hover:bg-surface-2',
                      !selected && isToday && 'ring-1 ring-inset ring-brand-300',
                    )}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Быстрые действия */}
            <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-ink-100">
              <button type="button" onClick={() => pick(new Date())} className="text-[12.5px] font-bold text-brand-600 hover:text-brand-700">
                Сегодня
              </button>
              {clearable && value && (
                <button type="button" onClick={() => { onChange(''); setOpen(false); }} className="text-[12.5px] font-semibold text-ink-400 hover:text-ink-700">
                  Очистить
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
