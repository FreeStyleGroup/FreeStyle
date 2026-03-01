import { useTranslation } from 'react-i18next';

export function BusesPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('categories.buses')}</h1>
      <p className="text-gray-500 mb-8">Поиск и покупка автобусных билетов</p>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 18v2m14-2v2M5 4h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zm0 7h14M8 15h.01M16 15h.01" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Скоро здесь появятся автобусные билеты</h2>
        <p className="text-gray-500">Мы подключаем партнёров по автобусным перевозкам</p>
      </div>
    </div>
  );
}
