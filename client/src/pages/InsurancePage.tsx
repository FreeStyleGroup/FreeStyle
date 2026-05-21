import { ShieldCheck, Plane, Heart, Briefcase, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { tpRefLink } from '@/components/affiliate/TpWidget';

/**
 * InsurancePage — туристические страховки через Cherehapa
 * (партнёрский партнёр Travelpayouts).
 */
export function InsurancePage() {
  const cherehapaLink = tpRefLink({
    base: 'https://tp.media/r',
    params: { p: '4115', u: 'https://www.cherehapa.ru' },
    subId: 'insurance_main',
  });

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-mint-500 to-brand-700 text-white">
        <div className="absolute inset-0 hero-overlay opacity-50" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-mono font-medium uppercase tracking-[.18em] mb-6">
            <ShieldCheck className="w-3 h-3 text-amber-400" /> Travel-страховка
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
            Страховка путешественника<br />
            <em className="not-italic text-amber-400">за 3 минуты</em>
          </h1>
          <p className="text-white/85 text-lg mt-5 max-w-2xl">
            Сравните полисы 15+ страховщиков (Согласие, Альфа, Тинькофф, Ингосстрах). Покрытие до 100 000 €, экстренная помощь 24/7.
          </p>
          <a href={cherehapaLink} target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-xl bg-white text-brand-700 font-bold hover:-translate-y-0.5 transition-all">
            Подобрать страховку <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="font-display font-extrabold text-3xl text-ink-900 text-center mb-3">Что входит в полис</h2>
        <p className="text-ink-500 text-center mb-10">Стандартный пакет любой туристической страховки</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card Icon={Heart}         title="Медпомощь"         text="Лечение и госпитализация до 100 000 €" />
          <Card Icon={Plane}         title="Отмена поездки"    text="Возврат стоимости при болезни" />
          <Card Icon={Briefcase}     title="Багаж"             text="Утеря, кража, задержка вещей" />
          <Card Icon={AlertTriangle} title="Экстренная помощь" text="Эвакуация, репатриация, переводы" />
        </div>
      </section>

      <section className="bg-surface-1 border-y border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 text-center">
          <Sparkles className="w-10 h-10 mx-auto text-brand-600 mb-4" />
          <h2 className="font-display font-extrabold text-3xl text-ink-900 mb-3">Подобрать полис</h2>
          <p className="text-ink-500 mb-6 max-w-xl mx-auto">Cherehapa — крупнейший в РФ агрегатор travel-страховок. Сравниваем 15+ компаний в реальном времени.</p>
          <a href={cherehapaLink} target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg">
            Открыть подбор <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-[11.5px] text-ink-400 mt-5">Полис придёт на email сразу после оплаты · действует с момента покупки</p>
        </div>
      </section>
    </div>
  );
}

function Card({ Icon, title, text }: { Icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-6 hover:border-brand-300 hover:shadow-sm transition-all">
      <div className="w-11 h-11 rounded-xl bg-mint-500/15 text-mint-700 grid place-items-center mb-4"><Icon className="w-5 h-5" /></div>
      <div className="font-display font-extrabold text-lg text-ink-900 mb-1">{title}</div>
      <p className="text-sm text-ink-500 leading-relaxed">{text}</p>
    </div>
  );
}
