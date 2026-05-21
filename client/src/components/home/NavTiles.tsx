import { Link } from 'react-router-dom';

/**
 * NavTiles — 10 категорий с 3D-иконками.
 * Крупные плитки, фиксированная высота, без overlap с соседними секциями.
 */

const CN_ICONS = 'https://china-ru.ru/upload/travel/icons';

interface Tile {
  to: string;
  label: string;
  icon: string;
  iconUrl?: string;   // override на свой хост (для брендированных иконок типа cat-concierge)
}

const tiles: Tile[] = [
  { to: '/flights',    label: 'Авиабилеты', icon: 'avia' },
  { to: '/trains',     label: 'Ж/Д билеты', icon: 'train' },
  { to: '/buses',      label: 'Автобусы',   icon: 'bus' },
  { to: '/hotels',     label: 'Отели',      icon: 'hotel' },
  { to: '/tours',      label: 'Туры',       icon: 'tour' },
  { to: '/visa',       label: 'Визы',       icon: 'visa' },
  { to: '/business',   label: 'Бизнес',     icon: 'business' },
  { to: '/car-rental', label: 'Авто',       icon: 'auto' },
  { to: '/insurance',  label: 'Страховки',  icon: 'insurance' },
  {
    to: '/concierge',
    label: 'Консьерж',
    icon: 'concierge',
    iconUrl: 'https://freestyle.ru/images/cat-concierge.png',
  },
];

export function NavTiles() {
  return (
    <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {tiles.map((t, i) => (
          <Link
            key={t.to}
            to={t.to}
            className="group bg-white border border-ink-100 rounded-2xl px-3 py-6 md:py-7 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] hover:border-brand-200 animate-float-up min-h-[160px] md:min-h-[180px]"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 mb-3 flex items-center justify-center transition-transform group-hover:scale-110">
              <img
                src={t.iconUrl ?? `${CN_ICONS}/${t.icon}.png`}
                alt={t.label}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain drop-shadow-sm"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="text-sm md:text-[15px] font-bold text-ink-900 leading-tight">
              {t.label}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
