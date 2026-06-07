import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass, MapPin, Star, Clock, Search, Users, User, ArrowRight,
  Footprints, Landmark, UtensilsCrossed, Car, Trees, Palette, Sparkles, Ticket,
} from 'lucide-react';
import { DatePicker } from '@/features/rail/DatePicker';

/**
 * ExcursionsPage (/excursions) — полноценный раздел авторских экскурсий
 * в духе топовых площадок: направления, типы экскурсий, фильтры, карточки
 * с гидом/рейтингом/форматом. UI-пилот на тест-данных; боевой каталог и бронь —
 * через провайдера (backend, после договора). В UI — только бренд FreeStyle.
 */

type CatKey = 'all' | 'obzor' | 'peshie' | 'gastro' | 'avto' | 'priroda' | 'muzei' | 'neobychnye';

const CATEGORIES: { key: CatKey; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'all', label: 'Все', Icon: Sparkles },
  { key: 'obzor', label: 'Обзорные', Icon: Compass },
  { key: 'peshie', label: 'Пешеходные', Icon: Footprints },
  { key: 'gastro', label: 'Гастрономические', Icon: UtensilsCrossed },
  { key: 'avto', label: 'Авто', Icon: Car },
  { key: 'priroda', label: 'Природа', Icon: Trees },
  { key: 'muzei', label: 'Музеи и искусство', Icon: Palette },
  { key: 'neobychnye', label: 'Необычные', Icon: Landmark },
];

interface Excursion {
  id: string;
  title: string;
  city: string;
  cat: Exclude<CatKey, 'all'>;
  format: 'group' | 'individual';
  durationText: string;
  rating: number;
  reviews: number;
  guide: string;
  price: number;
  unit: 'чел.' | 'экскурсия';
  img: string;
}

