import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FlightCard } from '@/components/cards/FlightCard';
import { FlightSearchForm } from '@/components/search/FlightSearchForm';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { useFlightSearch } from '@/hooks/useFlightSearch';

type SortKey = 'price' | 'duration' | 'transfers';

export function FlightResultsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { results, isLoading, error, search } = useFlightSearch();

  const [sortBy, setSortBy] = useState<SortKey>('price');
  const [filterStops, setFilterStops] = useState<number | null>(null);

  useEffect(() => {
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    if (origin && destination) {
      search({
        origin,
        destination,
        departureAt: searchParams.get('departureAt') || undefined,
        returnAt: searchParams.get('returnAt') || undefined,
      });
    }
  }, [searchParams, search]);

  let filtered = [...results];

  if (filterStops !== null) {
    filtered = filtered.filter((f) =>
      filterStops === 0 ? f.isDirectFlight : f.transfers === filterStops,
    );
  }

  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'price': return a.price.amount - b.price.amount;
      case 'duration': return a.durationOutbound - b.durationOutbound;
      case 'transfers': return a.transfers - b.transfers;
      default: return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search form (compact) */}
      <div className="mb-8">
        <FlightSearchForm compact />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">{t('flights.stops')}</h3>
            <div className="space-y-2">
              {[
                { value: null, label: 'Все' },
                { value: 0, label: t('flights.noStops') },
                { value: 1, label: t('flights.oneStop') },
                { value: 2, label: t('flights.twoStops') },
              ].map(({ value, label }) => (
                <label key={String(value)} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="stops"
                    checked={filterStops === value}
                    onChange={() => setFilterStops(value)}
                    className="text-primary-600"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Сортировка:</span>
            {([
              { key: 'price' as SortKey, label: t('flights.sortByPrice') },
              { key: 'duration' as SortKey, label: t('flights.sortByDuration') },
            ]).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSortBy(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  sortBy === key
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-500">{t('common.loading')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                {t('common.retry')}
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{t('flights.noResults')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-2">
                {t('flights.results')}: {filtered.length}
              </p>
              {filtered.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
