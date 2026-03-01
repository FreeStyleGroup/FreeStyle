import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      nav: {
        flights: 'Авиабилеты',
        hotels: 'Отели',
        carRental: 'Аренда авто',
        tours: 'Туры',
        insurance: 'Страховка',
        destinations: 'Направления',
        blog: 'Блог',
      },
      search: {
        from: 'Откуда',
        to: 'Куда',
        departDate: 'Туда',
        returnDate: 'Обратно',
        passengers: 'Пассажиры',
        adults: 'Взрослые',
        children: 'Дети',
        infants: 'Младенцы',
        find: 'Найти',
        oneWay: 'В одну сторону',
        roundTrip: 'Туда и обратно',
        city: 'Город или отель',
        checkIn: 'Заезд',
        checkOut: 'Выезд',
        guests: 'Гости',
        rooms: 'Номера',
      },
      home: {
        heroTitle: 'Путешествуйте свободно',
        heroSubtitle: 'Находите лучшие цены на авиабилеты, отели и туры',
        popularDestinations: 'Популярные направления',
        cheapFlights: 'Дешёвые авиабилеты',
        fromPrice: 'от',
        direct: 'Прямой',
        withTransfer: 'С пересадкой',
      },
      flights: {
        results: 'Результаты поиска',
        sortByPrice: 'По цене',
        sortByDuration: 'По времени',
        sortByOptimal: 'Оптимальный',
        buy: 'Купить',
        stops: 'Пересадки',
        noStops: 'Без пересадок',
        oneStop: '1 пересадка',
        twoStops: '2+ пересадки',
        duration: 'В пути',
        departure: 'Вылет',
        arrival: 'Прибытие',
        priceCalendar: 'Календарь цен',
        noResults: 'Рейсов не найдено',
      },
      hotels: {
        searchOnBooking: 'Найти на Booking.com',
        perNight: 'за ночь',
      },
      destinations: {
        allDestinations: 'Все направления',
        visa: 'Виза',
        weather: 'Погода',
        currency: 'Валюта',
        language: 'Язык',
        bestSeason: 'Лучший сезон',
        popularCities: 'Популярные города',
        cheapFlightsTo: 'Дешёвые билеты в',
      },
      common: {
        loading: 'Загрузка...',
        error: 'Произошла ошибка',
        retry: 'Попробовать снова',
        notFound: 'Страница не найдена',
        backHome: 'Вернуться на главную',
      },
      footer: {
        about: 'О проекте',
        contacts: 'Контакты',
        terms: 'Условия использования',
        privacy: 'Политика конфиденциальности',
        copyright: 'FreeStyle. Все права защищены.',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
