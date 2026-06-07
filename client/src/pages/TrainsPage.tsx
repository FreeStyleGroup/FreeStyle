import { Link } from 'react-router-dom';
import { Train, Clock, ArrowRight, ArrowUpRight, MapPin, LayoutGrid, ShieldCheck, Wallet, BellRing } from 'lucide-react';
import { RailSearchForm } from '@/features/rail/RailSearchForm';

/**
 * TrainsPage — поиск поездов РЖД (наш UI + движок выбора мест).
 * Полный цикл (поиск → схема вагона → пассажиры → оплата) на тест-контуре;
 * боевая продажа — через дистрибьютора УФС/ИМ после договора.
 */
export function TrainsPage() {
  const popular = [
    { from: 'Москва', to: 'Санкт-Петербург', fromCode: '2006004', toCode: '2004001', time: '4 ч', price: 2100 },
    { from: 'Москва', to: 'Казань', fromCode: '2006004', toCode: '2060001', time: '12 ч', price: 2800 },
    { from: 'Москва', to: 'Сочи', fromCode: '2006004', toCode: '2064500', time: '24 ч', price: 4500 },
    { from: 'Санкт-Петербург', to: 'Москва', fromCode: '2004001', toCode: '2006004', time: '4 ч', price: 2100 },
    { from: 'Москва', to: 'Минск', fromCode: '2006004', toCode: '2004600', time: '8 ч', price: 3200 },
    { from: 'Москва', to: 'Нижний Новгород', fromCode: '2006004', toCode: '2064001', time: '4 ч', price: 1900 },
  ];
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen">
      {/* HERO 40/60 — слева призыв и описание, справа золотой поезд */}
      <section className="relative hero-gradient text-white">
        <div className="absolute inset-0 hero-overlay opacity-60 pointer-events-none" />

        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-12 md:pb-14">
          <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-8 lg:gap-10 items-center">
            {/* Левая колонка 40% — текст */}
            <div className="max-w-xl">
              <h1 className="font-display font-extrabold text-4xl md:text-5xl xl:text-6xl leading-[1.05] tracking-tight">
                Билеты на поезд —<br />
                <em className="not-italic text-amber-400">место у окна за пару минут</em>
              </h1>
              <p className="text-white/85 text-lg mt-5 leading-relaxed">
                Плацкарт, купе, СВ, Сапсан и Ласточка. Выбирайте место прямо на интерактивной
                схеме вагона, добавляйте обратный билет в один заказ, проходите посадку по паспорту
                с электронной регистрацией.
              </p>
            </div>

            {/* Правая колонка 60% — золотой поезд (прозрачный PNG) */}
            <div className="relative hidden lg:flex items-center justify-center min-h-[260px]">
              <img
                src="/images/hero-train.png"
                alt="Российский скоростной поезд"
                className="relative w-full h-auto object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,.45)] select-none"
                draggable={false}
                onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
              />
            </div>
          </div>
        </div>

        {/* Табло поиска — на всю ширину контейнера, с отступом снизу.
            z-30 + у секции нет overflow-hidden, чтобы календарь не обрезался. */}
        <div className="relative z-30 max-w-[1320px] mx-auto px-4 md:px-8 pb-14 md:pb-20">
          <div className="bg-white rounded-3xl p-5 md:p-7 shadow-[var(--shadow-hero)] border border-ink-100">
            <RailSearchForm initial={{ date: today }} />
          </div>
        </div>
      </section>

      {/* POPULAR */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="flex items-end justify-between gap-3 mb-8 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-2">Популярные направления</div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 leading-tight">Куда едут чаще всего</h2>
          </div>
          <Link to="/trains/demo" className="inline-flex items-center gap-1.5 text-brand-600 font-bold text-sm hover:text-brand-700">
            <LayoutGrid className="w-4 h-4" /> Схемы вагонов
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popular.map((r, i) => (
            <Link
              key={i}
              to={`/trains/results?from=${r.fromCode}&to=${r.toCode}&date=${today}&pax=1`}
              className="group bg-white border border-ink-100 rounded-2xl p-5 hover:border-brand-300 hover:shadow-sm transition-all flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 grid place-items-center shrink-0">
                <Train className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-extrabold text-lg text-ink-900 leading-tight">{r.from} → {r.to}</div>
                <div className="text-[12.5px] text-ink-500 mt-0.5 inline-flex items-center gap-2">
                  <Clock className="w-3 h-3" />{r.time}<span>·</span><span>от {r.price.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-400 group-hover:text-brand-600 shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* ПУТЕШЕСТВИЯ ПО РОССИИ */}
      <section className="bg-white border-t border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-2">Куда поехать</div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 leading-tight">Путешествия по России</h2>
            <p className="text-ink-500 mt-3">Города-столицы и маршруты Золотого кольца — добраться удобнее всего на поезде.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {DESTINATIONS.map((d) => (
              <DestinationCard key={d.city} dest={d} today={today} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="bg-surface-1 border-y border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 text-center mb-12">Почему удобно у нас</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Feat Icon={LayoutGrid} title="Выбор места на схеме" text="Интерактивная схема любого вагона — нижнее/верхнее, у окна, розетка" />
            <Feat Icon={ShieldCheck} title="Электронная регистрация" text="Посадка по паспорту без распечатки билета" />
            <Feat Icon={Wallet} title="Кэшбэк в Wallet" text="Возвращаем процент с каждой поездки" />
            <Feat Icon={BellRing} title="Все типы поездов" text="Плацкарт, купе, СВ, люкс, Сапсан, Ласточка, двухэтажные" />
          </div>
        </div>
      </section>
    </div>
  );
}

/** Направления для блока «Путешествия по России». ring=Золотое кольцо. */
interface Dest {
  city: string;
  tagline: string;
  toCode?: string;   // если есть код станции — ведём в префилл-поиск (из Москвы)
  fromCode?: string; // для самой Москвы — едем из Петербурга
  ring?: boolean;
}

const DESTINATIONS: Dest[] = [
  { city: 'Санкт-Петербург', tagline: 'Северная столица', toCode: '2004001' },
  { city: 'Москва', tagline: 'Сердце России', toCode: '2006004', fromCode: '2004001' },
  { city: 'Казань', tagline: 'Третья столица', toCode: '2060001' },
  { city: 'Нижний Новгород', tagline: 'Столица закатов', toCode: '2064001' },
  { city: 'Владимир', tagline: 'Древняя Русь', ring: true },
  { city: 'Суздаль', tagline: 'Музей под открытым небом', ring: true },
  { city: 'Ярославль', tagline: 'Столица Золотого кольца', ring: true },
  { city: 'Кострома', tagline: 'Родина Снегурочки', ring: true },
];

function DestinationCard({ dest, today }: { dest: Dest; today: string }) {
  const to = dest.toCode
    ? `/trains/results?from=${dest.fromCode ?? '2006004'}&to=${dest.toCode}&date=${today}&pax=1`
    : '/trains';
  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-2xl p-5 min-h-[150px] md:min-h-[170px] flex flex-col justify-between text-white transition-transform hover:-translate-y-1 ${
        dest.ring
          ? 'bg-gradient-to-br from-amber-500 via-amber-600 to-brand-700'
          : 'bg-gradient-to-br from-brand-600 to-brand-900'
      }`}
    >
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-center justify-between">
        {dest.ring ? (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 rounded-full px-2 py-0.5">Золотое кольцо</span>
        ) : (
          <MapPin className="w-5 h-5 text-white/70" />
        )}
        <ArrowUpRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
      </div>
      <div className="relative">
        <div className="font-display font-extrabold text-xl md:text-2xl leading-tight">{dest.city}</div>
        <div className="text-white/80 text-[13px] mt-0.5">{dest.tagline}</div>
      </div>
    </Link>
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
