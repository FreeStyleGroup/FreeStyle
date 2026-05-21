import { Car, MapPin, Calendar, Wallet, ArrowRight, Sparkles } from 'lucide-react';
import { tpRefLink } from '@/components/affiliate/TpWidget';

/**
 * CarRentalPage — аренда авто через Bookingauto (партнёр Travelpayouts).
 */
export function CarRentalPage() {
  const link = tpRefLink({
    base: 'https://tp.media/r',
    params: { p: '5252', u: 'https://www.bookingauto.com' },
    subId: 'car_main',
  });

  const popular = [
    { name: 'Турция',  city: 'Анталия',   from: 2300, img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80' },
    { name: 'Грузия',  city: 'Тбилиси',   from: 1800, img: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80' },
    { name: 'ОАЭ',     city: 'Дубай',     from: 4200, img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80' },
    { name: 'Кипр',    city: 'Ларнака',   from: 2900, img: 'https://images.unsplash.com/photo-1568849676085-51415703900f?w=800&q=80' },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 hero-overlay opacity-60" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-mono font-medium uppercase tracking-[.18em] mb-6">
            <Car className="w-3 h-3 text-amber-500" /> Аренда авто
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
            Аренда машины <em className="not-italic text-amber-500">в любой стране</em>
          </h1>
          <p className="text-white/85 text-lg mt-5 max-w-2xl">
            900 000+ автомобилей в 175 странах. Сравним 800+ прокатчиков (Hertz, Avis, Europcar, Localrent), забронируем за 2 минуты.
          </p>
          <a href={link} target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-xl bg-white text-brand-700 font-bold hover:-translate-y-0.5 transition-all">
            Найти авто <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="font-display font-extrabold text-3xl text-ink-900 mb-2">Популярные направления</h2>
        <p className="text-ink-500 mb-8">Цена в сутки — экономичный класс</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popular.map((p) => (
            <a key={p.city} href={link} target="_blank" rel="noopener sponsored" className="group relative aspect-[3/4] rounded-2xl overflow-hidden">
              <img src={p.img} alt={p.city} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-[12px] uppercase tracking-wider font-bold opacity-80">{p.name}</div>
                <div className="font-display font-extrabold text-2xl mt-0.5">{p.city}</div>
                <div className="text-[13px] opacity-90 mt-1">от {p.from.toLocaleString('ru-RU')} ₽/сутки</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-surface-1 border-y border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 grid md:grid-cols-3 gap-5">
          <Feature Icon={MapPin}  title="Получить и сдать в разных точках" text="Подача в аэропорт, сдача в отеле" />
          <Feature Icon={Calendar} title="Бесплатная отмена"               text="До 48 часов до поездки — без потерь" />
          <Feature Icon={Wallet}   title="Финальная цена"                  text="Все сборы и страховка уже включены" />
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 text-center">
        <Sparkles className="w-10 h-10 mx-auto text-brand-600 mb-4" />
        <h2 className="font-display font-extrabold text-3xl text-ink-900 mb-3">Подобрать машину</h2>
        <p className="text-ink-500 mb-6 max-w-xl mx-auto">Bookingauto — крупнейший агрегатор аренды авто на русском с поддержкой кэшбэка.</p>
        <a href={link} target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg">
          Найти авто <ArrowRight className="w-4 h-4" />
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
