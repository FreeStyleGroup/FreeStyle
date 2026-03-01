import { useTranslation } from 'react-i18next';
import { formatPrice } from '@/utils/formatPrice';
import { formatDuration } from '@/utils/formatDuration';
import type { FlightOffer } from '@freestyle/shared';

interface FlightCardProps {
  flight: FlightOffer;
}

export function FlightCard({ flight }: FlightCardProps) {
  const { t } = useTranslation();

  const departTime = flight.departureAt ? new Date(flight.departureAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '';
  const departDate = flight.departureAt ? new Date(flight.departureAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) : '';

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Airline */}
        <div className="flex items-center gap-3 md:w-40">
          <img
            src={flight.airline.logoUrl}
            alt={flight.airline.name}
            className="h-8 w-auto"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div>
            <div className="text-sm font-medium text-gray-900">{flight.airline.code}</div>
            <div className="text-xs text-gray-400">{flight.flightNumber}</div>
          </div>
        </div>

        {/* Route */}
        <div className="flex-1 flex items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{departTime}</div>
            <div className="text-xs text-gray-500">{flight.origin.cityCode}</div>
            <div className="text-xs text-gray-400">{departDate}</div>
          </div>

          <div className="flex-1 flex flex-col items-center">
            <div className="text-xs text-gray-400">{formatDuration(flight.durationOutbound)}</div>
            <div className="w-full flex items-center gap-1 my-1">
              <div className="flex-1 h-px bg-gray-300" />
              {flight.transfers > 0 && (
                <div className="w-2 h-2 rounded-full bg-accent-500" />
              )}
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <div className="text-xs text-gray-500">
              {flight.isDirectFlight
                ? t('home.direct')
                : `${flight.transfers} ${t('home.withTransfer').toLowerCase()}`
              }
            </div>
          </div>

          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {flight.destination.cityCode}
            </div>
            <div className="text-xs text-gray-500">{flight.destination.code}</div>
          </div>
        </div>

        {/* Price + Buy */}
        <div className="md:w-44 flex flex-col items-end gap-2">
          <div className="text-2xl font-bold text-primary-600">
            {formatPrice(flight.price.amount, flight.price.currency)}
          </div>
          {flight.affiliateLink ? (
            <a
              href={flight.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              {t('flights.buy')}
            </a>
          ) : (
            <span className="text-xs text-gray-400">{t('flights.buy')}</span>
          )}
        </div>
      </div>
    </div>
  );
}
