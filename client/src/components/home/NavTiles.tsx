import { Link } from 'react-router-dom';

/**
 * NavTiles — 10 категорий с 3D-иконками (PNG с china-ru.ru).
 * Воздушный дизайн: белые карточки на светло-сером фоне страницы.
 */

const CN_ICONS = 'https://china-ru.ru/upload/travel/icons';

const tiles = [
  { to: '/flights',    label: 'Авиабилеты', icon: 'avia' },
  { to: '/trains',     label: 'Ж/Д билеты', icon: 'train' },
  { to: '/buses',      label: 'Автобусы',   icon: 'bus' },
  { to: '/hotels',     label: 'Отели',      icon: 'hotel' },
  { to: '/tours',      label: 'Туры',       icon: 'tour' },
  { to: '/visa',       label: 'Визы',       icon: 'visa' },
  { to: '/business',   label: 'Бизнес',     icon: 'business' },
  { to: '/car-rental', label: 'Авто',       icon: 'auto' },
  { to: '/insurance',  label: 'Страховки',  icon: 'insurance' },
  { to: '/concierge',  label: 'Консьерж',   icon: 'concierge' },
];

export function NavTiles() {
  return (
    <section className="max-w-[1320px] mx-auto px-4 md:px-8 -mt-12 md:-mt-16 relative z-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2.5 md:gap-3">
        {tiles.map((t, i) => (
          <Link
            key={t.to}
            to={t.to}
            className="group bg-white border border-ink-100 rounded-2xl p-3 md:p-4 flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] hover:border-brand-200 animate-float-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="w-14 h-14 md:w-16 md:h-16 mb-2 flex items-center justify-center transition-transform group-hover:scale-110">
              <img
                src={`${CN_ICONS}/${t.icon}.png`}
                alt={t.label}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="text-xs md:text-sm font-bold text-ink-900 leading-tight">
              {t.label}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
