import { useMemo, useState } from 'react';
import type { CarLayout, CarFloorLayout, RailSeat, SeatState } from './types';
import { CAR_CLASS_META } from './carLayouts';

/**
 * CarSeatMap — интерактивная схема вагона (SVG).
 * Рендерит купе/боковые/ряды из нормализованной раскладки, показывает
 * состояние мест (свободно/занято/выбрано/недоступно по полу), тултип
 * с атрибутами и ценой, выбор мест под несколько пассажиров, вкладки этажей.
 */

const CELL = 46; // размер ячейки, px
const INSET = 5; // отступ места внутри ячейки

interface Props {
  layout: CarLayout;
  selected: number[];
  maxSelect: number;
  onToggle: (seat: RailSeat) => void;
  /** Пол для валидации гендерных купе (если задан — несовместимые купе блокируются). */
  genderFilter?: 'M' | 'F';
}

function seatState(seat: RailSeat, selected: number[], genderFilter?: Props['genderFilter']): SeatState {
  if (selected.includes(seat.number)) return 'selected';
  if (!seat.available) return 'occupied';
  if (
    genderFilter &&
    seat.gender &&
    seat.gender !== 'mixed' &&
    seat.gender !== 'empty' &&
    seat.gender !== genderFilter
  ) {
    return 'disabled';
  }
  return 'free';
}

const STATE_FILL: Record<SeatState, string> = {
  free: '#f1f5f9',
  occupied: '#e7eaf3',
  selected: '#c62828',
  disabled: '#fff7ed',
};
const STATE_STROKE: Record<SeatState, string> = {
  free: '#cbd5e1',
  occupied: '#e7eaf3',
  selected: '#c62828',
  disabled: '#fdba74',
};
const STATE_TEXT: Record<SeatState, string> = {
  free: '#1e293b',
  occupied: '#94a3b8',
  selected: '#ffffff',
  disabled: '#c2410c',
};

const TIER_LABEL: Record<RailSeat['tier'], string> = { lower: 'нижнее', upper: 'верхнее', seat: 'сидячее' };

function tierGlyph(seat: RailSeat): string {
  if (seat.kind === 'side') return '⇆';
  if (seat.tier === 'upper') return '▲';
  if (seat.tier === 'lower') return '▼';
  return '';
}

