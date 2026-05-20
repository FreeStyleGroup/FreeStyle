import { useState, useEffect } from 'react';
import { CheckCircle2, Sparkles, Shield, Clock } from 'lucide-react';
import { SearchTabs, type SearchTabKey } from '@/components/search/SearchTabs';
import { FlightSearchForm } from '@/components/search/FlightSearchForm';
import { HotelSearchForm } from '@/components/search/HotelSearchForm';
import { NavTiles } from '@/components/home/NavTiles';
import { HotDeals } from '@/components/home/HotDeals';
import { BlogPreview } from '@/components/home/BlogPreview';
import { DestinationCard } from '@/components/cards/DestinationCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { destinationsApi } from '@/api/destinations.api';
import type { Destination } from '@freestyle/shared';

export function HomePage() {
  const [activeTab, setActiveTab] = useState<SearchTabKey>('flights');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    destinationsApi.getAll()
      .then(setDestinations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-surface-1">
      {/* ═══════════ HERO — rounded card на светлом фоне ═══════════ */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 pt-6 md:pt-8">
        <div className="relative overflow-hidden rounded-[28px] hero-gradient min-h-[360px] md:min-h-[420px] flex items-center">
          {/* Background image overlay (subtle) */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
            style={{ backgroundImage: 'url(/hero/main.webp)' }}
          />
          <div className="absolute inset-0 hero-overlay" />

          {/* Big decorative letter behind */}
          <div className="hero-deco hidden md:block">F</div>

          <div className="relative z-10 w-full px-6 md:px-14 py-10 md:py-14 max-w-3xl animate-float-up">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-pill text-white text-[11px] font-mono font-medium tracking-[.15em] uppercase mb-5">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-amber-500 animate-pulse-amber" />
                <span className="relative inline-flex w-full h-full rounded-full bg-amber-500" />
              </span>
              FreeStyle · с 2026
            </div>

            <h1 className="font-display text-white font-extrabold leading-[1.05] tracking-tight text-3xl md:text-[42px] lg:text-[50px] mb-4">
              Путешествие <em className="not-italic text-amber-500">без компромиссов</em>
              <br />
              начинается здесь
            </h1>

            <p className="text-white/85 text-base md:text-lg leading-relaxed max-w-xl">
              Сравните цены сотен авиакомпаний, тысячи отелей и готовых туров в одном поиске. Без накруток, без скрытых сборов.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ SEARCH WIDGET — белая карточка на сером фоне, между hero и tiles ═══════════ */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 -mt-10 md:-mt-12 relative z-10">
        <div className="bg-white rounded-[24px] p-2 shadow-[var(--shadow-hero)] animate-float-up" style={{ animationDelay: '120ms' }}>
          <div className="px-2 pt-2 overflow-x-auto scrollbar-hide">
            <SearchTabs active={activeTab} onChange={setActiveTab} />
          </div>

          <div className="p-3 md:p-4 pt-3">
            {activeTab === 'flights' ? <FlightSearchForm /> : <HotelSearchForm />}
          </div>
        </div>

        {/* Trust ribbon */}
        <div
          className="flex flex-wrap gap-x-6 md:gap-x-8 gap-y-2.5 mt-5 md:mt-6 text-ink-700 text-sm font-medium animate-float-up"
          style={{ animationDelay: '220ms' }}
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-600" />
            <span>Цены без накруток</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-brand-600" />
            <span>Безопасная оплата</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Кэшбэк до 5%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-600" />
            <span>Поддержка 24/7</span>
          </div>
        </div>
      </section>

      {/* ═══ NAV TILES — 10 категорий с 3D-иконками ═══ */}
      <NavTiles />

      {/* ═══ HOT DEALS ═══ */}
      <HotDeals />

      {/* ═══ POPULAR DESTINATIONS ═══ */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-600 text-[11px] font-bold tracking-[.15em] uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            Популярные направления
          </div>
          <h2 className="font-display text-2xl md:text-4xl font-extrabold text-ink-900 tracking-tight">
            Куда летят <span className="text-brand-600">этим сезоном</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {destinations.slice(0, 8).map((dest) => (
              <DestinationCard key={dest.slug} destination={dest} />
            ))}
          </div>
        )}
      </section>

      {/* ═══ BLOG PREVIEW ═══ */}
      <BlogPreview />
    </div>
  );
}

