import { useState } from 'react';
import { Train } from 'lucide-react';
import { CarSeatMap } from '@/features/rail/CarSeatMap';
import { buildMockCar } from '@/features/rail/mock';
import { CAR_CLASS_META } from '@/features/rail/carLayouts';
import type { CarClass, RailSeat } from '@/features/rail/types';

/**
 * RailDemoPage (/trains/demo) — витрина всех типов вагонов и рендера схем мест.
 * Нужна для демонстрации/аудита дистрибьютора и визуальной проверки раскладок.
 */
const DEMO: Array<{ carClass: CarClass; twoFloors?: boolean; note: string }> = [
  { carClass: 'platzkart', note: '54 места · 9 купе + боковые' },
  { carClass: 'kupe', note: '36 мест · 9 купе · выбор пола' },
  { carClass: 'kupe', twoFloors: true, note: 'двухэтажный купе · нумерация 2-го этажа со смещением' },
  { carClass: 'sv', note: '18 мест · по 2 нижних' },
  { carClass: 'lux', note: 'люкс · продаётся целым купе' },
  { carClass: 'seated', note: 'сидячий 2+3' },
  { carClass: 'lastochka', note: 'Ласточка · зоны со столиком' },
  { carClass: 'sapsan', note: 'Сапсан 2+2 · по/против хода' },
];

export function RailDemoPage() {
  return (
    <div className="min-h-screen max-w-[1320px] mx-auto px-4 md:px-8 py-10">
      <div className="inline-flex items-center gap-2 text-brand-600 font-bold text-sm mb-2">
        <Train className="w-4 h-4" /> Схемы вагонов
      </div>
      <h1 className="font-display font-extrabold text-3xl md:text-4xl text-ink-900 mb-2">Типы вагонов и выбор мест</h1>
      <p className="text-ink-500 mb-8 max-w-2xl">
        Интерактивные схемы всех типов вагонов РЖД. Наведите на место — увидите ярус, атрибуты и цену; кликните, чтобы выбрать.
      </p>
      <div className="space-y-6">
        {DEMO.map((d, i) => (
          <DemoCar key={`${d.carClass}-${i}`} carClass={d.carClass} twoFloors={d.twoFloors} note={d.note} />
        ))}
      </div>
    </div>
  );
}

function DemoCar({ carClass, twoFloors, note }: { carClass: CarClass; twoFloors?: boolean; note: string }) {
  const [selected, setSelected] = useState<number[]>([]);
  const layout = buildMockCar(carClass, `demo-${carClass}-${twoFloors ? 2 : 1}`, twoFloors);
  const meta = CAR_CLASS_META[carClass];

  const toggle = (seat: RailSeat) =>
    setSelected((prev) => (prev.includes(seat.number) ? prev.filter((n) => n !== seat.number) : [...prev, seat.number]));

  return (
    <section className="bg-white border border-ink-100 rounded-2xl p-5 md:p-6">
      <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
        <h2 className="font-display font-extrabold text-xl text-ink-900">
          {meta.title} <span className="text-ink-400 font-semibold text-sm">· {meta.classCode}</span>
        </h2>
        <span className="text-[13px] text-ink-500">{note}</span>
      </div>
      <CarSeatMap layout={layout} selected={selected} maxSelect={4} onToggle={toggle} />
    </section>
  );
}
