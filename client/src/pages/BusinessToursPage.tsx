import { Link } from 'react-router-dom';
import { Briefcase, Users, FileText, Wallet, Plane, Calendar, ArrowRight, ShieldCheck, Sparkles, BarChart3 } from 'lucide-react';

/**
 * BusinessToursPage — корпоративные / бизнес-туры, MICE, делегации.
 * Лид-форма с переходом на /contacts, описание услуг.
 */
export function BusinessToursPage() {
  const services = [
    { Icon: Plane,     title: 'Деловые поездки',          text: 'Бронирование рейсов и отелей для сотрудников с консолидированным счётом' },
    { Icon: Users,     title: 'MICE-мероприятия',         text: 'Конференции, тренинги, корпоративы и тимбилдинги под ключ' },
    { Icon: Briefcase, title: 'Инсентив-туры',            text: 'Поощрительные поездки для лучших сотрудников и партнёров' },
    { Icon: Calendar,  title: 'Выставки и форумы',        text: 'Сопровождение групп на международные выставки и индустриальные форумы' },
    { Icon: ShieldCheck, title: 'Бизнес-визы и travel-policy', text: 'Помощь с визовой поддержкой, оформлением приглашений, разработка travel-политики' },
    { Icon: BarChart3, title: 'Аналитика и отчётность',   text: 'Дашборд расходов на командировки, экспорт в 1С / SAP, кастомные отчёты' },
  ];

  const advantages = [
    { value: '12%', label: 'средняя экономия за счёт корпоративных тарифов' },
    { value: '24/7', label: 'персональный travel-менеджер в Telegram' },
    { value: '0 ₽', label: 'нет комиссии за обслуживание для контрактных клиентов' },
    { value: '5 мин', label: 'среднее время ответа на запрос' },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink-900 to-brand-700 text-white">
        <div className="absolute inset-0 hero-overlay opacity-50" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-mono font-medium uppercase tracking-[.18em] mb-6">
            <Briefcase className="w-3 h-3 text-amber-400" /> Business travel
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
            Корпоративные поездки —<br />
            <em className="not-italic text-amber-400">без головной боли</em>
          </h1>
          <p className="text-white/85 text-lg mt-5 max-w-2xl">
            Командировки, делегации, конференции, MICE-мероприятия. Один договор, единый счёт, прозрачная аналитика расходов и персональный travel-менеджер для вашей команды.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <Link to="/contacts?subject=Бизнес-туры" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-brand-700 font-bold hover:-translate-y-0.5 transition-all shadow-md">
              Получить КП <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="https://t.me/freestyle_business" target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/30 text-white font-bold hover:bg-white/10 transition-all">
              Telegram отдела продаж
            </a>
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="bg-white border-b border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((a) => (
            <div key={a.label} className="text-center">
              <div className="font-display font-extrabold text-3xl md:text-4xl text-brand-600 tabular-nums tracking-tight">{a.value}</div>
              <div className="text-[12.5px] text-ink-500 mt-1">{a.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-3">Услуги</div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 leading-tight tracking-tight">
            Что мы делаем для бизнеса
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div key={s.title} className="bg-white border border-ink-100 rounded-2xl p-7 hover:border-brand-300 hover:shadow-sm transition-all">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 grid place-items-center mb-4">
                <s.Icon className="w-5 h-5" />
              </div>
              <div className="font-display font-extrabold text-lg text-ink-900 mb-2">{s.title}</div>
              <p className="text-sm text-ink-500 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-surface-1 border-y border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[11px] uppercase tracking-[.18em] font-bold text-brand-600 mb-3">Почему FreeStyle</div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 leading-tight tracking-tight mb-6">
              Travel-policy под ваши <em className="not-italic text-brand-600">правила</em>
            </h2>
            <ul className="space-y-4 text-[15.5px] text-ink-700">
              <Item>Контрактные тарифы с авиакомпаниями (Аэрофлот, S7, Турецкие линии, Эмирэйтс)</Item>
              <Item>Прямые договоры с 12 000+ отелями, в том числе российскими и зарубежными сетями</Item>
              <Item>Интеграция с вашей корпоративной системой (1С, SAP Concur, Bitrix24)</Item>
              <Item>Поддержка во время поездки 24/7 — мобильный менеджер доступен в любом часовом поясе</Item>
              <Item>Закрывающие документы для бухгалтерии — УПД, счёт-фактура, акты</Item>
              <Item>Антифрод и контроль расходов — каждая бронь проходит проверку на соответствие travel-policy</Item>
            </ul>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80"
              alt="Business travel"
              className="w-full aspect-[4/3] rounded-3xl object-cover"
            />
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl p-5 shadow-xl border border-ink-100 max-w-[260px]">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-brand-600" />
                <div className="text-[10.5px] uppercase tracking-wider font-bold text-ink-500">Экономия</div>
              </div>
              <div className="font-display font-extrabold text-2xl text-ink-900 tabular-nums">847 000 ₽</div>
              <div className="text-[12px] text-ink-500 mt-1">в год для команды из 25 человек по сравнению с разовыми бронированиями</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20">
        <h2 className="font-display font-extrabold text-3xl text-ink-900 text-center mb-12">Как мы начинаем работу</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Step n="01" Icon={FileText} title="Заявка от вас"        text="Расскажите про команду и travel-задачи" />
          <Step n="02" Icon={Sparkles} title="Аудит расходов"        text="За 3-5 дней предложим оптимизацию текущих" />
          <Step n="03" Icon={Briefcase} title="Договор"              text="Юр.лицо, безналичный расчёт, постоплата" />
          <Step n="04" Icon={Plane}    title="Поехали"               text="Команда travel-менеджеров в Telegram и дашборд" />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 text-center">
        <Briefcase className="w-10 h-10 mx-auto text-brand-600 mb-4" />
        <h2 className="font-display font-extrabold text-3xl text-ink-900 mb-3">Готовы обсудить?</h2>
        <p className="text-ink-500 mb-6 max-w-xl mx-auto">Оставьте заявку или напишите в Telegram — пришлём расчёт под вашу команду за 24 часа.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/contacts?subject=Бизнес-туры" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg">
            Оставить заявку <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="https://t.me/freestyle_business" target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-ink-200 text-ink-900 font-bold hover:border-ink-300 hover:bg-surface-2 transition-all">
            Telegram
          </a>
        </div>
        <p className="text-[11.5px] text-ink-400 mt-5">Минимальная команда от 5 сотрудников · KPI обсуждаем индивидуально</p>
      </section>
    </div>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <div className="w-5 h-5 rounded-md bg-mint-500/15 text-mint-700 grid place-items-center shrink-0 mt-0.5">
        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <span>{children}</span>
    </li>
  );
}

function Step({ n, Icon, title, text }: { n: string; Icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 grid place-items-center"><Icon className="w-5 h-5" /></div>
        <div className="text-[40px] font-display font-extrabold text-ink-100 leading-none">{n}</div>
      </div>
      <div className="font-display font-extrabold text-lg text-ink-900 mb-1">{title}</div>
      <p className="text-sm text-ink-500">{text}</p>
    </div>
  );
}
