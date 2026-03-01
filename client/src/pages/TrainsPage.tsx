import { useTranslation } from 'react-i18next';

export function TrainsPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('categories.trains')}</h1>
      <p className="text-gray-500 mb-8">Поиск и покупка железнодорожных билетов</p>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21l2-2m4 2l2-2M7 4h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2zm0 8h10M9 15h.01M15 15h.01" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Скоро здесь появятся Ж/Д билеты</h2>
        <p className="text-gray-500">Мы подключаем партнёров по продаже железнодорожных билетов</p>
      </div>
    </div>
  );
}
