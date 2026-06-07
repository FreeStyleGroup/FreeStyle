import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeftRight, CalendarDays, Users, Search } from 'lucide-react';
import { RAIL_STATIONS } from './mock';

/**
 * RailSearchForm — форма поиска поездов (наш UI). Формирует переход на
 * страницу результатов. Станции пока из справочника-мока (позже — автокомплит
 * по Экспресс-3).
 */
interface Props {
  initial?: { from?: string; to?: string; date?: string; pax?: number };
  compact?: boolean;
}

export function RailSearchForm({ initial, compact }: Props) {
  const navigate = useNavigate();
  const [from, setFrom] = useState(initial?.from ?? RAIL_STATIONS[0].code);
  const [to, setTo] = useState(initial?.to ?? RAIL_STATIONS[2].code);
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [pax, setPax] = useState(initial?.pax ?? 1);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams({ from, to, date, pax: String(pax) });
    navigate(`/trains/results?${q.toString()}`);
  };

  return (
    <form onSubmit={submit} className={`grid gap-3 ${compact ? 'md:grid-cols-[1fr_auto_1fr_auto_auto]' : 'md:grid-cols-[1fr_auto_1fr_auto_auto]'} items-end`}>
      <Field label="Откуда" icon={MapPin}>
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="fs-rail-input">
          {RAIL_STATIONS.map((s) => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </select>
      </Field>

      <button type="button" onClick={swap} aria-label="Поменять местами" className="hidden md:grid place-items-center w-10 h-11 rounded-xl border border-ink-100 text-ink-500 hover:text-brand-600 hover:border-brand-300 transition-colors mb-0.5">
        <ArrowLeftRight className="w-4 h-4" />
      </button>

      <Field label="Куда" icon={MapPin}>
        <select value={to} onChange={(e) => setTo(e.target.value)} className="fs-rail-input">
          {RAIL_STATIONS.map((s) => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </select>
      </Field>

      <Field label="Дата" icon={CalendarDays}>
        <input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} className="fs-rail-input" />
      </Field>

      <Field label="Пассажиры" icon={Users}>
        <input type="number" min={1} max={9} value={pax} onChange={(e) => setPax(Math.max(1, Math.min(9, Number(e.target.value))))} className="fs-rail-input w-24" />
      </Field>

      <button type="submit" className="md:col-span-5 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg">
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
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
        {children}
      </span>
    </label>
  );
}