const EXCURSIONS: Excursion[] = [
  { id: 'e1', title: 'Сердце Петербурга: реки и каналы на катере', city: 'Санкт-Петербург', cat: 'obzor', format: 'group', durationText: '2 часа', rating: 4.9, reviews: 1280, guide: 'Анна', price: 1200, unit: 'чел.', img: 'https://images.unsplash.com/photo-1556610961-2fecc5927173?w=800&q=80' },
  { id: 'e2', title: 'Гастротур по дворам и рынкам Петербурга', city: 'Санкт-Петербург', cat: 'gastro', format: 'group', durationText: '3 часа', rating: 4.8, reviews: 540, guide: 'Игорь', price: 2400, unit: 'чел.', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80' },
  { id: 'e3', title: 'Казанский кремль и Татарская слобода', city: 'Казань', cat: 'peshie', format: 'group', durationText: '3 часа', rating: 4.8, reviews: 642, guide: 'Рустам', price: 1500, unit: 'чел.', img: 'https://images.unsplash.com/photo-1601574465779-76d6dbb88557?w=800&q=80' },
  { id: 'e4', title: 'Золотое кольцо: Суздаль за один день', city: 'Суздаль', cat: 'avto', format: 'individual', durationText: '8 часов', rating: 4.9, reviews: 389, guide: 'Мария', price: 9800, unit: 'экскурсия', img: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80' },
  { id: 'e5', title: 'Красная Поляна: горы и канатные дороги', city: 'Сочи', cat: 'priroda', format: 'group', durationText: '6 часов', rating: 4.8, reviews: 517, guide: 'Дмитрий', price: 3800, unit: 'чел.', img: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=800&q=80' },
  { id: 'e6', title: 'Москва вечерняя: огни столицы', city: 'Москва', cat: 'obzor', format: 'group', durationText: '3 часа', rating: 4.9, reviews: 2104, guide: 'Елена', price: 1800, unit: 'чел.', img: 'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=800&q=80' },
  { id: 'e7', title: 'Третьяковка: шедевры с искусствоведом', city: 'Москва', cat: 'muzei', format: 'group', durationText: '2 часа', rating: 4.9, reviews: 876, guide: 'Ольга', price: 2200, unit: 'чел.', img: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800&q=80' },
  { id: 'e8', title: 'Байкал: Листвянка и Шаман-камень', city: 'Иркутск', cat: 'priroda', format: 'individual', durationText: '10 часов', rating: 5.0, reviews: 233, guide: 'Сергей', price: 12500, unit: 'экскурсия', img: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80' },
  { id: 'e9', title: 'Кёнигсберг: тайны старого Калининграда', city: 'Калининград', cat: 'peshie', format: 'group', durationText: '2.5 часа', rating: 4.9, reviews: 411, guide: 'Артур', price: 1600, unit: 'чел.', img: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=800&q=80' },
  { id: 'e10', title: 'Подземный Петербург: бункеры и легенды', city: 'Санкт-Петербург', cat: 'neobychnye', format: 'group', durationText: '2 часа', rating: 4.7, reviews: 298, guide: 'Павел', price: 1900, unit: 'чел.', img: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80' },
  { id: 'e11', title: 'Нижний Новгород: стрелка и канатка', city: 'Нижний Новгород', cat: 'obzor', format: 'group', durationText: '3 часа', rating: 4.8, reviews: 356, guide: 'Алексей', price: 1400, unit: 'чел.', img: 'https://images.unsplash.com/photo-1606768666853-403c90a981ad?w=800&q=80' },
  { id: 'e12', title: 'Винный гастротур по долинам Сочи', city: 'Сочи', cat: 'gastro', format: 'individual', durationText: '5 часов', rating: 4.9, reviews: 187, guide: 'Нина', price: 8600, unit: 'экскурсия', img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80' },
];

interface CityDest { city: string; count: number; img: string; }
const DESTINATIONS: CityDest[] = [
  { city: 'Санкт-Петербург', count: 487, img: 'https://images.unsplash.com/photo-1556610961-2fecc5927173?w=600&q=80' },
  { city: 'Москва', count: 612, img: 'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=600&q=80' },
  { city: 'Казань', count: 168, img: 'https://images.unsplash.com/photo-1601574465779-76d6dbb88557?w=600&q=80' },
  { city: 'Сочи', count: 224, img: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=600&q=80' },
  { city: 'Калининград', count: 143, img: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=600&q=80' },
  { city: 'Суздаль', count: 64, img: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=600&q=80' },
  { city: 'Нижний Новгород', count: 97, img: 'https://images.unsplash.com/photo-1606768666853-403c90a981ad?w=600&q=80' },
  { city: 'Иркутск', count: 58, img: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80' },
];

const ALL_CITIES = ['Все города', ...DESTINATIONS.map((d) => d.city)];

export function ExcursionsPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [city, setCity] = useState('Все города');
  const [date, setDate] = useState('');
  const [cat, setCat] = useState<CatKey>('all');

  const list = useMemo(
    () => EXCURSIONS.filter((e) => (cat === 'all' || e.cat === cat) && (city === 'Все города' || e.city === city)),
    [cat, city],
  );

  return (
    <div className="min-h-screen">
      {/* HERO 40/60 */}
      <section className="relative hero-gradient text-white">
        <div className="absolute inset-0 hero-overlay opacity-60 pointer-events-none" />

        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-12 md:pb-14">
          <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-8 lg:gap-10 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-mono font-medium uppercase tracking-[.18em] mb-5">
                <Compass className="w-3 h-3 text-amber-400" /> Экскурсии и активный отдых
              </div>
              <h1 className="font-display font-extrabold text-4xl md:text-5xl xl:text-6xl leading-[1.05] tracking-tight">
                Экскурсии от <em className="not-italic text-amber-400">местных гидов</em>
              </h1>
              <p className="text-white/85 text-lg mt-5 leading-relaxed">
                Авторские маршруты, гастротуры и активный отдых с проверенными гидами по всей России.
                Реальные отзывы путешественников, бронирование без предоплаты — оплата гиду на месте.
              </p>
            </div>

            <div className="relative hidden lg:flex items-center justify-center min-h-[260px]">
              <img
                src="/images/hero-excursions.png"
                alt="Экскурсии"
                className="relative w-full h-auto object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,.45)] select-none"
                draggable={false}
                onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
              />
            </div>
          </div>
        </div>

        {/* Поиск */}
        <div className="relative z-30 max-w-[1320px] mx-auto px-4 md:px-8 pb-14 md:pb-20">
          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-[var(--shadow-hero)] border border-ink-100">
            <div className="grid gap-2.5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_12rem] lg:items-end">
              <Field label="Город" icon={MapPin}>
                <select value={city} onChange={(e) => setCity(e.target.value)} className="fs-rail-input">
                  {ALL_CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <DatePicker label="Дата" value={date} min={today} onChange={setDate} placeholder="Любая дата" clearable />
              <button type="button" className="lg:col-span-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold hover:-translate-y-0.5 transition-all shadow-[var(--shadow-submit)] hover:shadow-[var(--shadow-submit-hover)]">
                <Search className="w-4 h-4" /> Найти экскурсии
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="mb-8">
          <div className="text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-2">Направления</div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 leading-tight">Города с лучшими экскурсиями</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {DESTINATIONS.map((d) => (
            <button
              key={d.city}
              type="button"
              onClick={() => { setCity(d.city); setCat('all'); window.scrollTo({ top: 560, behavior: 'smooth' }); }}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden text-left"
            >
              <img src={d.img} alt={d.city} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="font-display font-extrabold text-xl leading-tight">{d.city}</div>
                <div className="text-[12.5px] opacity-90">{d.count} экскурсий</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* CATALOG + filters */}
      <section className="bg-surface-1 border-y border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
            <div>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 leading-tight">
                {city === 'Все города' ? 'Популярные экскурсии' : `Экскурсии · ${city}`}
              </h2>
              <p className="text-ink-500 mt-2">Авторские маршруты с проверенными гидами — рейтинг и реальные отзывы</p>
            </div>
            <span className="text-sm text-ink-500">{list.length} вариантов</span>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-7">
            {CATEGORIES.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setCat(key)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                  cat === key ? 'bg-brand-600 text-white shadow-sm' : 'bg-white border border-ink-100 text-ink-600 hover:border-brand-300 hover:text-brand-600'
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <div className="bg-white border border-ink-100 rounded-2xl p-12 text-center text-ink-500">
              По выбранным фильтрам экскурсий не нашлось. <button type="button" onClick={() => { setCat('all'); setCity('Все города'); }} className="text-brand-600 font-bold">Сбросить</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {list.map((e) => <ExcursionCard key={e.id} e={e} />)}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
        <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 text-center mb-12">Как это работает</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          <How n="01" Icon={Compass} title="Выберите экскурсию" text="Фильтруйте по городу, типу и формату — индивидуально или в группе" />
          <How n="02" Icon={Ticket} title="Забронируйте без предоплаты" text="Подтверждение сразу, оплата гиду на месте или онлайн с кэшбэком" />
          <How n="03" Icon={User} title="Встретьтесь с гидом" text="Местный эксперт проведёт по лучшим местам и расскажет то, чего нет в путеводителях" />
        </div>
      </section>
    </div>
  );
}

function ExcursionCard({ e }: { e: Excursion }) {
  return (
    <Link to="/excursions" className="group bg-white border border-ink-100 rounded-2xl overflow-hidden hover:shadow-[var(--shadow-card)] hover:border-brand-200 transition-all flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={e.img} alt={e.city} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-white/90 text-ink-800 text-[11.5px] font-bold px-2.5 py-1 rounded-full">
          <MapPin className="w-3 h-3 text-brand-600" /> {e.city}
        </span>
        <span className={`absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
          e.format === 'individual' ? 'bg-brand-600 text-white' : 'bg-amber-500 text-white'
        }`}>
          {e.format === 'individual' ? <User className="w-3 h-3" /> : <Users className="w-3 h-3" />}
          {e.format === 'individual' ? 'Индивидуальная' : 'Групповая'}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="font-display font-extrabold text-[15px] text-ink-900 leading-snug min-h-[2.6em]">{e.title}</div>
        <div className="text-[12.5px] text-ink-500 mt-2 flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{e.durationText}</span>
          <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />{e.rating} · {e.reviews}</span>
        </div>
        <div className="text-[12px] text-ink-400 mt-1.5 inline-flex items-center gap-1"><User className="w-3 h-3" /> Гид: {e.guide}</div>
        <div className="flex items-end justify-between mt-3 pt-3 border-t border-ink-100">
          <div>
            <div className="text-[11.5px] text-ink-400">от</div>
            <div className="font-display font-extrabold text-xl text-ink-900">{e.price.toLocaleString('ru-RU')} ₽<span className="text-[12px] font-semibold text-ink-400"> / {e.unit}</span></div>
          </div>
          <span className="inline-flex items-center gap-1 text-brand-600 font-bold text-sm group-hover:gap-2 transition-all">Подробнее <ArrowRight className="w-4 h-4" /></span>
        </div>
      </div>
    </Link>
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

function How({ n, Icon, title, text }: { n: string; Icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-6 hover:border-brand-300 hover:shadow-sm transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 grid place-items-center"><Icon className="w-5 h-5" /></div>
        <div className="text-[40px] font-display font-extrabold text-ink-100 leading-none">{n}</div>
      </div>
      <div className="font-display font-extrabold text-lg text-ink-900 mb-1">{title}</div>
      <p className="text-sm text-ink-500 leading-relaxed">{text}</p>
    </div>
  );
}
