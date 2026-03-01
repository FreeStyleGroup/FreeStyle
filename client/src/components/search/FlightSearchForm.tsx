import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AirportAutocomplete } from './AirportAutocomplete';
import { PassengerSelector } from './PassengerSelector';
import { Button } from '@/components/ui/Button';
import type { AutocompleteItem } from '@freestyle/shared';

interface FlightSearchFormProps {
  compact?: boolean;
}

export function FlightSearchForm({ compact }: FlightSearchFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [origin, setOrigin] = useState<AutocompleteItem | null>(null);
  const [destination, setDestination] = useState<AutocompleteItem | null>(null);
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });

  const handleSearch = () => {
    if (!origin || !destination) return;

    const params = new URLSearchParams({
      origin: origin.code,
      destination: destination.code,
    });
    if (departDate) params.set('departureAt', departDate);
    if (returnDate) params.set('returnAt', returnDate);
    params.set('adults', String(passengers.adults));

    navigate(`/flights/results?${params.toString()}`);
  };

  return (
    <div className={compact ? 'bg-white rounded-2xl p-4 shadow-sm' : ''}>
      <div className={`grid gap-3 ${compact ? 'grid-cols-1 md:grid-cols-6' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6'}`}>
        <AirportAutocomplete
          placeholder={t('search.from')}
          value={origin}
          onChange={setOrigin}
          className={compact ? 'md:col-span-1' : 'lg:col-span-1'}
        />

        <AirportAutocomplete
          placeholder={t('search.to')}
          value={destination}
          onChange={setDestination}
          className={compact ? 'md:col-span-1' : 'lg:col-span-1'}
        />

        <div>
          <input
            type="date"
            value={departDate}
            onChange={(e) => setDepartDate(e.target.value)}
            placeholder={t('search.departDate')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
          />
        </div>

        <div>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            placeholder={t('search.returnDate')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
          />
        </div>

        <div className="relative">
          <PassengerSelector value={passengers} onChange={setPassengers} />
        </div>

        <Button
          onClick={handleSearch}
          disabled={!origin || !destination}
          size="lg"
          className="w-full"
        >
          {t('search.find')}
        </Button>
      </div>
    </div>
  );
}