export function CarSeatMap({ layout, selected, maxSelect, onToggle, genderFilter }: Props) {
  const [floorIdx, setFloorIdx] = useState(0);
  const [hover, setHover] = useState<{ seat: RailSeat; x: number; y: number } | null>(null);
  const floor = layout.floors[floorIdx] ?? layout.floors[0];

  const { minCol, width, height, compartments } = useMemo(() => geometry(floor), [floor]);

  return (
    <div className="relative">
      {layout.floors.length > 1 && (
        <div className="inline-flex rounded-xl bg-surface-2 p-1 mb-4">
          {layout.floors.map((f, i) => (
            <button
              key={f.floor}
              type="button"
              onClick={() => setFloorIdx(i)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                i === floorIdx ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              {f.floor}-й этаж
            </button>
          ))}
        </div>
      )}

      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-label={`Схема вагона: ${layout.title}`}
          className="select-none"
          style={{ minWidth: width }}
        >
          {/* корпус вагона */}
          <rect x={2} y={2} width={width - 4} height={height - 4} rx={16} fill="#ffffff" stroke="#e7eaf3" strokeWidth={2} />

          {/* подложки купе */}
          {compartments.map((c) => (
            <rect
              key={`comp-${c.compartment}`}
              x={(c.minCol - minCol) * CELL + 2}
              y={c.minRow * CELL + 2}
              width={(c.maxCol - c.minCol + 1) * CELL - 4}
              height={(c.maxRow - c.minRow + 1) * CELL - 4}
              rx={10}
              fill="#f8fafc"
              stroke="#eef2f7"
            />
          ))}

          {/* места */}
          {floor.seats.map((seat) => {
            const st = seatState(seat, selected, genderFilter);
            const x = (seat.col - minCol) * CELL + INSET;
            const y = seat.row * CELL + INSET;
            const size = CELL - INSET * 2;
            const interactive = st === 'free' || st === 'selected';
            return (
              <g
                key={seat.number}
                transform={`translate(${x},${y})`}
                style={{ cursor: interactive ? 'pointer' : 'not-allowed' }}
                onClick={() => {
                  if (st === 'occupied' || st === 'disabled') return;
                  if (st === 'free' && selected.length >= maxSelect) return;
                  onToggle(seat);
                }}
                onMouseEnter={() => setHover({ seat, x: (seat.col - minCol) * CELL + CELL / 2, y: seat.row * CELL })}
                onMouseLeave={() => setHover(null)}
              >
                <rect width={size} height={size} rx={9} fill={STATE_FILL[st]} stroke={STATE_STROKE[st]} strokeWidth={1.5} />
                <text x={size / 2} y={size / 2 - 2} textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight={700} fill={STATE_TEXT[st]}>
                  {seat.number}
                </text>
                <text x={size / 2} y={size - 7} textAnchor="middle" fontSize={9} fill={STATE_TEXT[st]} opacity={0.8}>
                  {tierGlyph(seat)}
                </text>
                {seat.attrs.power && st !== 'selected' && (
                  <circle cx={size - 6} cy={6} r={2.5} fill="#06d6a0" />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* tooltip */}
      {hover && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg bg-ink-900 text-white text-[12px] px-3 py-2 shadow-lg whitespace-nowrap"
          style={{ left: hover.x, top: hover.y + (layout.floors.length > 1 ? 52 : 8) }}
        >
          <div className="font-bold">
            Место {hover.seat.number} · {hover.seat.price.toLocaleString('ru-RU')} ₽
          </div>
          <div className="text-white/75">
            {TIER_LABEL[hover.seat.tier]}
            {hover.seat.kind === 'side' ? ' боковое' : ''}
            {hover.seat.attrs.window ? ' · у окна' : ''}
            {hover.seat.attrs.table ? ' · у столика' : ''}
            {hover.seat.attrs.power ? ' · розетка' : ''}
            {hover.seat.attrs.nearToilet ? ' · у туалета' : ''}
            {hover.seat.gender && hover.seat.gender !== 'empty'
              ? ` · купе ${hover.seat.gender === 'M' ? 'мужское' : hover.seat.gender === 'F' ? 'женское' : 'смешанное'}`
              : ''}
          </div>
        </div>
      )}

      <SeatLegend genderCompartments={CAR_CLASS_META[layout.carClass].genderCompartments} />
    </div>
  );
}

function SeatLegend({ genderCompartments }: { genderCompartments?: boolean }) {
  const items: Array<{ fill: string; stroke: string; label: string }> = [
    { fill: '#f1f5f9', stroke: '#cbd5e1', label: 'Свободно' },
    { fill: '#c62828', stroke: '#c62828', label: 'Выбрано' },
    { fill: '#e7eaf3', stroke: '#e7eaf3', label: 'Занято' },
  ];
  if (genderCompartments) items.push({ fill: '#fff7ed', stroke: '#fdba74', label: 'Купе другого пола' });
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-[12.5px] text-ink-500">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-[5px]" style={{ background: it.fill, border: `1.5px solid ${it.stroke}` }} />
          {it.label}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5">▼ нижнее · ▲ верхнее · ⇆ боковое</span>
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-mint-500" /> розетка
      </span>
    </div>
  );
}

/** Геометрия этажа: смещение, размеры, группы купе. */
function geometry(floor: CarFloorLayout) {
  let minCol = 0;
  let maxCol = floor.cols - 1;
  for (const s of floor.seats) {
    if (s.col < minCol) minCol = s.col;
    if (s.col > maxCol) maxCol = s.col;
  }
  const width = (maxCol - minCol + 1) * CELL + 4;
  const height = floor.rows * CELL + 4;

  const byComp = new Map<number, { compartment: number; minCol: number; maxCol: number; minRow: number; maxRow: number }>();
  for (const s of floor.seats) {
    if (s.compartment === undefined) continue;
    const g = byComp.get(s.compartment);
    if (!g) {
      byComp.set(s.compartment, { compartment: s.compartment, minCol: s.col, maxCol: s.col, minRow: s.row, maxRow: s.row });
    } else {
      g.minCol = Math.min(g.minCol, s.col);
      g.maxCol = Math.max(g.maxCol, s.col);
      g.minRow = Math.min(g.minRow, s.row);
      g.maxRow = Math.max(g.maxRow, s.row);
    }
  }
  return { minCol, maxCol, width, height, compartments: [...byComp.values()] };
}
