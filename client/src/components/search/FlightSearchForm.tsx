import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Search } from 'lucide-react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { AirportField } from './fields/AirportField';
import { DateField } from './fields/DateField';
import { PassengersField, type Passengers } from './fields/PassengersField';
import type { AutocompleteItem } from '@freestyle/shared';

/**
 * FlightSearchForm — поиск авиабилетов в стиле China travel-v2.
 * Структура: Откуда (swap) Куда / Туда / Обратно / Пассажиры / Найти.
 * Каждое поле — карточка с лейблом/значением/подписью, клик раскрывает popup.
 */
export function FlightSearchForm() {
  const navigate = useNavigate();

  const [origin, setOrigin] = useState<AutocompleteItem | null>(null);
  const [destination, setDestination] = useState<AutocompleteItem | null>(null);
  const [dates, setDates] = useState<DateRange | undefined>();
  const [pax, setPax] = useState<Passengers>({
    adults: 1, children: 0, infants: 0, cabin: 'economy',
  });

  const swapCities = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOrigin(destination);
    setDestination(origin);
  };

  const handleSearch = () => {
    if (!origin || !destination) return;
    const params = new URLSearchParams({
      origin: origin.code,
      destination: destination.code,
      adults: String(pax.adults),
      children: String(pax.children),
      infants: String(pax.infants),
      cabin: pax.cabin,
    });
    if (dates?.from) params.set('departureAt', format(dates.from, 'yyyy-MM-dd'));
    if (dates?.to)   params.set('returnAt',     format(dates.to,   'yyyy-MM-dd'));
    navigate(`/flights/results?${params.toString()}`);
  };

  const canSearch = origin && destination;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
      <AirportField
        label="Откуда"
        value={origin}
        onChange={setOrigin}
        className="md:col-span-3"
        rightSlot={
          /*
           * Центрируем по середине gap'а между Откуда и Куда:
           * gap-2.5 = 10px, ширина кнопки w-9 = 36px.
           * right = -(gap/2 + width/2) = -(5 + 18) = -23px → центр кнопки точно на середине gap'а
           */
          <button
            type="button"
            onClick={swapCities}
            className="hidden md:grid absolute -right-[23px] top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white border border-ink-200 place-items-center text-ink-700 shadow-md hover:bg-brand-600 hover:border-brand-600 hover:text-white hover:rotate-180 transition-all duration-300 cursor-pointer"
            aria-label="Поменять местами"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        }
      />

      <AirportField
        label="Куда"
        value={destination}
        onChange={setDestination}
        className="md:col-span-3"
      />

      <DateField
        range={dates}
        onChange={setDates}
        fromClassName="md:col-span-2"
        toClassName="md:col-span-2"
      />

      <PassengersField
        value={pax}
        onChange={setPax}
        className="md:col-span-2"
      />

      <button
        type="button"
        onClick={handleSearch}
        disabled={!canSearch}
        className="md:col-span-12 lg:col-span-12 mt-1 flex items-center justify-center gap-2 py-4 min-h-[58px] rounded-2xl text-[15px] font-bold text-white bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 hover:from-brand-600 hover:to-brand-800 shadow-[0_8px_24px_rgba(198,40,40,0.32),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_16px_36px_rgba(198,40,40,0.4),inset_0_1px_0_rgba(255,255,255,0.18)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:bg-ink-300 disabled:from-ink-300 disabled:to-ink-300 disabled:shadow-none"
      >
        <Search className="w-5 h-5" />
        Найти билеты
      </button>
    </div>
  );
}
