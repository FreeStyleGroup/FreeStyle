import { Link } from 'react-router-dom';
import { Stamp, ShieldCheck, Clock, Globe2, ArrowRight, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { tpRefLink } from '@/components/affiliate/TpWidget';

/**
 * VisasPage — оформление виз и визовая помощь.
 * Партнёрство с iVisa (через Travelpayouts) + кураторская справка по визовому режиму.
 */
export function VisasPage() {
  const ivisaLink = tpRefLink({
    base: 'https://tp.media/r',
    params: { p: '4115', u: 'https://www.ivisa.com' },
    subId: 'visa_main',
  });

  const visaFree = [
    { name: 'Турция',    flag: '🇹🇷', days: 60,  slug: 'turkey' },
    { name: 'Таиланд',   flag: '🇹🇭', days: 60,  slug: 'thailand' },
    { name: 'ОАЭ',       flag: '🇦🇪', days: 90,  slug: 'uae' },
    { name: 'Грузия',    flag: '🇬🇪', days: 365, slug: 'georgia' },
    { name: 'Сербия',    flag: '🇷🇸', days: 30,  slug: 'serbia' },
    { name: 'Вьетнам',   flag: '🇻🇳', days: 45,  slug: 'vietnam' },
  ];

  const visaOnArrival = [
    { name: 'Египет',    flag: '🇪🇬', cost: '$25',  slug: 'egypt' },
    { name: 'Индонезия', flag: '🇮🇩', cost: '$35',  slug: 'indonesia' },
    { name: 'Шри-Ланка', flag: '🇱🇰', cost: '$50',  slug: '' },
    { name: 'Камбоджа',  flag: '🇰🇭', cost: '$30',  slug: '' },
  ];

  const visaRequired = [
    { name: 'Шенген (ЕС)',    flag: '🇪🇺', note: 'Запись в визовый центр VFS/BLS' },
    { name: 'США',             flag: '🇺🇸', note: 'B1/B2 — собеседование в посольстве' },
    { name: 'Великобритания',  flag: '🇬🇧', note: 'Standard visitor visa' },
    { name: 'Канада',          flag: '🇨🇦', note: 'eTA или TRV' },
    { name: 'Япония',          flag: '🇯🇵', note: 'Туристическая виза' },
    { name: 'Австралия',       flag: '🇦🇺', note: 'eVisitor / ETA' },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 hero-overlay opacity-60" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-mono font-medium uppercase tracking-[.18em] mb-6">
            <Stamp className="w-3 h-3 text-amber-500" /> Визы и въезд
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
            Визы для россиян <em className="not-italic text-amber-500">в 2026</em>
          </h1>
          <p className="text-white/85 text-lg mt-5 max-w-2xl">
            Куда можно без визы, где оформить онлайн, а куда нужен визовый центр. Проверьте требования и оформите электронную визу через iVisa за 24-72 часа.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <a href={ivisaLink} target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-brand-700 font-bold hover:-translate-y-0.5 transition-all">
              Оформить визу онлайн <ArrowRight className="w-4 h-4" />
            </a>
            <Link to="/countries" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/30 text-white font-bold hover:bg-white/10 transition-all">
              Все страны
            </Link>
          </div>
        </div>
      </section>

      {/* VISA-FREE */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-mint-500/15 text-mint-700 grid place-items-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-ink-900">Без визы</h2>
        </div>
        <p className="text-ink-500 mb-6">По загранпаспорту — прямой въезд, никаких документов заранее</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visaFree.map((v) => (
            <Card key={v.name} slug={v.slug}>
              <div className="text-3xl mb-2">{v.flag}</div>
              <div className="font-display font-extrabold text-lg text-ink-900">{v.name}</div>
              <div className="text-[13px] text-mint-700 font-bold mt-1">до {v.days} дней</div>
            </Card>
          ))}
        </div>
      </section>

      {/* VISA ON ARRIVAL */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 grid place-items-center">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-ink-900">Виза по прилёту</h2>
        </div>
        <p className="text-ink-500 mb-6">Оформляется в аэропорту за 5-15 минут</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {visaOnArrival.map((v) => (
            <Card key={v.name} slug={v.slug}>
              <div className="text-3xl mb-2">{v.flag}</div>
              <div className="font-display font-extrabold text-lg text-ink-900">{v.name}</div>
              <div className="text-[13px] text-amber-700 font-bold mt-1">{v.cost}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* VISA REQUIRED */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-coral-100 text-coral-700 grid place-items-center">
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-ink-900">Нужна виза</h2>
        </div>
        <p className="text-ink-500 mb-6">Заранее оформляется в визовом центре или посольстве</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visaRequired.map((v) => (
            <div key={v.name} className="bg-white border border-ink-100 rounded-2xl p-5">
              <div className="text-3xl mb-2">{v.flag}</div>
              <div className="font-display font-extrabold text-lg text-ink-900 mb-1">{v.name}</div>
              <div className="text-[12.5px] text-ink-500">{v.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-surface-1 border-y border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
          <h2 className="font-display font-extrabold text-3xl text-ink-900 text-center mb-3">Как оформить онлайн-визу</h2>
          <p className="text-ink-500 text-center mb-12 max-w-xl mx-auto">Через iVisa — мировой лидер по оформлению e-Visa, поддержка 20+ стран на русском</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Step n="01" title="Выберите страну"  text="Из 30+ стран с электронной визой" />
            <Step n="02" title="Заполните анкету" text="10-15 минут, по-русски" />
            <Step n="03" title="Оплата онлайн"     text="Картой или USDT" />
            <Step n="04" title="Виза на email"     text="24-72 часа — готово" />
          </div>
        </div>
      </section>

      {/* WARNING */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-10">
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
          <div className="text-[14px] text-ink-700 leading-relaxed">
            <strong>Важно:</strong> визовые требования меняются. Перед поездкой проверяйте актуальные правила на сайте посольства страны назначения.
            Срок действия загранпаспорта обычно — минимум 6 месяцев после даты возвращения.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 text-center">
        <Sparkles className="w-10 h-10 mx-auto text-brand-600 mb-4" />
        <h2 className="font-display font-extrabold text-3xl text-ink-900 mb-3">Не знаете нужна ли виза?</h2>
        <p className="text-ink-500 mb-6 max-w-xl mx-auto">Спросите AI-консьержа Феликса — расскажет про визу для любой страны в чате справа внизу.</p>
        <a href={ivisaLink} target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg">
          <Globe2 className="w-4 h-4" /> Оформить визу онлайн
        </a>
      </section>
    </div>
  );
}

function Card({ slug, children }: { slug?: string; children: React.ReactNode }) {
  const className = 'bg-white border border-ink-100 rounded-2xl p-5 hover:border-brand-300 hover:shadow-sm transition-all block';
  if (slug) return <Link to={`/countries/${slug}`} className={className}>{children}</Link>;
  return <div className={className}>{children}</div>;
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-6">
      <div className="text-[40px] font-display font-extrabold text-brand-600/20 leading-none">{n}</div>
      <div className="font-display font-extrabold text-lg text-ink-900 mb-1 mt-3">{title}</div>
      <p className="text-sm text-ink-500">{text}</p>
    </div>
  );
}
