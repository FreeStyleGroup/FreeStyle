import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const popularRoutes = [
  { from: 'Москва', to: 'Санкт-Петербург', duration: '3ч 50м', price: 1200 },
  { from: 'Москва', to: 'Казань', duration: '11ч 30м', price: 1800 },
  { from: 'Москва', to: 'Нижний Новгород', duration: '3ч 30м', price: 900 },
  { from: 'Санкт-Петербург', to: 'Москва', duration: '3ч 50м', price: 1200 },
  { from: 'Москва', to: 'Сочи', duration: '24ч 00м', price: 2500 },
  { from: 'Москва', to: 'Екатеринбург', duration: '25ч 30м', price: 3200 },
];

export function TrainsPage() {
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
            {t('categories.trains')}
          </h1>
          <p className="text-white/70 text-center mb-8">
            Поиск и покупка железнодорожных билетов по России и СНГ
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
                  Поиск Ж/Д билетов скоро будет доступен. Мы подключаем партнёров.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Популярные направления</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularRoutes.map((route) => (
            <div
              key={`${route.from}-${route.to}`}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21l2-2m4 2l2-2M7 4h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2zm0 8h10M9 15h.01M15 15h.01" />
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
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Быстрый поиск</h3>
              <p className="text-sm text-gray-500">Находим билеты за секунды по всем направлениям</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Сравнение цен</h3>
              <p className="text-sm text-gray-500">Сравниваем стоимость у разных перевозчиков</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Электронные билеты</h3>
              <p className="text-sm text-gray-500">Билет на телефоне — не нужно печатать</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
