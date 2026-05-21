import { Compass, Camera, Star, ArrowRight, Users } from 'lucide-react';
import { tpRefLink } from '@/components/affiliate/TpWidget';

/**
 * ExcursionsPage — экскурсии через Tripster (партнёр Travelpayouts).
 */
export function ExcursionsPage() {
  const link = tpRefLink({
    base: 'https://tp.media/r',
    params: { p: '4115', u: 'https://experience.tripster.ru' },
    subId: 'excursions_main',
  });

  const cities = [
    { city: 'Стамбул',   count: 487, rating: 4.9, img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80' },
    { city: 'Дубай',     count: 312, rating: 4.8, img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80' },
    { city: 'Тбилиси',   count: 286, rating: 4.9, img: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80' },
    { city: 'Рим',       count: 524, rating: 4.9, img: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800&q=80' },
    { city: 'Барселона', count: 398, rating: 4.8, img: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&q=80' },
    { city: 'Прага',     count: 267, rating: 4.9, img: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80' },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 hero-overlay opacity-60" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-mono font-medium uppercase tracking-[.18em] mb-6">
            <Compass className="w-3 h-3 text-amber-500" /> Экскурсии с местными
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
            Экскурсии от <em className="not-italic text-amber-500">местных гидов</em>
          </h1>
          <p className="text-white/85 text-lg mt-5 max-w-2xl">
            40 000+ авторских экскурсий по 800+ городам мира на Tripster. Только русскоязычные гиды, отзывы от реальных путешественников, бронирование без предоплаты.
          </p>
          <a href={link} target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-xl bg-white text-brand-700 font-bold hover:-translate-y-0.5 transition-all">
            Найти экскурсию <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="font-display font-extrabold text-3xl text-ink-900 mb-2">Топ городов</h2>
        <p className="text-ink-500 mb-8">Города с самым большим выбором русскоязычных экскурсий</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cities.map((c) => (
            <a key={c.city} href={link} target="_blank" rel="noopener sponsored" className="group relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img src={c.img} alt={c.city} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="font-display font-extrabold text-2xl mb-1">{c.city}</div>
                <div className="text-[13px] opacity-90 inline-flex items-center gap-3">
                  <span>{c.count} экскурсий</span>
                  <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />{c.rating}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-surface-1 border-y border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 grid md:grid-cols-3 gap-5">
          <Feature Icon={Users}   title="Русскоязычные гиды"     text="Все экскурсии — на русском языке" />
          <Feature Icon={Star}    title="Только проверенные"      text="Реальные отзывы и рейтинги 4.8+" />
          <Feature Icon={Camera}  title="Без предоплаты"          text="Бронь сейчас — оплата гиду на месте" />
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 text-center">
        <Compass className="w-10 h-10 mx-auto text-brand-600 mb-4" />
        <h2 className="font-display font-extrabold text-3xl text-ink-900 mb-3">Готовы исследовать?</h2>
        <p className="text-ink-500 mb-6 max-w-xl mx-auto">Tripster — №1 в России по экскурсиям с местными гидами.</p>
        <a href={link} target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg">
          Открыть Tripster <ArrowRight className="w-4 h-4" />
        </a>
      </section>
    </div>
  );
}

function Feature({ Icon, title, text }: { Icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-6 hover:border-brand-300 hover:shadow-sm transition-all">
      <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 grid place-items-center mb-3"><Icon className="w-5 h-5" /></div>
      <div className="font-display font-extrabold text-lg text-ink-900 mb-1">{title}</div>
      <p className="text-sm text-ink-500">{text}</p>
    </div>
  );
}
