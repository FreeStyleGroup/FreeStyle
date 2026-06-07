/**
 * Реестр раскладок вагонов РЖД → нормализованные позиции мест для SVG-рендера.
 *
 * Декларативные генераторы строят геометрию вагона (купе/боковые/ряды),
 * нумерацию, ярусы и атрибуты мест. Доступность/цена/пол купе наполняются
 * дальше (мок или боевой адаптер). Цены — относительная модель (верх дешевле
 * низа, боковые/у туалета дешевле), пока нет реального тарификатора.
 */
import type {
  CarClass,
  CarLayout,
  CarFloorLayout,
  RailSeat,
  CarMark,
  SeatTier,
  SeatKind,
  SeatAttrs,
} from './types';

export interface CarClassMeta {
  title: string;
  short: string;
  classCode: string;
  /** Продаётся только целым купе (люкс). */
  wholeCompartment?: boolean;
  /** Есть выбор пола купе (купе/СВ/люкс). */
  genderCompartments?: boolean;
  twoFloors?: boolean;
}

export const CAR_CLASS_META: Record<CarClass, CarClassMeta> = {
  platzkart: { title: 'Плацкартный', short: 'Плацкарт', classCode: '2Э' },
  kupe: { title: 'Купе', short: 'Купе', classCode: '2К', genderCompartments: true },
  sv: { title: 'СВ (спальный)', short: 'СВ', classCode: '1Б', genderCompartments: true },
  lux: { title: 'Люкс / Мягкий', short: 'Люкс', classCode: '1Л', genderCompartments: true, wholeCompartment: true },
  seated: { title: 'Сидячий', short: 'Сидячий', classCode: '2С' },
  lastochka: { title: 'Ласточка', short: 'Ласточка', classCode: '2В' },
  sapsan: { title: 'Сапсан', short: 'Сапсан', classCode: '2С' },
};

const BASE_PRICE: Record<CarClass, number> = {
  platzkart: 2600,
  kupe: 4200,
  sv: 8200,
  lux: 14500,
  seated: 1900,
  lastochka: 1400,
  sapsan: 4800,
};

function priceFor(carClass: CarClass, tier: SeatTier, kind: SeatKind, attrs: SeatAttrs): number {
  let p = BASE_PRICE[carClass];
  if (tier === 'upper') p *= 0.8;
  if (kind === 'side') p *= 0.88;
  if (attrs.nearToilet) p *= 0.82;
  if (attrs.table) p *= 1.04;
  // округление до 10 ₽
  return Math.round(p / 10) * 10;
}

function makeSeat(
  carClass: CarClass,
  number: number,
  tier: SeatTier,
  kind: SeatKind,
  col: number,
  row: number,
  floor: 1 | 2,
  attrs: SeatAttrs,
  compartment?: number,
): RailSeat {
  return {
    number,
    tier,
    kind,
    price: priceFor(carClass, tier, kind, attrs),
    available: true,
    floor,
    compartment,
    gender: compartment !== undefined && CAR_CLASS_META[carClass].genderCompartments ? 'empty' : undefined,
    attrs,
    col,
    row,
  };
}

/* ────────────────────────── купейный блок ────────────────────────── */
/** Блок купе: compCount купе, в каждом 2 колонки берт; tiers — ['lower','upper'] (купе) или ['lower'] (СВ). */
function genCoupeBlock(
  carClass: CarClass,
  opts: {
    compCount: number;
    tiers: SeatTier[];
    numberStart: number;
    compStart: number;
    rowBase: number;
    floor: 1 | 2;
  },
): RailSeat[] {
  const { compCount, tiers, numberStart, compStart, rowBase, floor } = opts;
  const hasUpper = tiers.includes('upper');
  const seats: RailSeat[] = [];
  let n = numberStart;
  for (let c = 0; c < compCount; c++) {
    for (let col = 0; col < 2; col++) {
      for (const tier of tiers) {
        const row = hasUpper ? (tier === 'upper' ? rowBase : rowBase + 1) : rowBase;
        const attrs: SeatAttrs = { table: tier === 'lower' };
        seats.push(makeSeat(carClass, n, tier, 'coupe', c * 2 + col, row, floor, attrs, compStart + c));
        n += 1;
      }
    }
  }
  return seats;
}

/* ────────────────────────── плацкарт ────────────────────────── */
function genPlatzkart(floor: 1 | 2, numberOffset: number): CarFloorLayout {
  // Основные купе: 9 × 4 (места 1–36), боковые: 9 × 2 (37–54)
  const main = genCoupeBlock('platzkart', {
    compCount: 9,
    tiers: ['lower', 'upper'],
    numberStart: numberOffset + 1,
    compStart: 1,
    rowBase: 0,
    floor,
  });
  // боковые: секция k → нижнее 37+2k (row 4), верхнее 38+2k (row 5)
  const side: RailSeat[] = [];
  for (let k = 0; k < 9; k++) {
    const lowerNum = numberOffset + 37 + 2 * k;
    const upperNum = numberOffset + 38 + 2 * k;
    const nearToilet = k === 0; // 37/38 у туалета
    side.push(makeSeat('platzkart', lowerNum, 'lower', 'side', k * 2, 4, floor, { table: true, nearToilet }));
    side.push(makeSeat('platzkart', upperNum, 'upper', 'side', k * 2, 5, floor, { nearToilet }));
  }
  // розетки в части купе (для реализма)
  for (const s of main) {
    if (s.compartment === 2 || s.compartment === 8) s.attrs.power = true;
  }
  const marks: CarMark[] = [
    { kind: 'conductor', col: 17, row: 0, w: 1, h: 2 },
    { kind: 'toilet', col: 17, row: 4, w: 1, h: 2 },
    { kind: 'toilet', col: -1, row: 0, w: 1, h: 2 },
  ];
  return { floor, cols: 18, rows: 6, seats: [...main, ...side], marks };
}

