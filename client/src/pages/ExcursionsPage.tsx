import { useTranslation } from 'react-i18next';

export function ExcursionsPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('categories.excursions')}</h1>
      <p className="text-gray-500 mb-8">Экскурсии и активности по всему миру</p>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21V9l4-4h10l4 4v12M3 21h18M8 21v-6h8v6M12 3v2M9 5h6" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Скоро здесь появятся экскурсии</h2>
        <p className="text-gray-500">Мы подключаем лучших провайдеров экскурсий</p>
      </div>
    </div>
  );
}
