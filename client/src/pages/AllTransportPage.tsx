import { Link } from 'react-router-dom';
import { Plane, Train, Bus, Car, ArrowRight, Compass } from 'lucide-react';

/**
 * AllTransportPage — обзорная страница «Весь транспорт».
 * Простая навигация по разделам перевозок.
 */
export function AllTransportPage() {
  const modes = [
    { Icon: Plane, name: 'Авиабилеты', text: 'Сравним 100+ авиакомпаний, найдём лучшую цену',  to: '/flights',    accent: 'from-brand-500 to-brand-700' },
    { Icon: Train, name: 'Поезда',     text: 'РЖД и СНГ — электронный билет за 2 минуты',       to: '/trains',     accent: 'from-ink-700 to-ink-900' },
    { Icon: Bus,   name: 'Автобусы',   text: 'Россия, Беларусь, Прибалтика, Польша, Турция',     to: '/buses',      accent: 'from-mint-600 to-brand-700' },
    { Icon: Car,   name: 'Аренда авто', text: '900 000+ авто в 175 странах, бесплатная отмена', to: '/car-rental', accent: 'from-amber-500 to-amber-700' },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 hero-overlay opacity-60" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-mono font-medium uppercase tracking-[.18em] mb-6">
            <Compass className="w-3 h-3 text-amber-500" /> Весь транспорт
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
            От самолёта до автобуса —<br />
            <em className="not-italic text-amber-500">в одном месте</em>
          </h1>
          <p className="text-white/85 text-lg mt-5 max-w-2xl">
            Все способы добраться куда нужно. Сравним цены, найдём пересадки, забронируем в пару кликов.
          </p>
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 gap-5">
          {modes.map((m) => (
            <Link key={m.to} to={m.to} className={`relative group rounded-2xl overflow-hidden p-8 text-white bg-gradient-to-br ${m.accent} hover:-translate-y-0.5 transition-all shadow-md hover:shadow-xl`}>
              <m.Icon className="w-10 h-10 mb-5 opacity-90" />
              <div className="font-display font-extrabold text-3xl mb-2">{m.name}</div>
              <p className="text-white/85 text-[14.5px] leading-relaxed mb-5 max-w-md">{m.text}</p>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-bold opacity-90 group-hover:opacity-100">
                Открыть <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
