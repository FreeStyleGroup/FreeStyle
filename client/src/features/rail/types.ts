/**
 * Rail domain types (раздел ЖД — пилот под УФС/ИМ).
 *
 * Это нормализованная внутренняя модель: бэкенд-адаптер дистрибьютора
 * (УФС / «Инновационная мобильность») мапит свой ответ в эти типы,
 * а UI не зависит от конкретного провайдера. Пока бэкенда нет — кормим
 * раздел мок-данными (`mock.ts`) на тест-контуре.
 *
 * Когда появится боевой API — типы переедут в `shared/src/types/rail.ts`.
 */

/** Категория поезда. */
export type TrainCategory = 'regular' | 'branded' | 'highspeed' | 'suburban';

/** Класс/тип вагона. */
export type CarClass =
  | 'platzkart' // плацкартный
  | 'kupe' // купе
  | 'sv' // СВ (спальный)
  | 'lux' // люкс / мягкий
  | 'seated' // сидячий
  | 'lastochka' // Ласточка (сидячий скоростной)
  | 'sapsan'; // Сапсан (сидячий ВСМ)

/** Ярус места. */
export type SeatTier = 'lower' | 'upper' | 'seat';

/** Конструктив места. */
export type SeatKind = 'coupe' | 'side' | 'seat';

/** Пол купе (для купе/СВ/люкс). */
export type CompartmentGender = 'M' | 'F' | 'mixed' | 'empty';

/** Атрибуты места — для иконок и фильтров. */
export interface SeatAttrs {
  window?: boolean; // у окна
  aisle?: boolean; // у прохода
  table?: boolean; // у столика
  power?: boolean; // розетка
  forward?: boolean; // по ходу движения
  backward?: boolean; // против хода
  pet?: boolean; // с животными
  accessible?: boolean; // для маломобильных
  child?: boolean; // детское/с детьми
  nearToilet?: boolean; // у туалета
}

/** Место в вагоне (нормализованное). */
export interface RailSeat {
  number: number; // номер места (на 2-м этаже — со смещением, напр. 81+)
  tier: SeatTier;
  kind: SeatKind;
  price: number; // ₽
  available: boolean;
  floor: 1 | 2;
  compartment?: number; // № купе (1-based) — для гендера/«купе целиком»
  gender?: CompartmentGender; // статус купе (kupe/sv/lux)
  attrs: SeatAttrs;
  /** Координаты ячейки в нормализованной сетке (для SVG-рендера). */
  col: number;
  row: number;
}

/** Структурная метка на схеме (туалет, проводник, кипяток). */
export interface CarMark {
  kind: 'toilet' | 'conductor' | 'boiler' | 'wardrobe' | 'luggage' | 'stairs';
  col: number;
  row: number;
  w?: number;
  h?: number;
}

/** Раскладка одного этажа вагона для рендера. */
export interface CarFloorLayout {
  floor: 1 | 2;
  cols: number; // ширина сетки в ячейках
  rows: number; // высота сетки в ячейках
  seats: RailSeat[];
  marks: CarMark[];
}

/** Полная раскладка вагона (1–2 этажа). */
export interface CarLayout {
  carClass: CarClass;
  title: string; // «Плацкартный», «Купе», …
  floors: CarFloorLayout[];
}

/** Вариант вагона в поезде (для списка выбора). */
export interface CarOption {
  id: string;
  number: string; // № вагона, напр. «12»
  carClass: CarClass;
  classCode?: string; // тарифный код (2Э/2К/1С/…)
  carrier: string; // перевозчик (ФПК и т.п.)
  freeSeats: number;
  priceFrom: number;
  priceTo: number;
  hasAirConditioning?: boolean;
  hasBedding?: boolean;
  isBranded?: boolean;
}

/** Станция (справочник Экспресс-3). */
export interface RailStation {
  code: string; // 7-значный код Экспресс-3
  name: string;
  city: string;
  region?: string;
}

/** Поезд в результатах поиска. */
export interface TrainResult {
  id: string;
  number: string; // «119А»
  category: TrainCategory;
  brandName?: string; // «Сапсан», «Премиум», …
  carrier: string;
  from: RailStation;
  to: RailStation;
  departAt: string; // ISO
  arriveAt: string; // ISO
  durationMinutes: number;
  classes: Array<{ carClass: CarClass; priceFrom: number; freeSeats: number }>;
}

/** Параметры поиска. */
export interface TrainSearchParams {
  fromCode: string;
  toCode: string;
  date: string; // YYYY-MM-DD
  passengers: number;
}

/** Пассажир заказа. */
export interface RailPassenger {
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  gender: 'M' | 'F';
  docType: 'passport_rf' | 'birth_cert' | 'foreign_passport';
  docNumber: string;
  tariff: 'full' | 'child' | 'privilege';
  seatNumber?: number;
}

/** Состояние выбора места в UI. */
export type SeatState = 'free' | 'occupied' | 'selected' | 'disabled';
