import { useTranslation } from 'react-i18next';

export function CarRentalPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('nav.carRental')}</h1>
      <p className="text-gray-500 mb-8">
        Арендуйте автомобиль в любой точке мира по лучшим ценам
      </p>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h8M8 17v-4m8 4v-4m-8 0h8m-8 0l-2-6h12l-2 6M6 21h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Скоро здесь появится поиск аренды авто</h2>
        <p className="text-gray-500">
          Мы работаем над интеграцией с лучшими сервисами аренды автомобилей
        </p>
      </div>
    </div>
  );
}
