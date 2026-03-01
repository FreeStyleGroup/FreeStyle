import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AirportAutocomplete } from './AirportAutocomplete';
import { Button } from '@/components/ui/Button';
import type { AutocompleteItem } from '@freestyle/shared';

export function HotelSearchForm() {
  const { t } = useTranslation();
  const [city, setCity] = useState<AutocompleteItem | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const handleSearch = async () => {
    if (!city || !checkIn || !checkOut) return;

    const params = new URLSearchParams({
      city: city.name,
      checkIn,
      checkOut,
      adults: String(guests),
    });

    try {
      const res = await fetch(`/api/hotels/search?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data.affiliateLink) {
        window.open(data.data.affiliateLink, '_blank');
      }
    } catch {
      // TODO: show error
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
      <AirportAutocomplete
        placeholder={t('search.city')}
        value={city}
        onChange={setCity}
      />

      <div>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
        />
      </div>

      <div>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
        />
      </div>

      <div>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>{n} {t('search.guests')}</option>
          ))}
        </select>
      </div>

      <Button onClick={handleSearch} disabled={!city || !checkIn || !checkOut} size="lg" className="w-full">
        {t('search.find')}
      </Button>
    </div>
  );
}
