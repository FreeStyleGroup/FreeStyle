import { useTranslation } from 'react-i18next';
import { FlightSearchForm } from '@/components/search/FlightSearchForm';

export function FlightsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            {t('nav.flights')}
          </h1>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <FlightSearchForm />
          </div>
        </div>
      </section>
    </div>
  );
}
