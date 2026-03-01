import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DestinationCard } from '@/components/cards/DestinationCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { destinationsApi } from '@/api/destinations.api';
import type { Destination } from '@freestyle/shared';

const regions = [
  { value: 'all', label: 'Все' },
  { value: 'europe', label: 'Европа' },
  { value: 'asia', label: 'Азия' },
  { value: 'africa', label: 'Африка' },
];

export function DestinationsPage() {
  const { t } = useTranslation();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState('all');

  useEffect(() => {
    destinationsApi.getAll()
      .then(setDestinations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = region === 'all'
    ? destinations
    : destinations.filter((d) => d.region === region);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {t('destinations.allDestinations')}
      </h1>
      <p className="text-gray-500 mb-8">
        Выберите направление для вашего следующего путешествия
      </p>

      {/* Region filter */}
      <div className="flex gap-2 mb-8">
        {regions.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRegion(value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              region === value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((dest) => (
            <DestinationCard key={dest.slug} destination={dest} />
          ))}
        </div>
      )}
    </div>
  );
}
