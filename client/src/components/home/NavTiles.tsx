import { Link } from 'react-router-dom';
import {
  Plane, BedDouble, Map, Car, Train, Bus, Mountain, ShieldCheck,
} from 'lucide-react';

/**
 * NavTiles — сетка 8 категорий путешествий (как у Travelask + China v2).
 * Каждая карточка ведёт на свою страницу.
 * Используется ниже hero на главной.
 */

const tiles = [
  { to: '/flights',    label: 'Авиабилеты',  desc: 'Дешёвые рейсы',   Icon: Plane,       hue: 'from-brand-500 to-brand-700' },
  { to: '/hotels',     label: 'Отели',       desc: 'Отели и хостелы', Icon: BedDouble,   hue: 'from-amber-500 to-amber-600' },
  { to: '/tours',      label: 'Туры',        desc: 'Готовые пакеты',  Icon: Map,         hue: 'from-mint-500 to-teal-600' },
  { to: '/car-rental', label: 'Авто',        desc: 'Аренда машин',    Icon: Car,         hue: 'from-blue-500 to-indigo-600' },
  { to: '/trains',     label: 'Ж/Д',         desc: 'Поезда РЖД',      Icon: Train,       hue: 'from-purple-500 to-pink-600' },
  { to: '/buses',      label: 'Автобусы',    desc: 'Маршруты по РФ',  Icon: Bus,         hue: 'from-orange-500 to-red-600' },
  { to: '/excursions', label: 'Экскурсии',   desc: 'С гидом',         Icon: Mountain,    hue: 'from-emerald-500 to-green-600' },
  { to: '/insurance',  label: 'Страховка',   desc: 'Полис в дорогу',  Icon: ShieldCheck, hue: 'from-rose-500 to-pink-600' },
];

export function NavTiles() {
  return (
    <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
      <div className="mb-8 md:mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-600 text-[11px] font-bold tracking-[.15em] uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-amber" />
          Все услуги
        </div>
        <h2 className="font-display text-2xl md:text-4xl font-extrabold text-ink-900 tracking-tight">
          Всё для путешествия <span className="text-brand-600">в одном месте</span>
        </h2>
        <p className="mt-3 text-ink-500 max-w-2xl mx-auto">
          От авиабилетов до страховки — соберите идеальную поездку за минуту.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {tiles.map(({ to, label, desc, Icon, hue }, i) => (
          <Link
            key={to}
            to={to}
            className="group relative bg-white border border-ink-100 rounded-2xl p-5 md:p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] hover:border-brand-200 animate-float-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${hue} text-white grid place-items-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div className="font-display font-bold text-base md:text-lg text-ink-900 mb-0.5">
              {label}
            </div>
            <div className="text-xs md:text-sm text-ink-500">
              {desc}
            </div>
            {/* стрелочка-индикатор */}
            <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-2 text-ink-400 grid place-items-center opacity-0 group-hover:opacity-100 group-hover:bg-brand-50 group-hover:text-brand-600 transition-all">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
