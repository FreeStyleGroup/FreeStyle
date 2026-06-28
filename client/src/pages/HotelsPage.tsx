import { Link } from 'react-router-dom';
import { Hotel, Sparkles, Wallet, MapPin, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { HotelSearchForm } from '@/components/search/HotelSearchForm';
import { tpRefLink } from '@/components/affiliate/TpWidget';

/**
 * HotelsPage — поиск отелей (Hotellook через сервер) +
 * популярные города + почему мы + AI CTA.
 */
export function HotelsPage() {
  const popular = [
    { city: 'Дубай',     country: 'ОАЭ',     img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80', from: 8500,  hotels: '4 800' },
    { city: 'Стамбул',   country: 'Турция',  img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80', from: 3200,  hotels: '6 200' },
    { city: 'Бангкок',   country: 'Таиланд', img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80', from: 2400,  hotels: '5 100' },
    { city: 'Тбилиси',   country: 'Грузия',  img: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=600&q=80', from: 2800,  hotels: '1 850' },
    { city: 'Пхукет',    country: 'Таиланд', img: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=600&q=80', from: 3100,  hotels: '3 200' },
    { city: 'Анталия',   country: 'Турция',  img: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&q=80', from: 2900,  hotels: '4 100' },
    { city: 'Денпасар',  country: 'Бали',    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', from: 2200,  hotels: '2 700' },
    { city: 'Шарм-эль-Шейх', country: 'Египет', img: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=600&q=80', from: 4800,  hotels: '1 200' },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO + SEARCH */}
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 hero-overlay opacity-60" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 pt-14 md:pt-20 pb-32">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-mono font-medium uppercase tracking-[.18em] mb-5">
              <Hotel className="w-3 h-3 text-amber-500" /> 900 000+ отелей по всему миру
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] tracking-tight">
              Отели — <em className="not-italic text-amber-500">от хостелов до люкса</em>
            </h1>
            <p className="text-white/85 text-lg mt-5">
              Сравниваем десятки систем бронирования и показываем лучшую цену. Финальная стоимость с налогами, без скрытых комиссий.
            </p>
          </div>
        </div>

        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 -mt-20">
          <div className="bg-white rounded-3xl p-5 md:p-7 shadow-2xl border border-ink-100">
            <HotelSearchForm />
          </div>
        </div>
      </section>

      {/* POPULAR CITIES */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20 mt-8">
        <div className="flex items-end justify-between gap-3 mb-8 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-2">Топ городов</div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 leading-tight tracking-tight">
              Где останавливаются россияне
            </h2>
          </div>
          <Link to="/countries" className="inline-flex items-center gap-1.5 text-brand-600 font-bold text-sm hover:text-brand-700">
            Все страны <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popular.map((d) => (
            <a
              key={d.city}
              href={tpRefLink({
                base: 'https://search.hotellook.com',
                params: { destination: d.city },
                subId: `hotels_city_${d.city.replace(/\s+/g, '_').toLowerCase()}`,
              })}
              target="_blank"
              rel="noopener sponsored"
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden block"
            >
              <img src={d.img} alt={d.city} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute top-4 right-4 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur text-[10.5px] uppercase font-bold tracking-wider text-ink-900">
                {d.hotels}
              </div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-[11.5px] uppercase tracking-wider font-bold text-white/70 mb-0.5">{d.country}</div>
                <div className="font-display font-extrabold text-2xl">{d.city}</div>
                <div className="text-[13px] opacity-90 mt-1.5">
                  от <span className="font-bold tabular-nums">{d.from.toLocaleString('ru-RU')} ₽</span>/ночь
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-surface-1 border-y border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 text-center mb-3">
            Почему здесь дешевле
          </h2>
          <p className="text-ink-500 text-center mb-12 max-w-xl mx-auto">
            Мы сравниваем десятки систем бронирования — часто цена ниже, чем напрямую у отеля
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Feat Icon={Hotel}       title="900 000+ отелей"     text="От 5★ ресортов до бутик-отелей и хостелов" />
            <Feat Icon={Wallet}      title="Кэшбэк 2-5%"          text="Возвращаем процент в Travel Wallet после заезда" />
            <Feat Icon={ShieldCheck} title="Финальная цена"        text="Все налоги и сборы уже включены — никаких сюрпризов" />
            <Feat Icon={Star}        title="Честные отзывы"        text="Только от реально проживших — без накруток" />
          </div>
        </div>
      </section>

      {/* CONCIERGE CTA */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-white p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <Sparkles className="w-8 h-8 text-amber-400 mb-3" />
            <h2 className="font-display font-extrabold text-2xl md:text-3xl mb-2">Подобрать отель?</h2>
            <p className="text-white/85 max-w-xl">Ириска знает районы любого города и подскажет где остановиться по бюджету и для каких задач (пляж, шопинг, бизнес).</p>
          </div>
          <Link to="/concierge" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-bold hover:-translate-y-0.5 transition-all whitespace-nowrap">
            Спросить Ириску <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* TIPS */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 pb-14">
        <div className="grid md:grid-cols-3 gap-5">
          <Tip Icon={MapPin}      title="Локация важнее звёзд"   text="Иногда 3★ в центре лучше 5★ в пригороде — смотрите карту" />
          <Tip Icon={Star}        title="Читайте свежие отзывы"  text="Только последние 3-6 месяцев — отель может сильно измениться" />
          <Tip Icon={ShieldCheck} title="Возврат денег"           text="Выбирайте брони с бесплатной отменой — это всего +5-10% к цене" />
        </div>
      </section>
    </div>
  );
}

function Feat({ Icon, title, text }: { Icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-6">
      <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 grid place-items-center mb-3"><Icon className="w-5 h-5" /></div>
      <div className="font-display font-extrabold text-lg text-ink-900 mb-1">{title}</div>
      <p className="text-sm text-ink-500 leading-relaxed">{text}</p>
    </div>
  );
}

function Tip({ Icon, title, text }: { Icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-amber-700" />
        <div className="font-bold text-ink-900 text-[14.5px]">{title}</div>
      </div>
      <p className="text-[13.5px] text-ink-700 leading-relaxed">{text}</p>
    </div>
  );
}
