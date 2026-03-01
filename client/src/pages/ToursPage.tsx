import { useTranslation } from 'react-i18next';

export function ToursPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('nav.tours')}</h1>
      <p className="text-gray-500 mb-8">
        Готовые туры и экскурсии по всему миру
      </p>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Скоро здесь появятся туры</h2>
        <p className="text-gray-500">
          Мы подключаем лучших туроператоров и сервисы экскурсий
        </p>
      </div>
    </div>
  );
}
