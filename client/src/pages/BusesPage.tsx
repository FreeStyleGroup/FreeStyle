import { Bus, ArrowRight, Clock, Wallet } from 'lucide-react';
import { tpRefLink } from '@/components/affiliate/TpWidget';

/**
 * BusesPage — автобусы через Busfor / Tutu (партнёр Travelpayouts).
 */
export function BusesPage() {
  const link = tpRefLink({
    base: 'https://tp.media/r',
    params: { p: '4115', u: 'https://busfor.ru' },
    subId: 'buses_main',
  });

  const routes = [
    { from: 'Москва', to: 'Минск',          time: '11 ч', from_price: 2400 },
    { from: 'СПб',    to: 'Хельсинки',      time: '7 ч',  from_price: 3200 },
    { from: 'Москва', to: 'Киев',           time: '14 ч', from_price: 2900 },
    { from: 'Москва', to: 'Воронеж',        time: '8 ч',  from_price: 1500 },
    { from: 'Москва', to: 'Брест',          time: '15 ч', from_price: 3100 },
    { from: 'СПб',    to: 'Таллин',         time: '8 ч',  from_price: 2800 },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-mint-700 to-brand-700 text-white">
        <div className="absolute inset-0 hero-overlay opacity-50" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-mono font-medium uppercase tracking-[.18em] mb-6">
            <Bus className="w-3 h-3 text-amber-400" /> Автобусы по СНГ и Европе
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
            Автобусные рейсы <em className="not-italic text-amber-400">по 25+ странам</em>
          </h1>
          <p className="text-white/85 text-lg mt-5 max-w-2xl">
            Россия, Беларусь, Украина, Прибалтика, Польша, Турция. Прямая покупка билетов через Busfor — крупнейший автобусный билетёр СНГ.
          </p>
          <a href={link} target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-xl bg-white text-brand-700 font-bold hover:-translate-y-0.5 transition-all">
            Найти автобус <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="font-display font-extrabold text-3xl text-ink-900 mb-2">Популярные маршруты</h2>
        <p className="text-ink-500 mb-8">Цена от — в один конец</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((r, i) => (
            <a key={i} href={link} target="_blank" rel="noopener sponsored" className="group bg-white border border-ink-100 rounded-2xl p-5 hover:border-brand-300 hover:shadow-sm transition-all flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-mint-500/15 text-mint-700 grid place-items-center shrink-0">
                <Bus className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-extrabold text-lg text-ink-900 leading-tight">{r.from} → {r.to}</div>
                <div className="text-[12.5px] text-ink-500 mt-0.5 inline-flex items-center gap-2">
                  <Clock className="w-3 h-3" />{r.time}
                  <span>·</span>
                  <span>от {r.from_price.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-400 group-hover:text-brand-600 shrink-0" />
            </a>
          ))}
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 text-center">
        <Wallet className="w-10 h-10 mx-auto text-brand-600 mb-4" />
        <h2 className="font-display font-extrabold text-3xl text-ink-900 mb-3">Готовы купить билет?</h2>
        <p className="text-ink-500 mb-6 max-w-xl mx-auto">Все автобусные перевозчики СНГ и Восточной Европы в одном поиске.</p>
        <a href={link} target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg">
          Открыть Busfor <ArrowRight className="w-4 h-4" />
        </a>
      </section>
    </div>
  );
}
