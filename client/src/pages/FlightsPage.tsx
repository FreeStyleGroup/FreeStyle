import { Link } from 'react-router-dom';
import { Plane, Sparkles, Wallet, Search, BellRing, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { FlightSearchForm } from '@/components/search/FlightSearchForm';
import { tpRefLink } from '@/components/affiliate/TpWidget';

/**
 * FlightsPage — поиск авиабилетов (Aviasales API) +
 * популярные направления + почему мы + AI CTA.
 */
export function FlightsPage() {
  const popular = [
    { city: 'Стамбул',  code: 'IST', country: 'Турция',  img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80', from: 18500 },
    { city: 'Дубай',    code: 'DXB', country: 'ОАЭ',     img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80', from: 24900 },
    { city: 'Бангкок',  code: 'BKK', country: 'Таиланд', img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80', from: 45000 },
    { city: 'Тбилиси',  code: 'TBS', country: 'Грузия',  img: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=600&q=80', from: 9800  },
    { city: 'Денпасар', code: 'DPS', country: 'Бали',    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', from: 58000 },
    { city: 'Анталия',  code: 'AYT', country: 'Турция',  img: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&q=80', from: 16200 },
    { city: 'Нячанг',   code: 'CXR', country: 'Вьетнам', img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80', from: 42000 },
    { city: 'Ереван',   code: 'EVN', country: 'Армения', img: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=600&q=80', from: 11500 },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO + SEARCH */}
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 hero-overlay opacity-60" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 pt-14 md:pt-20 pb-32">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-mono font-medium uppercase tracking-[.18em] mb-5">
              <Plane className="w-3 h-3 text-amber-500" /> Сравниваем 100+ авиакомпаний
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] tracking-tight">
              Авиабилеты —<br />
              <em className="not-italic text-amber-500">без переплат</em>
            </h1>
            <p className="text-white/85 text-lg mt-5">
              Цена с учётом всех сборов и багажа. Кэшбэк 1-3% в Travel Wallet, alerts на падение цены.
            </p>
          </div>
        </div>

        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 -mt-20">
          <div className="bg-white rounded-3xl p-5 md:p-7 shadow-2xl border border-ink-100">
            <FlightSearchForm />
          </div>
        </div>
      </section>

      {/* POPULAR ROUTES */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20 mt-8">
        <div className="flex items-end justify-between gap-3 mb-8 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-2">Топ направлений</div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 leading-tight tracking-tight">
              Куда летают из Москвы
            </h2>
          </div>
          <Link to="/countries" className="inline-flex items-center gap-1.5 text-brand-600 font-bold text-sm hover:text-brand-700">
            Все направления <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popular.map((d) => (
            <a
              key={d.code}
              href={tpRefLink({
                base: `https://www.aviasales.ru/search/MOW0101${d.code}1`,
                subId: `flights_route_${d.code.toLowerCase()}`,
              })}
              target="_blank"
              rel="noopener sponsored"
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden block"
            >
              <img src={d.img} alt={d.city} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute top-4 right-4 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur text-[10.5px] uppercase font-bold tracking-wider text-ink-900">
                {d.code}
              </div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-[11.5px] uppercase tracking-wider font-bold text-white/70 mb-0.5">{d.country}</div>
                <div className="font-display font-extrabold text-2xl">{d.city}</div>
                <div className="text-[13px] opacity-90 mt-1.5">
                  от <span className="font-bold tabular-nums">{d.from.toLocaleString('ru-RU')} ₽</span>
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
            Почему FreeStyle
          </h2>
          <p className="text-ink-500 text-center mb-12 max-w-xl mx-auto">
            Мы используем то же ядро что и Aviasales, плюс собственный кэшбэк и AI-подсказки
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Feat Icon={Search}    title="Все авиакомпании"  text="100+ перевозчиков и лоукостеров в одном поиске" />
            <Feat Icon={Wallet}    title="Кэшбэк 1-3%"        text="Возвращаем процент с каждой брони в ваш Wallet" />
            <Feat Icon={BellRing}  title="Алерт цены"         text="Подпишемся на маршрут — сообщим при падении цены" />
            <Feat Icon={Sparkles}  title="AI-подсказки"       text="Феликс знает выгодные пересадки и сезоны" />
          </div>
        </div>
      </section>

      {/* CONCIERGE CTA */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-white p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="text-3xl md:text-4xl mb-3">🐈</div>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl mb-2">Не знаете куда лететь?</h2>
            <p className="text-white/85 max-w-xl">Спросите Феликса — AI-консьерж подскажет направления по бюджету, сезону и интересам. Бесплатно.</p>
          </div>
          <Link to="/concierge" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-bold hover:-translate-y-0.5 transition-all whitespace-nowrap">
            Открыть чат <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* TIPS */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 pb-14">
        <div className="grid md:grid-cols-3 gap-5">
          <Tip Icon={Calendar} title="Покупайте за 4-8 недель" text="Самые низкие цены — за 4-8 недель до вылета на популярных направлениях" />
          <Tip Icon={MapPin}   title="Гибкие даты"             text="Сдвиньте на ±3 дня — часто цена падает на 30-40%" />
          <Tip Icon={Plane}    title="Билет туда-обратно"      text="Часто дешевле двух one-way билетов" />
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
