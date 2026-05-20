import { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { FieldCard } from './FieldCard';
import { Popup } from './Popup';
import { useAutocomplete } from '@/hooks/useAutocomplete';
import type { AutocompleteItem } from '@freestyle/shared';

/**
 * AirportField — карточка-поле «Откуда / Куда» с popup-autocomplete городов.
 * При первом открытии — подсказывает популярные направления.
 */

const POPULAR = [
  { name: 'Москва',     code: 'MOW', sub: 'все аэропорты' },
  { name: 'Санкт-Петербург', code: 'LED', sub: 'Пулково' },
  { name: 'Стамбул',    code: 'IST', sub: 'все аэропорты' },
  { name: 'Дубай',      code: 'DXB', sub: 'все аэропорты' },
  { name: 'Пекин',      code: 'BJS', sub: '北京 · все аэропорты' },
  { name: 'Тбилиси',    code: 'TBS', sub: 'Tbilisi Intl' },
];

interface AirportFieldProps {
  label: string;
  value: AutocompleteItem | null;
  onChange: (v: AutocompleteItem) => void;
  rightSlot?: React.ReactNode;
  className?: string;
}

export function AirportField({ label, value, onChange, rightSlot, className }: AirportFieldProps) {
  const [open, setOpen] = useState(false);
  const { query, setQuery, suggestions, isLoading } = useAutocomplete();

  useEffect(() => {
    if (!open) setQuery('');
  }, [open, setQuery]);

  const handleSelect = (item: AutocompleteItem) => {
    onChange(item);
    setOpen(false);
  };

  // Что показать: реальные подсказки от API или fallback популярных городов
  const showItems = query.length >= 2 ? suggestions : POPULAR.map((p) => ({
    type: 'city' as const,
    code: p.code,
    name: p.name,
    cityCode: p.code,
    cityName: p.name,
    countryName: p.sub,
  } as AutocompleteItem));

  return (
    <div data-field className={`relative ${className ?? ''}`}>
      <FieldCard
        label={label}
        value={value?.name}
        sub={value ? `${value.code} · ${value.countryName ?? ''}` : null}
        placeholder="Город или аэропорт"
        isOpen={open}
        onClick={() => setOpen(true)}
        rightSlot={rightSlot}
      />

      <Popup isOpen={open} onClose={() => setOpen(false)} width="400px">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Москва, MOW, Шереметьево..."
            className="w-full pl-10 pr-3 py-2.5 bg-surface-2 rounded-xl text-[14px] font-medium text-ink-900 placeholder:text-ink-400 border-0 outline-none focus:bg-white focus:shadow-[0_0_0_2px_rgba(198,40,40,.2)] transition-all"
          />
        </div>

        <div className="max-h-[320px] overflow-y-auto -mx-1">
          {isLoading && (
            <div className="px-3 py-6 text-center text-sm text-ink-400">Ищем…</div>
          )}
          {!isLoading && query.length >= 2 && showItems.length === 0 && (
            <div className="px-3 py-6 text-center text-sm text-ink-400">Ничего не нашли</div>
          )}
          {!isLoading && query.length < 2 && (
            <div className="px-2 pt-1 pb-1.5 text-[10.5px] uppercase tracking-[.1em] font-bold text-ink-400">
              Популярные направления
            </div>
          )}
          {!isLoading && showItems.map((item) => (
            <button
              key={`${item.code}-${item.name}`}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-2 transition-colors text-left cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-ink-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[14px] text-ink-900 truncate">{item.name}</div>
                <div className="text-[12px] text-ink-500 truncate">
                  {item.code}
                  {item.countryName ? ` · ${item.countryName}` : ''}
                </div>
              </div>
            </button>
          ))}
        </div>
      </Popup>
    </div>
  );
}
