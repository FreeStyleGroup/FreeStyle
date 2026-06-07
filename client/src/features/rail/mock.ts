/**
 * Мок-данные раздела ЖД для тест-контура (до боевого API УФС/ИМ).
 * Детерминированы (сид по номеру места/вагона) — стабильный рендер без Math.random.
 */
import { buildCarLayout, CAR_CLASS_META } from './carLayouts';
import type {
  CarClass,
  CarLayout,
  CarOption,
  CompartmentGender,
  RailStation,
  TrainResult,
  TrainSearchParams,
} from './types';

export const RAIL_STATIONS: RailStation[] = [
  { code: '2006004', name: 'Москва (Ленинградский вокзал)', city: 'Москва' },
  { code: '2000000', name: 'Москва (все вокзалы)', city: 'Москва' },
  { code: '2004001', name: 'Санкт-Петербург (Московский вокзал)', city: 'Санкт-Петербург' },
  { code: '2060001', name: 'Казань', city: 'Казань' },
  { code: '2064001', name: 'Нижний Новгород', city: 'Нижний Новгород' },
  { code: '2064500', name: 'Сочи', city: 'Сочи' },
  { code: '2004600', name: 'Минск-Пассажирский', city: 'Минск' },
];

export function findStation(code: string): RailStation | undefined {
  return RAIL_STATIONS.find((s) => s.code === code);
}

/** Простой детерминированный хеш строки → [0,1). */
function seedRand(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

function addMinutes(iso: string, min: number): string {
  return new Date(new Date(iso).getTime() + min * 60000).toISOString();
}

/** Поиск поездов (мок): подставляем выбранные станции и дату. */
export function searchTrains(params: TrainSearchParams): TrainResult[] {
  const from = findStation(params.fromCode) ?? RAIL_STATIONS[0];
  const to = findStation(params.toCode) ?? RAIL_STATIONS[2];
  const day = params.date || new Date().toISOString().slice(0, 10);

  const templates: Array<{
    number: string;
    category: TrainResult['category'];
    brandName?: string;
    depart: string;
    dur: number;
    classes: Array<{ carClass: CarClass; priceFrom: number; freeSeats: number }>;
  }> = [
    {
      number: '758А', category: 'highspeed', brandName: 'Сапсан', depart: '06:40', dur: 230,
      classes: [
        { carClass: 'sapsan', priceFrom: 4800, freeSeats: 142 },
      ],
    },
    {
      number: '028С', category: 'branded', brandName: 'Премиум', depart: '13:00', dur: 545,
      classes: [
        { carClass: 'platzkart', priceFrom: 2600, freeSeats: 88 },
        { carClass: 'kupe', priceFrom: 4200, freeSeats: 54 },
        { carClass: 'sv', priceFrom: 8200, freeSeats: 12 },
        { carClass: 'lux', priceFrom: 14500, freeSeats: 4 },
      ],
    },
    {
      number: '742Ч', category: 'highspeed', brandName: 'Ласточка', depart: '17:25', dur: 215,
      classes: [
        { carClass: 'lastochka', priceFrom: 1400, freeSeats: 210 },
        { carClass: 'seated', priceFrom: 1900, freeSeats: 96 },
      ],
    },
    {
      number: '120В', category: 'regular', depart: '21:50', dur: 565,
      classes: [
        { carClass: 'platzkart', priceFrom: 2400, freeSeats: 120 },
        { carClass: 'kupe', priceFrom: 3900, freeSeats: 60 },
      ],
    },
  ];

  return templates.map((t, i) => {
    const departAt = `${day}T${t.depart}:00`;
    return {
      id: `${t.number}-${day}-${i}`,
      number: t.number,
      category: t.category,
      brandName: t.brandName,
      carrier: 'АО «ФПК»',
      from,
      to,
      departAt,
      arriveAt: addMinutes(departAt, t.dur),
      durationMinutes: t.dur,
      classes: t.classes,
    };
  });
}

/** Варианты вагонов для поезда (мок). */
export function carOptionsForTrain(train: TrainResult): CarOption[] {
  const out: CarOption[] = [];
  let carNo = 1;
  for (const cls of train.classes) {
    const meta = CAR_CLASS_META[cls.carClass];
    // 1–2 вагона на класс
    const count = cls.carClass === 'platzkart' || cls.carClass === 'lastochka' ? 2 : 1;
    for (let j = 0; j < count; j += 1) {
      const id = `${train.id}__${cls.carClass}__${carNo}`;
      const free = Math.max(3, Math.round(cls.freeSeats / count - seedRand(id) * 10));
      out.push({
        id,
        number: String(carNo + 9),
        carClass: cls.carClass,
        classCode: meta.classCode,
        carrier: train.carrier,
        freeSeats: free,
        priceFrom: cls.priceFrom,
        priceTo: Math.round(cls.priceFrom * 1.6),
        hasAirConditioning: true,
        hasBedding: cls.carClass !== 'seated' && cls.carClass !== 'lastochka' && cls.carClass !== 'sapsan',
        isBranded: train.category === 'branded' || train.category === 'highspeed',
      });
      carNo += 1;
    }
  }
  return out;
}

const GENDERS: CompartmentGender[] = ['M', 'F', 'mixed', 'empty', 'empty'];

/**
 * Раскладка вагона с применённой доступностью/полом/реалистичной занятостью.
 * @param carId стабильный сид (id вагона)
 */
export function buildMockCar(carClass: CarClass, carId: string, twoFloors = false): CarLayout {
  const layout = buildCarLayout(carClass, { twoFloors });
  const meta = CAR_CLASS_META[carClass];
  // пол купе — по сид-хешу
  const compGender = new Map<number, CompartmentGender>();
  for (const floor of layout.floors) {
    for (const seat of floor.seats) {
      // занятость ~28%
      const occ = seedRand(`${carId}:${seat.number}`) < 0.28;
      seat.available = !occ;
      if (meta.genderCompartments && seat.compartment !== undefined) {
        let g = compGender.get(seat.compartment);
        if (!g) {
          g = GENDERS[Math.floor(seedRand(`${carId}:comp:${seat.compartment}`) * GENDERS.length)];
          compGender.set(seat.compartment, g);
        }
        seat.gender = g;
      }
    }
  }
  return layout;
}
