import { Plane, BedDouble } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * SearchTabs — два таба основного поиска (Авиабилеты / Отели).
 * Остальные категории (Туры/Ж-Д/Автобусы/Авто/Экскурсии/Страховки/Визы/Бизнес/Консьерж)
 * представлены отдельной сеткой NavTiles с 3D-иконками ниже hero.
 *
 * Индикатор реализован чистым CSS (grid-2 + absolute с left/width в %),
 * без useRef и пересчёта offsetWidth — работает с первого рендера.
 */

export type SearchTabKey = 'flights' | 'hotels';

export const SEARCH_TABS: Array<{
  key: SearchTabKey;
  label: string;
  Icon: typeof Plane;
}> = [
  { key: 'flights', label: 'Авиабилеты', Icon: Plane },
  { key: 'hotels',  label: 'Отели',      Icon: BedDouble },
];

interface SearchTabsProps {
  active: SearchTabKey;
  onChange: (key: SearchTabKey) => void;
}

export function SearchTabs({ active, onChange }: SearchTabsProps) {
  return (
    <div className="relative inline-grid grid-cols-2 bg-surface-2 rounded-2xl p-1.5 w-fit">
      {/* Slide indicator — занимает ровно 50% контейнера минус p-1.5 */}
      <div
        className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-sm pointer-events-none transition-all duration-[350ms] ease-[cubic-bezier(.2,.8,.2,1)]"
        style={{
          left: active === 'flights' ? '0.375rem' : '50%',
          width: 'calc(50% - 0.375rem)',
        }}
      />
      {SEARCH_TABS.map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          type="button"
          className={cn(
            'relative z-10 px-6 md:px-7 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2 whitespace-nowrap',
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
