import { useTranslation } from 'react-i18next';

export function AllTransportPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('categories.allTransport')}</h1>
      <p className="text-gray-500 mb-8">Все виды транспорта в одном месте</p>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Скоро здесь появится поиск транспорта</h2>
        <p className="text-gray-500">Авиабилеты, поезда, автобусы — всё в одном поиске</p>
      </div>
    </div>
  );
}
