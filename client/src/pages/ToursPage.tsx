import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Calendar, Users, Shield, Plane, ArrowRight } from 'lucide-react';
import { tpRefLink } from '@/components/affiliate/TpWidget';

/**
 * ToursPage — туры через партнёрство Travelpayouts × Sletat.
 * Прямой API туров TP не отдаёт публично; используем партнёрскую ссылку tp.media → sletat.ru.
 */
export function ToursPage() {
  const slatLink = tpRefLink({
    base: 'https://tp.media/r',
    params: { p: '5258', u: 'https://sletat.ru' },
    subId: 'tours_main',
  });

  const destinations = [
    { name: 'Турция',   img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80', from: 35000, slug: 'turkey' },
    { name: 'Египет',   img: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&q=80', from: 45000, slug: 'egypt' },
    { name: 'ОАЭ',      img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80', from: 65000, slug: 'uae' },
    { name: 'Таиланд',  img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80', from: 80000, slug: 'thailand' },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 hero-overlay opacity-60" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-mono font-medium uppercase tracking-[.18em] mb-6">
            <Sparkles className="w-3 h-3 text-amber-500" /> Готовые туры
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
            Туры от ведущих <em className="not-italic text-amber-500">туроператоров</em>
          </h1>
          <p className="text-white/85 text-lg mt-5 max-w-2xl">
            Перелёт + отель + трансфер + страховка одним пакетом. Сравниваем предложения 120+ туроператоров через систему Sletat.ru.
          </p>
          <a
            href={slatLink}
            target="_blank"
            rel="noopener sponsored"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-xl bg-white text-brand-700 font-bold hover:-translate-y-0.5 transition-all"
          >
            Подобрать тур <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="font-display font-extrabold text-3xl text-ink-900 mb-2">Популярные направления</h2>
        <p className="text-ink-500 mb-8">Цены от — за человека на 7 ночей с перелётом</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {destinations.map((d) => (
            <Link key={d.slug} to={`/countries/${d.slug}`} className="group relative aspect-[3/4] rounded-2xl overflow-hidden">
              <img src={d.img} alt={d.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="font-display font-extrabold text-2xl mb-1">{d.name}</div>
                <div className="text-[13px] opacity-90">от {d.from.toLocaleString('ru-RU')} ₽</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-surface-1 border-y border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
          <h2 className="font-display font-extrabold text-3xl text-ink-900 text-center mb-12">Как купить тур</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Step n="01" Icon={MapPin}   title="Выберите направление" text="Любая страна, любой курорт" />
            <Step n="02" Icon={Calendar} title="Укажите даты"          text="Гибкий поиск по неделям" />
            <Step n="03" Icon={Users}    title="Туристы"               text="Сколько взрослых и детей" />
            <Step n="04" Icon={Shield}   title="Бронируйте"            text="С защитой и кэшбэком" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20 text-center">
        <Plane className="w-10 h-10 mx-auto text-brand-600 mb-4" />
        <h2 className="font-display font-extrabold text-3xl text-ink-900 mb-3">Готовы выбрать тур?</h2>
        <p className="text-ink-500 mb-6 max-w-xl mx-auto">Откройте поиск Sletat — лидера российского рынка туров с базой 120+ операторов.</p>
        <a
          href={slatLink}
          target="_blank"
          rel="noopener sponsored"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg"
        >
          Открыть подбор туров <ArrowRight className="w-4 h-4" />
        </a>
        <p className="text-[11.5px] text-ink-400 mt-5">
          Партнёрская ссылка · оплата напрямую туроператору · кэшбэк 1-2% в Travel Wallet
        </p>
      </section>
    </div>
  );
}

function Step({ n, Icon, title, text }: { n: string; Icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-6 hover:border-brand-300 hover:shadow-sm transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 grid place-items-center"><Icon className="w-5 h-5" /></div>
        <div className="text-[40px] font-display font-extrabold text-ink-100 leading-none">{n}</div>
      </div>
      <div className="font-display font-extrabold text-lg text-ink-900 mb-1">{title}</div>
      <p className="text-sm text-ink-500">{text}</p>
    </div>
  );
}
