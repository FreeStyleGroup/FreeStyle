import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FieldCard } from './FieldCard';
import { Popup } from './Popup';

/**
 * PassengersField — поле «Пассажиры» с popup-селектором:
 * взрослые / дети 2-12 / младенцы до 2 + класс обслуживания.
 */

export type CabinClass = 'economy' | 'comfort' | 'business' | 'first';
const CABIN_LABELS: Record<CabinClass, string> = {
  economy: 'Эконом',
  comfort: 'Комфорт',
  business: 'Бизнес',
  first: 'Первый',
};

export interface Passengers {
  adults: number;
  children: number;
  infants: number;
  cabin: CabinClass;
}

interface PassengersFieldProps {
  value: Passengers;
  onChange: (v: Passengers) => void;
  className?: string;
}

export function PassengersField({ value, onChange, className }: PassengersFieldProps) {
  const [open, setOpen] = useState(false);

  const total = value.adults + value.children + value.infants;
  const totalLabel = `${total} ${plural(total, 'пассажир', 'пассажира', 'пассажиров')}`;

  const update = (k: keyof Passengers, v: number | CabinClass) =>
    onChange({ ...value, [k]: v });

  return (
    <div data-field className={`relative ${className ?? ''}`}>
      <FieldCard
        label="Пассажиры"
        value={totalLabel}
        sub={CABIN_LABELS[value.cabin]}
        isOpen={open}
        onClick={() => setOpen(!open)}
      />

      <Popup isOpen={open} onClose={() => setOpen(false)} align="right" width="340px">
        <div className="space-y-3">
          <PaxRow
            title="Взрослые" sub="старше 12 лет"
            value={value.adults}
            min={1} max={9}
            onChange={(v) => update('adults', v)}
          />
          <PaxRow
            title="Дети" sub="от 2 до 12 лет"
            value={value.children}
            min={0} max={8}
            onChange={(v) => update('children', v)}
          />
          <PaxRow
            title="Младенцы" sub="до 2 лет"
            value={value.infants}
            min={0} max={value.adults}
            onChange={(v) => update('infants', v)}
          />

          <div className="pt-3 border-t border-ink-100">
            <div className="text-[10.5px] uppercase tracking-[.1em] font-bold text-ink-400 mb-2">
              Класс обслуживания
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(CABIN_LABELS) as CabinClass[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update('cabin', c)}
                  className={`px-3 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                    value.cabin === c
                      ? 'bg-brand-50 text-brand-700 border border-brand-500'
                      : 'bg-surface-2 text-ink-700 border border-transparent hover:bg-surface-2/70'
                  }`}
                >
                  {CABIN_LABELS[c]}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full mt-1 py-2.5 rounded-xl bg-ink-900 text-white font-bold text-[13.5px] hover:bg-ink-700 transition-colors cursor-pointer"
          >
            Готово
          </button>
        </div>
      </Popup>
    </div>
  );
}

function PaxRow({
  title, sub, value, min = 0, max = 9, onChange,
}: { title: string; sub: string; value: number; min?: number; max?: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="font-bold text-[14px] text-ink-900 leading-tight">{title}</div>
        <div className="text-[11.5px] text-ink-500 mt-0.5">{sub}</div>
      </div>
      <div className="flex items-center gap-2">
        <CounterBtn onClick={() => onChange(value - 1)} disabled={value <= min}>
          <Minus className="w-3.5 h-3.5" />
        </CounterBtn>
        <span className="font-bold text-[15px] text-ink-900 tabular-nums w-6 text-center">{value}</span>
        <CounterBtn onClick={() => onChange(value + 1)} disabled={value >= max}>
          <Plus className="w-3.5 h-3.5" />
        </CounterBtn>
      </div>
    </div>
  );
}

function CounterBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-7 h-7 rounded-full border border-ink-200 grid place-items-center text-ink-700 hover:bg-brand-50 hover:border-brand-500 hover:text-brand-700 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-ink-200 disabled:hover:text-ink-700"
    >
      {children}
    </button>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
