import { useTranslation } from 'react-i18next';
import { HotelSearchForm } from '@/components/search/HotelSearchForm';

export function HotelsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            {t('nav.hotels')}
          </h1>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <HotelSearchForm />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">
          Поиск отелей осуществляется через Booking.com — крупнейшую систему бронирования в мире.
        </p>
      </section>
    </div>
  );
}
