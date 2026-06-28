import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Plane, Hotel as HotelIcon, ShieldCheck, ShieldAlert, MapPin,
  Calendar, Languages, Coins, Clock, Loader2, AlertCircle, Sparkles,
} from 'lucide-react';
import { countriesApi } from '@/api/countries.api';
import type { CountryDto } from '@freestyle/shared';

const VISA: Record<string, { label: string; tone: string; Icon: typeof ShieldCheck; desc: string }> = {
  no:           { label: 'Без визы',          tone: 'bg-mint-500/15 text-mint-700',   Icon: ShieldCheck, desc: 'Прямой въезд по загранпаспорту' },
  'on-arrival': { label: 'Виза по прилёту',   tone: 'bg-amber-50 text-amber-700',     Icon: ShieldCheck, desc: 'Оформляется в аэропорту' },
  'e-visa':     { label: 'Онлайн-виза',       tone: 'bg-amber-50 text-amber-700',     Icon: ShieldCheck, desc: 'Заполняется на сайте посольства' },
  yes:          { label: 'Нужна виза',        tone: 'bg-coral-100 text-coral-700',    Icon: ShieldAlert, desc: 'Запись в визовый центр обязательна' },
};

export function CountryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [c, setC] = useState<CountryDto | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setC(null); setNotFound(false);
    countriesApi.getBySlug(slug).then((data) => {
      if (!data) setNotFound(true);
      else {
        setC(data);
        document.title = `${data.name} — виза, погода, перелёты · FreeStyle`;
      }
    });
  }, [slug]);

  if (notFound) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <AlertCircle className="w-14 h-14 mx-auto text-brand-600" />
        <h1 className="font-display font-extrabold text-2xl mt-6 text-ink-900">Страна не найдена</h1>
        <Link to="/countries" className="inline-block mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold">
          Все страны
        </Link>
      </div>
    );
  }

  if (!c) {
    return <div className="min-h-[40vh] grid place-items-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>;
  }

  const visa = VISA[c.visa.required] ?? VISA.yes;
  /** TP marker — для affiliate-ссылок поиска по этой стране */
  const tpMarker = '304805';

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src={c.heroImage} alt={c.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
        </div>
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24">
          <Link to="/countries" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> Все страны
          </Link>
          <div className="text-5xl md:text-6xl mb-3">{c.flag}</div>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl text-white leading-[1.05] tracking-tight">
            {c.name}
          </h1>
          <p className="text-white/85 text-lg md:text-xl mt-4 max-w-2xl leading-relaxed">{c.shortDescription}</p>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-bold ${visa.tone}`}>
              <visa.Icon className="w-3.5 h-3.5" />
              {visa.label}
              {c.visa.stayDays && <span className="opacity-70 ml-1">· до {c.visa.stayDays} дней</span>}
            </span>
            {c.popular && (
              <span className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-[11px] font-bold uppercase tracking-wider">
                Топ направление
              </span>
            )}
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="bg-white border-b border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          <Fact Icon={MapPin}    label="Столица"     value={c.capital} />
          <Fact Icon={Coins}     label="Валюта"      value={`${c.currency} · ${c.currencyName}`} />
          <Fact Icon={Languages} label="Язык"        value={c.language.join(', ')} />
          <Fact Icon={Clock}     label="Часовой пояс" value={c.timeZone} />
          <Fact Icon={Plane}     label="Полёт из МСК" value={c.flightTimeFromMoscow} />
          <Fact Icon={Calendar}  label="Лучший сезон" value={c.climate.bestSeason.split(',')[0]} />
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16 grid lg:grid-cols-[1fr_380px] gap-10">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-ink-900 mb-4">О стране</h2>
          <p className="text-ink-700 leading-relaxed text-[15.5px] mb-8 whitespace-pre-line">{c.longDescription}</p>

          {/* VISA INFO */}
          <div className="rounded-2xl border border-ink-100 bg-white p-6 mb-8">
            <h3 className="font-display font-extrabold text-lg text-ink-900 mb-3 flex items-center gap-2">
              <visa.Icon className="w-5 h-5 text-brand-600" /> Визовый режим
            </h3>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-bold ${visa.tone} mb-3`}>
              {visa.label}
            </div>
            <p className="text-[14.5px] text-ink-700">{c.visa.note}</p>
            <p className="text-[12.5px] text-ink-500 mt-2">{visa.desc}</p>
          </div>

          {/* CLIMATE */}
          <div className="rounded-2xl border border-ink-100 bg-white p-6 mb-8">
            <h3 className="font-display font-extrabold text-lg text-ink-900 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-600" /> Когда ехать
            </h3>
            <div className="text-[14.5px] text-ink-700 mb-2"><strong>Климат:</strong> {c.climate.summary}</div>
            <div className="text-[14.5px] text-ink-700"><strong>Лучший сезон:</strong> {c.climate.bestSeason}</div>
          </div>

          {/* CITIES + quick links */}
          <h2 className="font-display font-extrabold text-2xl text-ink-900 mb-4">Куда лететь</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {c.cities.map((city) => (
              <a
                key={city.code}
                href={`https://www.aviasales.ru/search/MOW0101${city.code}1?marker=${tpMarker}.country_${c.slug}`}
                target="_blank"
                rel="noopener sponsored"
                className="group flex items-center justify-between bg-white border border-ink-100 rounded-xl p-4 hover:border-brand-300 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="font-display font-extrabold text-ink-900">{city.name}</div>
                  <div className="text-[12px] text-ink-500 font-mono">{city.code}</div>
                </div>
                <Plane className="w-4 h-4 text-ink-400 group-hover:text-brand-600" />
              </a>
            ))}
          </div>
        </div>

        {/* ASIDE CTA */}
        <aside className="lg:sticky lg:top-24 lg:self-start space-y-3">
          <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white p-6">
            <Plane className="w-7 h-7 text-white/90 mb-3" />
            <div className="font-display font-extrabold text-xl mb-2">Найти перелёт</div>
            <p className="text-[13.5px] text-white/85 mb-4">Сравним цены 100+ авиакомпаний на рейсы в {c.name}.</p>
            <Link
              to={`/flights?to=${c.cities[0]?.code ?? ''}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand-700 font-bold text-sm hover:-translate-y-0.5 transition-all"
            >
              Открыть поиск
            </Link>
          </div>

          <div className="rounded-2xl bg-white border border-ink-100 p-6">
            <HotelIcon className="w-7 h-7 text-brand-600 mb-3" />
            <div className="font-display font-extrabold text-xl mb-2 text-ink-900">Подобрать отель</div>
            <p className="text-[13.5px] text-ink-500 mb-4">900 000+ отелей в базе. Цены — финальные, без скрытых комиссий.</p>
            <Link
              to={`/hotels?destination=${encodeURIComponent(c.cities[0]?.name ?? c.name)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink-900 text-white font-bold text-sm hover:bg-ink-800 transition-all"
            >
              Найти отель
            </Link>
          </div>

          <div className="rounded-2xl bg-white border border-ink-100 p-6">
            <Sparkles className="w-7 h-7 text-amber-500 mb-3" />
            <div className="font-display font-extrabold text-lg mb-2 text-ink-900">Спросите Ириску</div>
            <p className="text-[13.5px] text-ink-500">AI-консьерж знает {c.name} как местный — спросите про районы, рестораны, маршруты.</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Fact({ Icon, label, value }: { Icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-9 h-9 rounded-xl bg-brand-50 text-brand-600 grid place-items-center">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[10.5px] uppercase tracking-wider font-bold text-ink-500">{label}</div>
        <div className="font-bold text-ink-900 truncate">{value}</div>
      </div>
    </div>
  );
}
