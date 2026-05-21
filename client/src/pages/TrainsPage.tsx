import { Train, MapPin, Clock, ArrowRight } from 'lucide-react';
import { tpRefLink } from '@/components/affiliate/TpWidget';

/**
 * TrainsPage — РЖД билеты через Tutu.travel (партнёр Travelpayouts).
 */
export function TrainsPage() {
  const link = tpRefLink({
    base: 'https://tp.media/r',
    params: { p: '4115', u: 'https://www.tutu.ru/poezda/' },
    subId: 'trains_main',
  });

  const routes = [
    { from: 'Москва',   to: 'Санкт-Петербург', time: '4 ч',  from_price: 2100 },
    { from: 'Москва',   to: 'Казань',          time: '12 ч', from_price: 2800 },
    { from: 'Москва',   to: 'Сочи',            time: '24 ч', from_price: 4500 },
    { from: 'СПб',      to: 'Москва',          time: '4 ч',  from_price: 2100 },
    { from: 'Москва',   to: 'Минск',           time: '8 ч',  from_price: 3200 },
    { from: 'Москва',   to: 'Нижний Новгород', time: '4 ч',  from_price: 1900 },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-ink-800 to-brand-700 text-white">
        <div className="absolute inset-0 hero-overlay opacity-50" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-mono font-medium uppercase tracking-[.18em] mb-6">
            <Train className="w-3 h-3 text-amber-400" /> РЖД и СНГ
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
            Билеты на поезда <em className="not-italic text-amber-400">по России и СНГ</em>
          </h1>
          <p className="text-white/85 text-lg mt-5 max-w-2xl">
            Покупка билетов РЖД и поездов СНГ через Tutu.travel. Электронный билет на email, посадка по паспорту, бесплатная отмена за час до отправления.
          </p>
          <a href={link} target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-xl bg-white text-brand-700 font-bold hover:-translate-y-0.5 transition-all">
            Найти поезд <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="font-display font-extrabold text-3xl text-ink-900 mb-2">Популярные направления</h2>
        <p className="text-ink-500 mb-8">Цена от — плацкарт, в один конец</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((r, i) => (
            <a key={i} href={link} target="_blank" rel="noopener sponsored" className="group bg-white border border-ink-100 rounded-2xl p-5 hover:border-brand-300 hover:shadow-sm transition-all flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 grid place-items-center shrink-0">
                <Train className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-extrabold text-lg text-ink-900 leading-tight">
                  {r.from} → {r.to}
                </div>
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
        <MapPin className="w-10 h-10 mx-auto text-brand-600 mb-4" />
        <h2 className="font-display font-extrabold text-3xl text-ink-900 mb-3">Готовы купить билет?</h2>
        <p className="text-ink-500 mb-6 max-w-xl mx-auto">Откройте поиск на Tutu.travel — все направления РЖД + поезда Беларуси, Казахстана и Узбекистана.</p>
        <a href={link} target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg">
          Найти билет <ArrowRight className="w-4 h-4" />
        </a>
      </section>
    </div>
  );
}
