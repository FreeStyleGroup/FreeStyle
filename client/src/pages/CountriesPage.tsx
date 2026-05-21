import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Globe2, Loader2, Plane, ShieldCheck, ShieldAlert } from 'lucide-react';
import { countriesApi } from '@/api/countries.api';
import type { CountryListItem } from '@freestyle/shared';

const VISA_TONE: Record<string, { label: string; tone: string; Icon: typeof ShieldCheck }> = {
  no:           { label: 'Без визы',          tone: 'bg-mint-500/15 text-mint-700 border-mint-500/30',  Icon: ShieldCheck },
  'on-arrival': { label: 'Виза по прилёту',   tone: 'bg-amber-50 text-amber-700 border-amber-200',      Icon: ShieldCheck },
  'e-visa':     { label: 'Онлайн-виза',       tone: 'bg-amber-50 text-amber-700 border-amber-200',      Icon: ShieldCheck },
  yes:          { label: 'Нужна виза',        tone: 'bg-coral-100 text-coral-700 border-coral-200',     Icon: ShieldAlert },
};

export function CountriesPage() {
  const [items, setItems] = useState<CountryListItem[] | null>(null);
  const [search, setSearch] = useState('');
  const [visaFilter, setVisaFilter] = useState<'' | 'no' | 'on-arrival' | 'e-visa' | 'yes'>('');

  useEffect(() => {
    countriesApi.list().then(setItems).catch(() => setItems([]));
  }, []);

  const filtered = useMemo(() => {
    if (!items) return null;
    const q = search.trim().toLowerCase();
    return items.filter((c) => {
      if (visaFilter && c.visa.required !== visaFilter) return false;
      if (q && !c.name.toLowerCase().includes(q) && !c.nameEn.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, search, visaFilter]);

  return (
    <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
      <header className="mb-10">
        <div className="text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-3">
          Страны мира
        </div>
        <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink-900 leading-tight tracking-tight mb-4">
          Куда поехать в 2026 году
        </h1>
        <p className="text-ink-500 text-lg max-w-2xl">
          Визовые требования для россиян, лучший сезон, время полёта, валюта — всё, что нужно знать перед поездкой.
        </p>
      </header>

      {/* Filters */}
      <div className="bg-white border border-ink-100 rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Найти страну…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-ink-200 rounded-xl text-sm outline-none focus:border-brand-500"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Chip active={visaFilter === ''}           onClick={() => setVisaFilter('')}>Все</Chip>
          <Chip active={visaFilter === 'no'}         onClick={() => setVisaFilter('no')}>Без визы</Chip>
          <Chip active={visaFilter === 'on-arrival'} onClick={() => setVisaFilter('on-arrival')}>По прилёту</Chip>
          <Chip active={visaFilter === 'e-visa'}     onClick={() => setVisaFilter('e-visa')}>Онлайн-виза</Chip>
          <Chip active={visaFilter === 'yes'}        onClick={() => setVisaFilter('yes')}>С визой</Chip>
        </div>
      </div>

      {/* Grid */}
      {!filtered ? (
        <div className="min-h-[40vh] grid place-items-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 p-12 text-center">
          <Globe2 className="w-12 h-12 mx-auto text-ink-300" />
          <p className="mt-3 text-ink-500">По этим фильтрам ничего не найдено.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => {
            const visa = VISA_TONE[c.visa.required] ?? VISA_TONE.yes;
            return (
              <Link key={c.code} to={`/countries/${c.slug}`} className="group bg-white border border-ink-100 rounded-2xl overflow-hidden hover:border-brand-300 hover:shadow-lg transition-all flex flex-col">
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img
                    src={c.heroImage}
                    alt={c.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-bold bg-white/95 backdrop-blur ${visa.tone}`}>
                      <visa.Icon className="w-3 h-3" />
                      {visa.label}
                    </span>
                    {c.popular && (
                      <span className="px-2 py-0.5 rounded-md bg-brand-600 text-white text-[10.5px] font-bold uppercase tracking-wider">
                        ТОП
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-2xl mb-1">{c.flag}</div>
                    <div className="font-display font-extrabold text-2xl leading-tight">{c.name}</div>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-[13.5px] text-ink-500 leading-relaxed mb-4 line-clamp-2">{c.shortDescription}</p>
                  <div className="mt-auto grid grid-cols-2 gap-2 text-[12px]">
                    <Spec label="Полёт" value={c.flightTimeFromMoscow} />
                    <Spec label="Валюта" value={c.currency} />
                    <Spec label="Сезон" value={c.climate.bestSeason.split(',')[0]} />
                    <Spec label="Время" value={c.timeZone} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Footer CTA */}
      <div className="mt-12 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-white p-8 md:p-12 text-center">
        <Plane className="w-10 h-10 mx-auto mb-4 text-white/90" />
        <h2 className="font-display font-extrabold text-2xl md:text-3xl mb-2">Не определились с направлением?</h2>
        <p className="text-white/85 mb-6 max-w-xl mx-auto">Спросите AI-консьержа Феликса — он подскажет, куда лететь по бюджету, сезону и интересам.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-bold hover:-translate-y-0.5 transition-all">
          Открыть поиск рейсов
        </Link>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-lg text-[12.5px] font-bold transition-colors ${
        active ? 'bg-brand-600 text-white' : 'bg-surface-2 text-ink-700 hover:bg-ink-100'
      }`}
    >
      {children}
    </button>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wider font-bold text-ink-400">{label}</div>
      <div className="font-bold text-ink-900 truncate">{value}</div>
    </div>
  );
}
