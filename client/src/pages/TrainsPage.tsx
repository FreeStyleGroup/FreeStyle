import { Link } from 'react-router-dom';
import { Train, Clock, ArrowRight, LayoutGrid, ShieldCheck, Wallet, BellRing } from 'lucide-react';
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
      {/* HERO + SEARCH */}
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 hero-overlay opacity-60" />
        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 pt-14 md:pt-20 pb-32">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-[11px] font-mono font-medium uppercase tracking-[.18em] mb-5">
              <Train className="w-3 h-3 text-amber-400" /> РЖД · поезда по России и СНГ
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] tracking-tight">
              Билеты на поезд —<br />
              <em className="not-italic text-amber-400">с выбором места на схеме</em>
            </h1>
            <p className="text-white/85 text-lg mt-5">
              Плацкарт, купе, СВ, Сапсан и Ласточка. Интерактивные схемы вагонов, электронная регистрация, посадка по паспорту.
            </p>
          </div>
        </div>

        <div className="relative max-w-[1100px] mx-auto px-4 md:px-8 -mt-20">
          <div className="bg-white rounded-3xl p-5 md:p-7 shadow-2xl border border-ink-100">
            <RailSearchForm initial={{ date: today }} />
          </div>
        </div>
      </section>

      {/* POPULAR */}
      <section className="max-w-[1320px] mx-auto px-4 md:px-8 py-14 md:py-20 mt-6">
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

function Feat({ Icon, title, text }: { Icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-6">
      <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 grid place-items-center mb-3"><Icon className="w-5 h-5" /></div>
      <div className="font-display font-extrabold text-lg text-ink-900 mb-1">{title}</div>
      <p className="text-sm text-ink-500 leading-relaxed">{text}</p>
    </div>
  );
}
