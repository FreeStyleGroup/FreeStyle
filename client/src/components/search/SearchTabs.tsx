import { useEffect, useRef, useState } from 'react';
import {
  Plane, BedDouble, Map, Car, Train, Bus, Mountain, ShieldCheck,
} from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * SearchTabs — 8 табов с slide-indicator (как China travel-v2).
 * Выбранный таб поднимается в state и определяет какая форма рендерится снаружи.
 */

export type SearchTabKey =
  | 'flights' | 'hotels' | 'tours' | 'car-rental'
  | 'trains' | 'buses' | 'excursions' | 'insurance';

export const SEARCH_TABS: Array<{
  key: SearchTabKey;
  label: string;
  Icon: typeof Plane;
}> = [
  { key: 'flights',    label: 'Авиабилеты', Icon: Plane },
  { key: 'hotels',     label: 'Отели',      Icon: BedDouble },
  { key: 'tours',      label: 'Туры',       Icon: Map },
  { key: 'car-rental', label: 'Авто',       Icon: Car },
  { key: 'trains',     label: 'Ж/Д',        Icon: Train },
  { key: 'buses',      label: 'Автобусы',   Icon: Bus },
  { key: 'excursions', label: 'Экскурсии',  Icon: Mountain },
  { key: 'insurance',  label: 'Страховка',  Icon: ShieldCheck },
];

interface SearchTabsProps {
  active: SearchTabKey;
  onChange: (key: SearchTabKey) => void;
}

export function SearchTabs({ active, onChange }: SearchTabsProps) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  // Пересчитываем позицию indicator при смене активного таба и при resize
  useEffect(() => {
    const recalc = () => {
      const el = tabRefs.current[active];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [active]);

  return (
    <div className="relative inline-flex flex-wrap gap-1 bg-surface-2 rounded-2xl p-1.5">
      {/* Slide indicator — двигается под активный таб */}
      <div
        className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-sm pointer-events-none transition-all duration-[350ms] ease-[cubic-bezier(.2,.8,.2,1)]"
        style={{ left: indicator.left, width: indicator.width }}
      />

      {SEARCH_TABS.map(({ key, label, Icon }) => (
        <button
          key={key}
          ref={(el) => { tabRefs.current[key] = el; }}
          onClick={() => onChange(key)}
          type="button"
          className={cn(
            'relative z-10 px-4 md:px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap',
            active === key ? 'text-brand-600' : 'text-ink-500 hover:text-ink-700',
          )}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
