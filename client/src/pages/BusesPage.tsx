import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const popularRoutes = [
  { from: 'Москва', to: 'Санкт-Петербург', duration: '9ч 00м', price: 1000 },
  { from: 'Москва', to: 'Владимир', duration: '3ч 30м', price: 500 },
  { from: 'Санкт-Петербург', to: 'Хельсинки', duration: '6ч 30м', price: 1500 },
  { from: 'Москва', to: 'Тула', duration: '2ч 40м', price: 400 },
  { from: 'Краснодар', to: 'Сочи', duration: '5ч 00м', price: 600 },
  { from: 'Москва', to: 'Рязань', duration: '3ч 00м', price: 450 },
];

export function BusesPage() {
  const { t } = useTranslation();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (from && to && date) setSearched(true);
  };

  return (
    <div>
      {/* Hero + Search */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            {t('categories.buses')}
          </h1>
          <p className="text-white/70 text-center mb-8">
            Автобусные билеты по России и Европе
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => { setFrom(e.target.value); setSearched(false); }}
                  placeholder="Откуда"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => { setTo(e.target.value); setSearched(false); }}
                  placeholder="Куда"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
                />
              </div>
              <div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => { setDate(e.target.value); setSearched(false); }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
                />
              </div>
              <div>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all">
                  <option>1 пассажир</option>
                  <option>2 пассажира</option>
                  <option>3 пассажира</option>
                  <option>4 пассажира</option>
                </select>
              </div>
              <button
                onClick={handleSearch}
                disabled={!from || !to || !date}
                className="w-full px-4 py-3 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {t('search.find')}
              </button>
            </div>

            {searched && (
              <div className="mt-4 p-4 bg-primary-50 rounded-xl text-center">
                <p className="text-sm text-primary-700">
                  Поиск автобусных билетов скоро будет доступен. Мы подключаем партнёров.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Популярные маршруты</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularRoutes.map((route) => (
            <div
              key={`${route.from}-${route.to}`}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 18v2m14-2v2M5 4h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zm0 7h14M8 15h.01M16 15h.01" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{route.from} → {route.to}</p>
                  <p className="text-xs text-gray-400">В пути: {route.duration}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">от</span>
                <span className="text-lg font-bold text-primary-600">{route.price.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Удобный поиск автобусов</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Все перевозчики</h3>
              <p className="text-sm text-gray-500">Билеты от крупнейших автобусных компаний в одном месте</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Выгодные цены</h3>
              <p className="text-sm text-gray-500">Автобус — самый бюджетный способ путешествовать</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Удобное расписание</h3>
              <p className="text-sm text-gray-500">Рейсы в удобное время с комфортабельными автобусами</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
