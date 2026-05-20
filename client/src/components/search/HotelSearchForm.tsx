import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { AirportField } from './fields/AirportField';
import { DateField } from './fields/DateField';
import { PassengersField, type Passengers } from './fields/PassengersField';
import type { AutocompleteItem } from '@freestyle/shared';

/**
 * HotelSearchForm — поиск отелей в том же стиле что FlightSearchForm.
 * Структура: Город / Заезд / Выезд / Гости / Найти.
 */
export function HotelSearchForm() {
  const navigate = useNavigate();
  const [city, setCity] = useState<AutocompleteItem | null>(null);
  const [dates, setDates] = useState<DateRange | undefined>();
  const [pax, setPax] = useState<Passengers>({
    adults: 2, children: 0, infants: 0, cabin: 'economy',
  });

  const handleSearch = () => {
    if (!city) return;
    const params = new URLSearchParams({
      city: city.name,
      adults: String(pax.adults),
      children: String(pax.children),
    });
    if (dates?.from) params.set('checkIn',  format(dates.from, 'yyyy-MM-dd'));
    if (dates?.to)   params.set('checkOut', format(dates.to,   'yyyy-MM-dd'));
    navigate(`/hotels?${params.toString()}`);
  };

  const canSearch = !!city;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
      <AirportField
        label="Город или отель"
        value={city}
        onChange={setCity}
        className="md:col-span-4"
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
        className="md:col-span-4"
      />

      <button
        type="button"
        onClick={handleSearch}
        disabled={!canSearch}
        className="md:col-span-12 mt-1 flex items-center justify-center gap-2 py-4 min-h-[58px] rounded-2xl text-[15px] font-bold text-white bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 hover:from-brand-600 hover:to-brand-800 shadow-[0_8px_24px_rgba(198,40,40,0.32),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_16px_36px_rgba(198,40,40,0.4),inset_0_1px_0_rgba(255,255,255,0.18)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:bg-ink-300 disabled:from-ink-300 disabled:to-ink-300 disabled:shadow-none"
      >
        <Search className="w-5 h-5" />
        Найти отель
      </button>
    </div>
  );
}
