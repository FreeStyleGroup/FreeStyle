import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { destinationsApi } from '@/api/destinations.api';
import type { Destination } from '@freestyle/shared';

export function DestinationDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    destinationsApi.getBySlug(slug)
      .then(setDestination)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-500 text-lg mb-4">{t('common.notFound')}</p>
        <Link to="/destinations">
          <Button variant="outline">{t('common.backHome')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative h-72 md:h-96">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">{destination.name}</h1>
          <p className="text-white/80 text-lg mt-2">{destination.nameEn}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Info cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: t('destinations.visa'), value: destination.visaInfo },
            { label: t('destinations.weather'), value: destination.avgTemperature },
            { label: t('destinations.currency'), value: destination.currency },
            { label: t('destinations.bestSeason'), value: destination.bestSeason },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</div>
              <div className="text-sm font-medium text-gray-900">{value}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-12">
          <p className="text-gray-700 leading-relaxed">{destination.description}</p>
        </div>

        {/* Popular cities */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t('destinations.popularCities')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {destination.popularCities.map((city) => (
            <div key={city.iataCode} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img
                src={city.imageUrl}
                alt={city.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{city.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{city.description}</p>
                <Link
                  to={`/flights?destination=${city.iataCode}`}
                  className="inline-block mt-3 text-sm text-primary-600 font-medium hover:underline"
                >
                  {t('destinations.cheapFlightsTo')} {city.name} &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
