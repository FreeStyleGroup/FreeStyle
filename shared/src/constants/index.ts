export const CURRENCIES = [
  { code: 'rub', symbol: '₽', name: 'Рубль' },
  { code: 'usd', symbol: '$', name: 'Доллар' },
  { code: 'eur', symbol: '€', name: 'Евро' },
  { code: 'gbp', symbol: '£', name: 'Фунт' },
  { code: 'try', symbol: '₺', name: 'Лира' },
  { code: 'thb', symbol: '฿', name: 'Бат' },
] as const;

export const TRIP_CLASSES = [
  { value: 'Y', label: 'Эконом' },
  { value: 'C', label: 'Бизнес' },
  { value: 'F', label: 'Первый' },
] as const;

export const DEFAULT_CURRENCY = 'rub';
export const DEFAULT_LOCALE = 'ru';

export const AIRLINE_LOGO_BASE_URL = 'https://pics.avs.io';
export const HOTEL_PHOTO_BASE_URL = 'https://photo.hotellook.com/image_v2/crop';
