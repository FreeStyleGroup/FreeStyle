import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Sparkles, Flame, Compass, MapPin, Star, Clock, Users, Search,
  Plus, Minus, ArrowRight, ShieldCheck, Wallet, BadgePercent,
} from 'lucide-react';
import { DatePicker } from '@/features/rail/DatePicker';

/**
 * ToursPage (/tours) — единый раздел путешествий с переключателем:
 *   • Пакетные туры (перелёт+отель+трансфер+страховка)
 *   • Горящие туры (сниженные цены на ближайшие вылеты)
 *   • Экскурсии (авторские, с гидами)
 * UI-пилот на тест-данных. Боевой подбор — через провайдера туров (backend,
 * после договора). Источники в UI не упоминаем — везде бренд FreeStyle.
 */

type Tab = 'package' | 'hot' | 'excursion';

interface TourCard {
  id: string;
  country: string;
  resort: string;
  hotel: string;
  stars: number;
  nights: number;
  meal: string;
  dateText: string;
  price: number;
  oldPrice?: number;
  img: string;
}

interface Excursion {
  id: string;
  title: string;
  city: string;
  durationText: string;
  rating: number;
  reviews: number;
  price: number;
  img: string;
}

const PACKAGES: TourCard[] = [
  { id: 'p1', country: 'Турция', resort: 'Анталья', hotel: 'Delphin Imperial', stars: 5, nights: 7, meal: 'Всё включено', dateText: '14 июня · 7 ночей', price: 78900, img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80' },
  { id: 'p2', country: 'Египет', resort: 'Хургада', hotel: 'Steigenberger Aldau', stars: 5, nights: 10, meal: 'Всё включено', dateText: '18 июня · 10 ночей', price: 92400, img: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&q=80' },
  { id: 'p3', country: 'ОАЭ', resort: 'Дубай', hotel: 'Rixos Premium JBR', stars: 5, nights: 6, meal: 'Завтраки', dateText: '20 июня · 6 ночей', price: 121000, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80' },
  { id: 'p4', country: 'Таиланд', resort: 'Пхукет', hotel: 'Katathani Beach Resort', stars: 4, nights: 11, meal: 'Завтраки', dateText: '24 июня · 11 ночей', price: 134500, img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80' },
];

const HOT: TourCard[] = [
  { id: 'h1', country: 'Турция', resort: 'Кемер', hotel: 'Mirage Park Resort', stars: 5, nights: 7, meal: 'Всё включено', dateText: 'вылет завтра · 7 ночей', price: 54900, oldPrice: 79900, img: 'https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?w=800&q=80' },
  { id: 'h2', country: 'Египет', resort: 'Шарм-эль-Шейх', hotel: 'Albatros Palace', stars: 5, nights: 8, meal: 'Всё включено', dateText: 'вылет через 2 дня', price: 61200, oldPrice: 88000, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80' },
  { id: 'h3', country: 'Абхазия', resort: 'Гагра', hotel: 'Alex Resort & Spa', stars: 4, nights: 7, meal: 'Завтраки', dateText: 'вылет через 3 дня', price: 34800, oldPrice: 47000, img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80' },
  { id: 'h4', country: 'Турция', resort: 'Сиде', hotel: 'Saphir Resort & Spa', stars: 5, nights: 9, meal: 'Всё включено', dateText: 'вылет через 4 дня', price: 67400, oldPrice: 95000, img: 'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=800&q=80' },
];

const EXCURSIONS: Excursion[] = [
  { id: 'e1', title: 'Сердце Петербурга: реки и каналы', city: 'Санкт-Петербург', durationText: '2 часа', rating: 4.9, reviews: 1280, price: 1200, img: 'https://images.unsplash.com/photo-1556610961-2fecc5927173?w=800&q=80' },
  { id: 'e2', title: 'Казанский кремль и старая Татарская слобода', city: 'Казань', durationText: '3 часа', rating: 4.8, reviews: 642, price: 1500, img: 'https://images.unsplash.com/photo-1601574465779-76d6dbb88557?w=800&q=80' },
  { id: 'e3', title: 'Золотое кольцо: Суздаль за один день', city: 'Суздаль', durationText: '8 часов', rating: 4.9, reviews: 389, price: 4200, img: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80' },
  { id: 'e4', title: 'Сочи и Красная Поляна: горы и море', city: 'Сочи', durationText: '6 часов', rating: 4.8, reviews: 517, price: 3800, img: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=800&q=80' },
  { id: 'e5', title: 'Москва вечерняя: огни столицы', city: 'Москва', durationText: '3 часа', rating: 4.9, reviews: 2104, price: 1800, img: 'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=800&q=80' },
  { id: 'e6', title: 'Байкал: Листвянка и Шаман-камень', city: 'Иркутск', durationText: '10 часов', rating: 5.0, reviews: 233, price: 5600, img: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80' },
];

const TABS: { key: Tab; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'package', label: 'Пакетные туры', Icon: Sparkles },
  { key: 'hot', label: 'Горящие туры', Icon: Flame },
  { key: 'excursion', label: 'Экскурсии', Icon: Compass },
];

const HERO: Record<Tab, { badge: string; title: React.ReactNode; text: string; img: string }> = {
  package: {
    badge: 'Пакетные туры',
    title: <>Туры от ведущих <em className="not-italic text-amber-400">туроператоров</em></>,
    text: 'Перелёт, отель, трансфер и страховка — одним пакетом. Подбираем и сравниваем тысячи туров от проверенных операторов, с кэшбэком в Travel Wallet.',
    img: '/images/hero-tours.png',
  },
  hot: {
    badge: 'Горящие туры',
    title: <>Горящие туры <em className="not-italic text-amber-400">со скидками</em></>,
    text: 'Готовые вылеты в ближайшие дни по сниженным ценам. Те же отели и операторы — заметно дешевле, пока есть места.',
    img: '/images/hero-tours.png',
  },
  excursion: {
    badge: 'Экскурсии',
    title: <>Экскурсии от <em className="not-italic text-amber-400">местных гидов</em></>,
    text: 'Авторские экскурсии и активный отдых с проверенными гидами по всей России. Реальные отзывы путешественников, бронирование без предоплаты.',
    img: '/images/hero-excursions.png',
  },
};

const COUNTRIES = ['Турция', 'Египет', 'ОАЭ', 'Таиланд', 'Абхазия', 'Россия', 'Мальдивы', 'Шри-Ланка'];
const EXC_CITIES = ['Санкт-Петербург', 'Москва', 'Казань', 'Сочи', 'Суздаль', 'Иркутск'];

export function ToursPage() {
  const [sp] = useSearchParams();
  const initial = (['package', 'hot', 'excursion'] as Tab[]).includes(sp.get('tab') as Tab)
    ? (sp.get('tab') as Tab)
    : 'package';
  const [tab, setTab] = useState<Tab>(initial);
  const today = new Date().toISOString().slice(0, 10);
  const hero = HERO[tab];
  const isExc = tab === 'excursion';

  return (
    <div className="min-h-screen">
      {/* HERO 40/60 */}
      <section className="relative hero-gradient text-white">
        <div className="absolute inset-0 hero-overlay opacity-60 pointer-events-none" />

        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-12 md:pb-14">
          <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-8 lg:gap-10 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-mono font-medium uppercase tracking-[.18em] mb-5">
                {tab === 'hot' ? <Flame className="w-3 h-3 text-amber-400" /> : <Sparkles className="w-3 h-3 text-amber-400" />} {hero.badge}
              </div>
              <h1 className="font-display font-extrabold text-4xl md:text-5xl xl:text-6xl leading-[1.05] tracking-tight">
                {hero.title}
              </h1>
              <p className="text-white/85 text-lg mt-5 leading-relaxed">{hero.text}</p>
            </div>

            <div className="relative hidden lg:flex items-center justify-center min-h-[260px]">
              <img
                key={hero.img}
                src={hero.img}
                alt={hero.badge}
                className="relative w-full h-auto object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,.45)] select-none"
                draggable={false}
                onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
              />
            </div>
          </div>
        </div>

        {/* Переключатель разделов + поиск */}
        <div className="relative z-30 max-w-[1320px] mx-auto px-4 md:px-8 pb-14 md:pb-20">
          <div className="bg-white rounded-3xl shadow-[var(--shadow-hero)] border border-ink-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-ink-100">
              {TABS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-3.5 text-sm font-bold transition-colors cursor-pointer ${
                    tab === key
                      ? key === 'hot' ? 'text-amber-600 border-b-2 border-amber-500 -mb-px' : 'text-brand-600 border-b-2 border-brand-500 -mb-px'
                      : 'text-ink-500 hover:text-ink-900 hover:bg-surface-1'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="p-5 md:p-6">
              {isExc ? <ExcursionSearch today={today} /> : <PackageSearch today={today} />}
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
        {isExc ? (
          <>
            <SectionHead title="Популярные экскурсии" subtitle="Авторские маршруты с проверенными гидами — рейтинг и реальные отзывы" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {EXCURSIONS.map((e) => <ExcursionCardView key={e.id} e={e} />)}
            </div>
          </>
        ) : tab === 'hot' ? (
          <>
            <SectionHead title="Горящие предложения" subtitle="Ближайшие вылеты по сниженным ценам — пока есть места" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {HOT.map((t) => <TourCardView key={t.id} t={t} hot />)}
            </div>
          </>
        ) : (
          <>
            <SectionHead title="Популярные туры" subtitle="Перелёт, отель и трансфер в одном пакете — цена за человека" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PACKAGES.map((t) => <TourCardView key={t.id} t={t} />)}
            </div>
          </>
        )}
      </section>

      {/* WHY */}
      <section className="bg-surface-1 border-y border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 text-center mb-12">Почему туры удобнее у нас</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Feat Icon={BadgePercent} title="Честная цена" text="Сравниваем все доступные предложения и показываем лучшую цену без скрытых сборов" />
            <Feat Icon={ShieldCheck} title="Защита поездки" text="Страховка в пакете, поддержка 24/7 и помощь в любой ситуации" />
            <Feat Icon={Wallet} title="Кэшбэк в Wallet" text="Возвращаем процент с каждой брони на ваш Travel Wallet" />
            <Feat Icon={Compass} title="Туры и экскурсии" text="Пакетный отдых, горящие вылеты и авторские экскурсии — в одном месте" />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Поиск пакетных/горящих туров ── */
function PackageSearch({ today }: { today: string }) {
  const [from, setFrom] = useState('Москва');
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [date, setDate] = useState(today);
  const [nights, setNights] = useState(7);
  const [pax, setPax] = useState(2);

  return (
    <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,0.9fr)_9.5rem] lg:items-end">
      <Field label="Откуда" icon={MapPin}>
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="fs-rail-input">
          {['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург', 'Новосибирск'].map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Куда" icon={MapPin}>
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="fs-rail-input">
          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <DatePicker label="Вылет" value={date} min={today} onChange={setDate} />
      <Field label="Ночей">
        <select value={nights} onChange={(e) => setNights(Number(e.target.value))} className="fs-rail-input !pl-3.5">
          {[5, 7, 10, 11, 14].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </Field>
      <Stepper label="Туристы" value={pax} onChange={setPax} />
      <button type="button" className="lg:col-span-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold hover:-translate-y-0.5 transition-all shadow-[var(--shadow-submit)] hover:shadow-[var(--shadow-submit-hover)]">
        <Search className="w-4 h-4" /> Подобрать тур
      </button>
    </div>
  );
}

/* ── Поиск экскурсий ── */
function ExcursionSearch({ today }: { today: string }) {
  const [city, setCity] = useState(EXC_CITIES[0]);
  const [date, setDate] = useState('');

  return (
    <div className="grid gap-2.5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_12rem] lg:items-end">
      <Field label="Город" icon={MapPin}>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="fs-rail-input">
          {EXC_CITIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <DatePicker label="Дата" value={date} min={today} onChange={setDate} placeholder="Любая дата" clearable />
      <button type="button" className="lg:col-span-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold hover:-translate-y-0.5 transition-all shadow-[var(--shadow-submit)] hover:shadow-[var(--shadow-submit-hover)]">
        <Search className="w-4 h-4" /> Найти экскурсии
      </button>
    </div>
  );
}

function TourCardView({ t, hot }: { t: TourCard; hot?: boolean }) {
  const discount = t.oldPrice ? Math.round((1 - t.price / t.oldPrice) * 100) : 0;
  return (
    <Link to="/tours" className="group bg-white border border-ink-100 rounded-2xl overflow-hidden hover:shadow-[var(--shadow-card)] hover:border-brand-200 transition-all">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={t.img} alt={t.country} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        {hot && discount > 0 && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-amber-500 text-white text-[12px] font-extrabold px-2.5 py-1 rounded-full shadow">
            <Flame className="w-3.5 h-3.5" /> −{discount}%
          </span>
        )}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="font-display font-extrabold text-lg leading-tight">{t.country}, {t.resort}</div>
          <div className="text-[12px] opacity-90 inline-flex items-center gap-1">
            {Array.from({ length: t.stars }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 stroke-amber-400" />)}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="font-semibold text-ink-900 text-[14px] leading-snug truncate">{t.hotel}</div>
        <div className="text-[12.5px] text-ink-500 mt-1 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{t.dateText}</span>
        </div>
        <div className="text-[12px] text-ink-400 mt-0.5">{t.meal}</div>
        <div className="flex items-end justify-between mt-3 pt-3 border-t border-ink-100">
          <div>
            {t.oldPrice && <div className="text-[12px] text-ink-400 line-through">{t.oldPrice.toLocaleString('ru-RU')} ₽</div>}
            <div className="font-display font-extrabold text-xl text-ink-900">{t.price.toLocaleString('ru-RU')} ₽</div>
          </div>
          <span className="inline-flex items-center gap-1 text-brand-600 font-bold text-sm group-hover:gap-2 transition-all">Выбрать <ArrowRight className="w-4 h-4" /></span>
        </div>
      </div>
    </Link>
  );
}

function ExcursionCardView({ e }: { e: Excursion }) {
  return (
    <Link to="/tours" className="group bg-white border border-ink-100 rounded-2xl overflow-hidden hover:shadow-[var(--shadow-card)] hover:border-brand-200 transition-all">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={e.img} alt={e.city} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-white/90 text-ink-800 text-[12px] font-bold px-2.5 py-1 rounded-full">
          <MapPin className="w-3 h-3 text-brand-600" /> {e.city}
        </span>
      </div>
      <div className="p-4">
        <div className="font-display font-extrabold text-[15px] text-ink-900 leading-snug min-h-[2.6em]">{e.title}</div>
        <div className="text-[12.5px] text-ink-500 mt-2 flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{e.durationText}</span>
          <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />{e.rating} · {e.reviews}</span>
        </div>
        <div className="flex items-end justify-between mt-3 pt-3 border-t border-ink-100">
          <div>
            <div className="text-[11.5px] text-ink-400">от</div>
            <div className="font-display font-extrabold text-xl text-ink-900">{e.price.toLocaleString('ru-RU')} ₽</div>
          </div>
          <span className="inline-flex items-center gap-1 text-brand-600 font-bold text-sm group-hover:gap-2 transition-all">Подробнее <ArrowRight className="w-4 h-4" /></span>
        </div>
      </div>
    </Link>
  );
}

function SectionHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 leading-tight">{title}</h2>
      <p className="text-ink-500 mt-2">{subtitle}</p>
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[12px] font-semibold text-ink-500 mb-1.5">{label}</span>
      <span className="relative block">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none z-10" />}
        {children}
      </span>
    </label>
  );
}

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const set = (v: number) => onChange(Math.max(1, Math.min(9, v)));
  return (
    <div className="block">
      <span className="block text-[12px] font-semibold text-ink-500 mb-1.5">{label}</span>
      <div className="flex items-center justify-between h-[2.85rem] rounded-xl border border-ink-100 bg-white px-2">
        <button type="button" onClick={() => set(value - 1)} disabled={value <= 1} className="w-8 h-8 grid place-items-center rounded-lg text-ink-500 hover:bg-surface-2 hover:text-brand-600 disabled:opacity-30">
          <Minus className="w-4 h-4" />
        </button>
        <span className="inline-flex items-center gap-1.5 font-bold text-ink-900 tabular-nums"><Users className="w-4 h-4 text-ink-400" />{value}</span>
        <button type="button" onClick={() => set(value + 1)} disabled={value >= 9} className="w-8 h-8 grid place-items-center rounded-lg text-ink-500 hover:bg-surface-2 hover:text-brand-600 disabled:opacity-30">
          <Plus className="w-4 h-4" />
        </button>
      </div>
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
