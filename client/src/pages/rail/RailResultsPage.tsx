import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Train, ArrowRight, Clock, ChevronRight, ArrowLeftRight, Plus } from 'lucide-react';
import { searchTrains } from '@/features/rail/mock';
import { CAR_CLASS_META } from '@/features/rail/carLayouts';
import { RailSearchForm } from '@/features/rail/RailSearchForm';
import { fmtTime, fmtDuration, fmtDateRu } from '@/features/rail/format';

/** RailResultsPage (/trains/results) — список поездов по маршруту. */
export function RailResultsPage() {
  const [sp] = useSearchParams();
  const from = sp.get('from') ?? '';
  const to = sp.get('to') ?? '';
  const date = sp.get('date') ?? new Date().toISOString().slice(0, 10);
  const ret = sp.get('ret') ?? '';
  const pax = Number(sp.get('pax') ?? 1);

  const trains = useMemo(
    () => searchTrains({ fromCode: from, toCode: to, date, passengers: pax }),
    [from, to, date, pax],
  );
  const route = trains[0];
  const paxWord = pax === 1 ? 'пассажир' : pax < 5 ? 'пассажира' : 'пассажиров';

  // Поиск обратного направления (меняем from/to местами, дата = обратная)
  const returnSearch = ret
    ? `/trains/results?from=${to}&to=${from}&date=${ret}&pax=${pax}&ret=${date}`
    : '';

  return (
    <div className="min-h-screen bg-surface-1">
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-5">
          <div className="flex items-center gap-2 text-ink-900 font-display font-extrabold text-xl mb-1">
            {route ? `${route.from.city} → ${route.to.city}` : 'Поезда'}
          </div>
          <div className="text-ink-500 text-sm mb-4">
            {fmtDateRu(date)} · {pax} {paxWord}
            {ret && <> · обратно {fmtDateRu(ret)}</>}
          </div>
          <details className="group">
            <summary className="cursor-pointer text-brand-600 font-semibold text-sm inline-flex items-center gap-1">
              Изменить поиск <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
            </summary>
            <div className="mt-4 bg-surface-1 rounded-2xl p-4 border border-ink-100">
              <RailSearchForm initial={{ from, to, date, ret, pax }} />
            </div>
          </details>
        </div>
      </div>

      {/* Round-trip полоса: туда/обратно */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 pt-6">
        {ret ? (
          <Link
            to={returnSearch}
            className="flex items-center gap-3 bg-white border border-ink-100 rounded-2xl px-5 py-3.5 hover:border-brand-300 hover:shadow-sm transition-all"
          >
            <span className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 grid place-items-center shrink-0">
              <ArrowLeftRight className="w-4 h-4" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-bold text-ink-900 text-sm">
                Обратный билет · {route ? `${route.to.city} → ${route.from.city}` : ''}
              </span>
              <span className="block text-[12.5px] text-ink-500">{fmtDateRu(ret)} — выберите поезд на обратный путь</span>
            </span>
            <ChevronRight className="w-4 h-4 text-ink-300 shrink-0" />
          </Link>
        ) : (
          <Link
            to={`/trains/results?from=${to}&to=${from}&date=${date}&pax=${pax}`}
            className="inline-flex items-center gap-2 text-brand-600 font-semibold text-sm hover:text-brand-700"
          >
            <Plus className="w-4 h-4" /> Добавить обратный билет
          </Link>
        )}
      </div>

      <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-6 space-y-4">
        {trains.map((t) => (
          <div key={t.id} className="bg-white border border-ink-100 rounded-2xl p-5 hover:shadow-[var(--shadow-card)] transition-shadow">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 grid place-items-center shrink-0">
                  <Train className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display font-extrabold text-ink-900">
                    Поезд {t.number}
                    {t.brandName && <span className="ml-2 text-[12px] font-bold text-amber-600 align-middle">«{t.brandName}»</span>}
                  </div>
                  <div className="text-[12.5px] text-ink-500">{t.carrier}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="font-display font-extrabold text-2xl text-ink-900 tabular-nums">{fmtTime(t.departAt)}</div>
                  <div className="text-[11.5px] text-ink-400 max-w-[120px] truncate">{t.from.name}</div>
                </div>
                <div className="text-center text-ink-400">
                  <div className="text-[11px] inline-flex items-center gap-1"><Clock className="w-3 h-3" />{fmtDuration(t.durationMinutes)}</div>
                  <div className="w-16 sm:w-24 h-px bg-ink-200 my-1.5 relative">
                    <ArrowRight className="w-3 h-3 absolute -right-1 -top-1.5 text-ink-300" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-display font-extrabold text-2xl text-ink-900 tabular-nums">{fmtTime(t.arriveAt)}</div>
                  <div className="text-[11.5px] text-ink-400 max-w-[120px] truncate">{t.to.name}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-ink-100">
              {t.classes.map((c) => (
                <Link
                  key={c.carClass}
                  to={`/trains/train?from=${from}&to=${to}&date=${date}&pax=${pax}&train=${encodeURIComponent(t.id)}&cls=${c.carClass}`}
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-ink-100 hover:border-brand-300 hover:bg-brand-50/40 transition-colors"
                >
                  <span className="font-semibold text-ink-900 text-sm">{CAR_CLASS_META[c.carClass].short}</span>
                  <span className="text-[12.5px] text-ink-500">от {c.priceFrom.toLocaleString('ru-RU')} ₽</span>
                  <span className="text-[11px] text-mint-500 font-semibold">{c.freeSeats} мест</span>
                  <ChevronRight className="w-4 h-4 text-ink-300 group-hover:text-brand-600" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
