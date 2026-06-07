import { Plane, ArrowRight, Flame } from 'lucide-react';

/**
 * HotDeals — секция с горячими предложениями (placeholder, потом из /api/flights/cheap).
 * Стиль: bento-grid с одной большой карточкой + 3 маленькими.
 */

interface Deal {
  from: string;
  to: string;
  dates: string;
  price: string;       // отформатированная цена с пробелами
  partner: string;     // тип рейса (без упоминания источника поиска)
  discount?: string;   // '-20%'
  imageUrl?: string;   // URL фото города
}

const dealsPlaceholder: Deal[] = [
  { from: 'Москва', to: 'Стамбул',  dates: '12–19 мая',  price: '18 990', partner: 'Прямой рейс', discount: '-25%' },
  { from: 'Москва', to: 'Дубай',    dates: '20–27 мая',  price: '24 500', partner: 'Прямой рейс' },
  { from: 'Москва', to: 'Пекин',    dates: '01–07 июня', price: '32 200', partner: 'С пересадкой' },
  { from: 'СПб',    to: 'Тбилиси',  dates: '15–25 июня', price: '14 800', partner: 'Прямой рейс', discount: '-15%' },
];

export function HotDeals() {
  return (
    <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
      <div className="flex items-end justify-between mb-8 md:mb-10 gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 text-[11px] font-bold tracking-[.15em] uppercase mb-3">
            <Flame className="w-3.5 h-3.5" />
            Горячие цены
          </div>
          <h2 className="font-display text-2xl md:text-4xl font-extrabold text-ink-900 tracking-tight">
            Дешёвые билеты <span className="text-brand-600">на ближайшие даты</span>
          </h2>
          <p className="mt-3 text-ink-500">
            Обновляются каждые 15 минут. Цены реальные на момент просмотра.
          </p>
        </div>
        <a
          href="/flights"
          className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
        >
          Все направления
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {dealsPlaceholder.map((deal, i) => (
          <a
            key={`${deal.from}-${deal.to}`}
            href="/flights"
            className="group relative bg-white border border-ink-100 rounded-2xl p-5 md:p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-hover)] hover:border-brand-200 animate-float-up overflow-hidden"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            {deal.discount && (
              <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-brand-600 text-white text-[11px] font-bold tabular-nums">
                {deal.discount}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-ink-500 mb-3">
              <Plane className="w-3.5 h-3.5" />
              {deal.partner}
            </div>

            <div className="font-display font-extrabold text-lg md:text-xl text-ink-900 mb-1 leading-tight">
              {deal.from}
              <span className="text-ink-400 mx-2">→</span>
              {deal.to}
            </div>

            <div className="text-sm text-ink-500 mb-4 tabular-nums">{deal.dates}</div>

            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs text-ink-500 mb-0.5">от</div>
                <div className="font-display font-extrabold text-2xl text-brand-600 tabular-nums">
                  {deal.price} <span className="text-base font-bold">₽</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-surface-2 text-ink-400 grid place-items-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
