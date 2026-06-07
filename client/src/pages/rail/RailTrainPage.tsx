import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Train, ArrowLeft, Check, ShieldCheck, CreditCard, Info } from 'lucide-react';
import { searchTrains, carOptionsForTrain, buildMockCar } from '@/features/rail/mock';
import { CAR_CLASS_META } from '@/features/rail/carLayouts';
import { CarSeatMap } from '@/features/rail/CarSeatMap';
import { fmtTime, fmtDuration, fmtDateRu } from '@/features/rail/format';
import type { CarLayout, CarOption, RailPassenger, RailSeat } from '@/features/rail/types';

function seatsByNumbers(layout: CarLayout, numbers: number[]): RailSeat[] {
  const all = layout.floors.flatMap((f) => f.seats);
  return numbers.map((n) => all.find((s) => s.number === n)).filter((s): s is RailSeat => Boolean(s));
}

export function RailTrainPage() {
  const [sp] = useSearchParams();
  const from = sp.get('from') ?? '';
  const to = sp.get('to') ?? '';
  const date = sp.get('date') ?? new Date().toISOString().slice(0, 10);
  const pax = Number(sp.get('pax') ?? 1);
  const trainId = sp.get('train') ?? '';
  const clsParam = sp.get('cls') ?? '';

  const train = useMemo(
    () => searchTrains({ fromCode: from, toCode: to, date, passengers: pax }).find((t) => t.id === trainId),
    [from, to, date, pax, trainId],
  );
  const cars = useMemo(() => (train ? carOptionsForTrain(train) : []), [train]);

  const [carId, setCarId] = useState(() => cars.find((c) => c.carClass === clsParam)?.id ?? cars[0]?.id ?? '');
  const [seats, setSeats] = useState<number[]>([]);
  const [step, setStep] = useState<'seats' | 'passengers'>('seats');
  const [passengers, setPassengers] = useState<RailPassenger[]>([]);
  const [eReg, setEReg] = useState(true);
  const [done, setDone] = useState(false);

  const car = cars.find((c) => c.id === carId);
  const layout = useMemo(() => (car ? buildMockCar(car.carClass, car.id) : null), [car]);
  const selectedSeats = layout ? seatsByNumbers(layout, seats) : [];
  const total = selectedSeats.reduce((s, x) => s + x.price, 0);

  if (!train || !car || !layout) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-16 text-center">
        <p className="text-ink-500 mb-4">Поезд не найден или сессия истекла.</p>
        <Link to="/trains" className="text-brand-600 font-bold">← Вернуться к поиску</Link>
      </div>
    );
  }

  const changeCar = (id: string) => {
    setCarId(id);
    setSeats([]);
  };
  const toggle = (seat: RailSeat) =>
    setSeats((prev) => (prev.includes(seat.number) ? prev.filter((n) => n !== seat.number) : [...prev, seat.number]));

  const goPassengers = () => {
    setPassengers(
      selectedSeats.map((s) => ({
        lastName: '', firstName: '', middleName: '', birthDate: '', gender: 'M',
        docType: 'passport_rf', docNumber: '', tariff: 'full', seatNumber: s.number,
      })),
    );
    setStep('passengers');
  };

  return (
    <div className="min-h-screen bg-surface-1">
      {/* summary bar */}
      <div className="bg-white border-b border-ink-100">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-4 flex items-center gap-4 flex-wrap">
          <Link to={`/trains/results?from=${from}&to=${to}&date=${date}&pax=${pax}`} className="inline-flex items-center gap-1.5 text-ink-500 hover:text-brand-600 text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> К поездам
          </Link>
          <div className="h-5 w-px bg-ink-100" />
          <div className="flex items-center gap-2">
            <Train className="w-4 h-4 text-brand-600" />
            <span className="font-display font-extrabold text-ink-900">Поезд {train.number}</span>
            {train.brandName && <span className="text-[12px] font-bold text-amber-600">«{train.brandName}»</span>}
          </div>
          <div className="text-ink-500 text-sm tabular-nums">
            {fmtTime(train.departAt)} {train.from.city} → {fmtTime(train.arriveAt)} {train.to.city} · {fmtDuration(train.durationMinutes)}
          </div>
          <div className="text-ink-400 text-sm">{fmtDateRu(date)}</div>
        </div>
      </div>

      {step === 'seats' && (
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-6 grid lg:grid-cols-[300px_1fr] gap-6">
          {/* car list */}
          <aside className="space-y-2 h-max">
            <div className="text-[12px] uppercase tracking-wider font-bold text-ink-400 mb-1">Вагоны</div>
            {cars.map((c) => (
              <CarRow key={c.id} car={c} active={c.id === carId} onClick={() => changeCar(c.id)} />
            ))}
          </aside>

          {/* seat map */}
          <div className="bg-white border border-ink-100 rounded-2xl p-5 md:p-6">
            <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
              <h2 className="font-display font-extrabold text-xl text-ink-900">
                Вагон {car.number} · {CAR_CLASS_META[car.carClass].title}
              </h2>
              <span className="text-[13px] text-ink-500">Выберите {pax} {pax === 1 ? 'место' : 'места'}</span>
            </div>

            <CarSeatMap layout={layout} selected={seats} maxSelect={pax} onToggle={toggle} />

            {/* selection footer */}
            <div className="mt-5 pt-5 border-t border-ink-100 flex items-center justify-between gap-4 flex-wrap">
              <div className="text-sm text-ink-600">
                {seats.length > 0 ? (
                  <>Места <b className="text-ink-900">{seats.join(', ')}</b> · итого <b className="text-ink-900">{total.toLocaleString('ru-RU')} ₽</b></>
                ) : (
                  <span className="text-ink-400">Места не выбраны</span>
                )}
              </div>
              <button
                type="button"
                disabled={seats.length !== pax}
                onClick={goPassengers}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all"
              >
                Продолжить · {seats.length}/{pax}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'passengers' && (
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-6">
          <button type="button" onClick={() => setStep('seats')} className="inline-flex items-center gap-1.5 text-ink-500 hover:text-brand-600 text-sm font-semibold mb-4">
            <ArrowLeft className="w-4 h-4" /> Назад к выбору мест
          </button>

          {done ? (
            <div className="bg-white border border-mint-500/40 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-mint-500/15 text-mint-500 grid place-items-center mx-auto mb-4">
                <Check className="w-7 h-7" />
              </div>
              <h2 className="font-display font-extrabold text-2xl text-ink-900 mb-2">Бронь создана (демо)</h2>
              <p className="text-ink-500 max-w-md mx-auto">
                Места {seats.join(', ')} зарезервированы. Онлайн-оплата и выпуск электронного билета появятся после подключения эквайринга (54-ФЗ) и боевого API УФС/ИМ.
              </p>
              <Link to="/trains" className="inline-block mt-6 text-brand-600 font-bold">← Новый поиск</Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
              <div className="space-y-4">
                {passengers.map((p, i) => (
                  <PassengerCard key={p.seatNumber} index={i} passenger={p} onChange={(np) => setPassengers((prev) => prev.map((x, j) => (j === i ? np : x)))} />
                ))}

                <label className="flex items-start gap-3 bg-white border border-ink-100 rounded-2xl p-4 cursor-pointer">
                  <input type="checkbox" checked={eReg} onChange={(e) => setEReg(e.target.checked)} className="mt-1 accent-[var(--color-brand-600)]" />
                  <span>
                    <span className="font-semibold text-ink-900 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-mint-500" /> Электронная регистрация</span>
                    <span className="block text-[13px] text-ink-500">Посадка по документу без распечатки билета. Бесплатно.</span>
                  </span>
                </label>
              </div>

              {/* order summary */}
              <aside className="bg-white border border-ink-100 rounded-2xl p-5 lg:sticky lg:top-4 h-max">
                <div className="font-display font-extrabold text-ink-900 mb-3">Ваш заказ</div>
                <div className="text-sm text-ink-600 space-y-1.5 mb-4">
                  <Row k="Поезд" v={train.number} />
                  <Row k="Вагон" v={`${car.number} · ${CAR_CLASS_META[car.carClass].short}`} />
                  <Row k="Места" v={seats.join(', ')} />
                  <Row k="Пассажиров" v={String(pax)} />
                </div>
                <div className="flex items-baseline justify-between border-t border-ink-100 pt-3 mb-4">
                  <span className="text-ink-500 text-sm">Итого</span>
                  <span className="font-display font-extrabold text-2xl text-ink-900">{total.toLocaleString('ru-RU')} ₽</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDone(true)}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-bold hover:-translate-y-0.5 transition-all shadow-md"
                >
                  <CreditCard className="w-4 h-4" /> Оплатить
                </button>
                <p className="text-[11.5px] text-ink-400 mt-3 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /> Демо-режим: оплата и выпуск билета подключаются после договора с дистрибьютором ЖД и эквайринга.
                </p>
              </aside>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CarRow({ car, active, onClick }: { car: CarOption; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-3.5 transition-colors ${
        active ? 'border-brand-400 bg-brand-50/50 ring-1 ring-brand-200' : 'border-ink-100 bg-white hover:border-brand-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-display font-extrabold text-ink-900">Вагон {car.number}</span>
        <span className="text-[12px] text-ink-500">{CAR_CLASS_META[car.carClass].short}</span>
      </div>
      <div className="text-[12.5px] text-ink-500 mt-1">
        от {car.priceFrom.toLocaleString('ru-RU')} ₽ · <span className="text-mint-500 font-semibold">{car.freeSeats} мест</span>
      </div>
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-ink-400">{k}</span>
      <span className="text-ink-900 font-medium text-right">{v}</span>
    </div>
  );
}

function PassengerCard({ index, passenger, onChange }: { index: number; passenger: RailPassenger; onChange: (p: RailPassenger) => void }) {
  const set = <K extends keyof RailPassenger>(key: K, val: RailPassenger[K]) => onChange({ ...passenger, [key]: val });
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-5">
      <div className="font-display font-extrabold text-ink-900 mb-3">
        Пассажир {index + 1} <span className="text-ink-400 font-semibold text-sm">· место {passenger.seatNumber}</span>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <Inp ph="Фамилия" value={passenger.lastName} onChange={(v) => set('lastName', v)} />
        <Inp ph="Имя" value={passenger.firstName} onChange={(v) => set('firstName', v)} />
        <Inp ph="Отчество" value={passenger.middleName} onChange={(v) => set('middleName', v)} />
        <Inp ph="Дата рождения" type="date" value={passenger.birthDate} onChange={(v) => set('birthDate', v)} />
        <Sel value={passenger.gender} onChange={(v) => set('gender', v as RailPassenger['gender'])} options={[['M', 'Мужской'], ['F', 'Женский']]} />
        <Sel value={passenger.tariff} onChange={(v) => set('tariff', v as RailPassenger['tariff'])} options={[['full', 'Полный'], ['child', 'Детский'], ['privilege', 'Льготный']]} />
        <Sel value={passenger.docType} onChange={(v) => set('docType', v as RailPassenger['docType'])} options={[['passport_rf', 'Паспорт РФ'], ['birth_cert', 'Свид. о рождении'], ['foreign_passport', 'Загранпаспорт']]} />
        <Inp ph="Номер документа" value={passenger.docNumber} onChange={(v) => set('docNumber', v)} />
      </div>
    </div>
  );
}

function Inp({ ph, value, onChange, type = 'text' }: { ph: string; value: string; onChange: (v: string) => void; type?: string }) {
  return <input type={type} placeholder={ph} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-ink-100 text-sm focus:outline-none focus:border-brand-500 focus:shadow-[var(--shadow-glow)]" />;
}

function Sel({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: Array<[string, string]> }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-ink-100 text-sm bg-white focus:outline-none focus:border-brand-500 focus:shadow-[var(--shadow-glow)]">
      {options.map(([v, label]) => (
        <option key={v} value={v}>{label}</option>
      ))}
    </select>
  );
}
