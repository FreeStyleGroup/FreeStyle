import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeftRight, Users, Search, Minus, Plus } from 'lucide-react';
import { RAIL_STATIONS } from './mock';
import { DatePicker } from './DatePicker';

/**
 * RailSearchForm — форма поиска поездов (наш UI). Поддерживает обратный билет
 * (round-trip): поля «Туда» и «Обратно» с кастомным календарём. Станции пока
 * из справочника-мока (позже — автокомплит по Экспресс-3).
 */
interface Props {
  initial?: { from?: string; to?: string; date?: string; ret?: string; pax?: number };
  compact?: boolean;
}

const today = () => new Date().toISOString().slice(0, 10);

export function RailSearchForm({ initial }: Props) {
  const navigate = useNavigate();
  const [from, setFrom] = useState(initial?.from ?? RAIL_STATIONS[0].code);
  const [to, setTo] = useState(initial?.to ?? RAIL_STATIONS[2].code);
  const [date, setDate] = useState(initial?.date ?? today());
  const [ret, setRet] = useState(initial?.ret ?? '');
  const [pax, setPax] = useState(initial?.pax ?? 1);

  const swap = () => { setFrom(to); setTo(from); };

  // Обратная дата не может быть раньше даты «туда»
  const onDate = (v: string) => {
    setDate(v);
    if (ret && ret < v) setRet(v);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams({ from, to, date, pax: String(pax) });
    if (ret) q.set('ret', ret);
    navigate(`/trains/results?${q.toString()}`);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1.5fr)_2.75rem_minmax(0,1.5fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end">
        <Field label="Откуда" icon={MapPin}>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="fs-rail-input">
            {RAIL_STATIONS.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
          </select>
        </Field>

        <button
          type="button"
          onClick={swap}
          aria-label="Поменять местами"
          className="hidden lg:grid place-items-center w-11 h-11 rounded-xl border border-ink-100 text-ink-500 hover:text-brand-600 hover:border-brand-300 hover:rotate-180 transition-all duration-300 mb-px justify-self-center"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>

        <Field label="Куда" icon={MapPin}>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="fs-rail-input">
            {RAIL_STATIONS.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
          </select>
        </Field>

        <DatePicker label="Туда" value={date} min={today()} onChange={onDate} />

        <DatePicker label="Обратно" value={ret} min={date} onChange={setRet} placeholder="+ обратно" clearable />

        <PassengerStepper value={pax} onChange={setPax} />
      </div>

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold hover:-translate-y-0.5 transition-all shadow-[var(--shadow-submit)] hover:shadow-[var(--shadow-submit-hover)]"
      >
        <Search className="w-4 h-4" /> Найти поезда
      </button>
    </form>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[12px] font-semibold text-ink-500 mb-1.5">{label}</span>
      <span className="relative block">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none z-10" />
        {children}
      </span>
    </label>
  );
}

function PassengerStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const set = (v: number) => onChange(Math.max(1, Math.min(9, v)));
  return (
    <div className="block">
      <span className="block text-[12px] font-semibold text-ink-500 mb-1.5">Пассажиры</span>
      <div className="relative flex items-center h-[2.85rem] rounded-xl border border-ink-100 bg-white px-2">
        <Users className="w-4 h-4 text-ink-400 shrink-0" />
        <button
          type="button"
          onClick={() => set(value - 1)}
          disabled={value <= 1}
          className="ml-auto w-7 h-7 grid place-items-center rounded-lg text-ink-500 hover:bg-surface-2 hover:text-brand-600 disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Меньше пассажиров"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-6 text-center font-bold text-ink-900 tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => set(value + 1)}
          disabled={value >= 9}
          className="w-7 h-7 grid place-items-center rounded-lg text-ink-500 hover:bg-surface-2 hover:text-brand-600 disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Больше пассажиров"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
