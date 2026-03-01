import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const popularTours = [
  { destination: 'Турция', type: 'Пляжный отдых', duration: '7 ночей', price: 25000, emoji: '🇹🇷' },
  { destination: 'Египет', type: 'Всё включено', duration: '7 ночей', price: 30000, emoji: '🇪🇬' },
  { destination: 'ОАЭ', type: 'Городской отдых', duration: '5 ночей', price: 45000, emoji: '🇦🇪' },
  { destination: 'Таиланд', type: 'Экзотика', duration: '10 ночей', price: 50000, emoji: '🇹🇭' },
  { destination: 'Мальдивы', type: 'Пляжный отдых', duration: '7 ночей', price: 80000, emoji: '🇲🇻' },
  { destination: 'Шри-Ланка', type: 'Экзотика', duration: '10 ночей', price: 55000, emoji: '🇱🇰' },
  { destination: 'Грузия', type: 'Гастротуры', duration: '5 ночей', price: 20000, emoji: '🇬🇪' },
  { destination: 'Италия', type: 'Экскурсионный', duration: '7 ночей', price: 60000, emoji: '🇮🇹' },
];

export function ToursPage() {
  const { t } = useTranslation();
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [nights, setNights] = useState('7');
  const [tourists, setTourists] = useState('2');
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (destination && departDate) setSearched(true);
  };

  return (
    <div>
      {/* Hero + Search */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            {t('categories.tours')}
          </h1>
          <p className="text-white/70 text-center mb-8">
            Готовые туры от лучших операторов по всему миру
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => { setDestination(e.target.value); setSearched(false); }}
                  placeholder="Куда хотите поехать?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
                />
              </div>
              <div>
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => { setDepartDate(e.target.value); setSearched(false); }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
                />
              </div>
              <div>
                <select
                  value={nights}
                  onChange={(e) => setNights(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
                >
                  <option value="3">3 ночи</option>
                  <option value="5">5 ночей</option>
                  <option value="7">7 ночей</option>
                  <option value="10">10 ночей</option>
                  <option value="14">14 ночей</option>
                </select>
              </div>
              <div>
                <select
                  value={tourists}
                  onChange={(e) => setTourists(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
                >
                  <option value="1">1 турист</option>
                  <option value="2">2 туриста</option>
                  <option value="3">3 туриста</option>
                  <option value="4">4 туриста</option>
                </select>
              </div>
              <button
                onClick={handleSearch}
                disabled={!destination || !departDate}
                className="w-full px-4 py-3 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {t('search.find')}
              </button>
            </div>

            {searched && (
              <div className="mt-4 p-4 bg-primary-50 rounded-xl text-center">
                <p className="text-sm text-primary-700">
                  Поиск туров скоро будет доступен. Мы подключаем туроператоров.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Tours */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Популярные направления</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTours.map((tour) => (
            <div
              key={tour.destination}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 text-center">
                <span className="text-4xl">{tour.emoji}</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-1">{tour.destination}</h3>
                <p className="text-xs text-gray-400 mb-3">{tour.type} · {tour.duration}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">от</span>
                  <span className="text-lg font-bold text-primary-600">{tour.price.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Почему туры с нами</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Проверенные операторы</h3>
              <p className="text-sm text-gray-500">Работаем только с надёжными и лицензированными туроператорами</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Лучшие цены</h3>
              <p className="text-sm text-gray-500">Сравниваем предложения десятков туроператоров</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Полный пакет</h3>
              <p className="text-sm text-gray-500">Перелёт, отель, трансфер и страховка — всё включено</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