/* ────────────────────────── купе / СВ / люкс ────────────────────────── */
function genKupe(floor: 1 | 2, numberOffset: number): CarFloorLayout {
  const seats = genCoupeBlock('kupe', {
    compCount: 9,
    tiers: ['lower', 'upper'],
    numberStart: numberOffset + 1,
    compStart: 1,
    rowBase: 0,
    floor,
  });
  const marks: CarMark[] = [
    { kind: 'conductor', col: 18, row: 0, w: 1, h: 2 },
    { kind: 'toilet', col: -1, row: 0, w: 1, h: 2 },
  ];
  return { floor, cols: 18, rows: 2, seats, marks };
}

function genSv(floor: 1 | 2, numberOffset: number, carClass: CarClass = 'sv', compCount = 9): CarFloorLayout {
  const seats = genCoupeBlock(carClass, {
    compCount,
    tiers: ['lower'],
    numberStart: numberOffset + 1,
    compStart: 1,
    rowBase: 0,
    floor,
  });
  for (const s of seats) s.attrs.power = true;
  const marks: CarMark[] = [{ kind: 'toilet', col: -1, row: 0, w: 1, h: 1 }];
  return { floor, cols: compCount * 2, rows: 1, seats, marks };
}

/* ────────────────────────── сидячие (сидячий / Ласточка / Сапсан) ────────────────────────── */
function genSeated(
  carClass: CarClass,
  opts: {
    rows: number;
    left: number; // мест слева от прохода
    right: number; // мест справа от прохода
    numberStart: number;
    floor: 1 | 2;
    tables?: boolean; // зоны со столиком (пары лицом к лицу)
    orientation?: boolean; // отмечать по/против хода
  },
): CarFloorLayout {
  const { rows, left, right, numberStart, floor, tables, orientation } = opts;
  const aisleCol = left; // колонка-проход
  const cols = left + 1 + right;
  const seats: RailSeat[] = [];
  let n = numberStart;
  for (let r = 0; r < rows; r++) {
    const perRow = left + right;
    for (let i = 0; i < perRow; i++) {
      const isLeft = i < left;
      const colInSide = isLeft ? i : i - left;
      const sideCount = isLeft ? left : right;
      const col = isLeft ? colInSide : aisleCol + 1 + colInSide;
      const isWindow = isLeft ? colInSide === 0 : colInSide === sideCount - 1;
      const isAisle = isLeft ? colInSide === sideCount - 1 : colInSide === 0;
      const attrs: SeatAttrs = {
        window: isWindow,
        aisle: isAisle,
        power: carClass !== 'seated',
        table: tables ? r % 2 === 1 : false,
        forward: orientation ? r % 2 === 0 : undefined,
        backward: orientation ? r % 2 === 1 : undefined,
      };
      seats.push(makeSeat(carClass, n, 'seat', 'seat', col, r, floor, attrs));
      n += 1;
    }
  }
  const marks: CarMark[] = [
    { kind: 'toilet', col: 0, row: -1, w: 1, h: 1 },
    { kind: 'luggage', col: cols - 1, row: -1, w: 1, h: 1 },
  ];
  return { floor, cols, rows, seats, marks };
}

/* ────────────────────────── сборка вагона ────────────────────────── */
export interface BuildCarOptions {
  /** Двухэтажный вагон: добавить 2-й этаж (нумерация со смещением +80). */
  twoFloors?: boolean;
}

function buildFloor(carClass: CarClass, floor: 1 | 2, numberOffset: number): CarFloorLayout {
  switch (carClass) {
    case 'platzkart':
      return genPlatzkart(floor, numberOffset);
    case 'kupe':
      return genKupe(floor, numberOffset);
    case 'sv':
      return genSv(floor, numberOffset, 'sv', 9);
    case 'lux':
      return genSv(floor, numberOffset, 'lux', 4);
    case 'seated':
      return genSeated('seated', { rows: 11, left: 2, right: 3, numberStart: numberOffset + 1, floor });
    case 'lastochka':
      return genSeated('lastochka', { rows: 12, left: 2, right: 3, numberStart: numberOffset + 1, floor, tables: true });
    case 'sapsan':
      return genSeated('sapsan', { rows: 11, left: 2, right: 2, numberStart: numberOffset + 1, floor, tables: true, orientation: true });
    default:
      return genKupe(floor, numberOffset);
  }
}

/** Построить раскладку вагона. */
export function buildCarLayout(carClass: CarClass, options: BuildCarOptions = {}): CarLayout {
  const floors: CarFloorLayout[] = [buildFloor(carClass, 1, 0)];
  if (options.twoFloors) {
    floors.push(buildFloor(carClass, 2, 80)); // 2-й этаж: смещение нумерации +80
  }
  return {
    carClass,
    title: CAR_CLASS_META[carClass].title,
    floors,
  };
}
