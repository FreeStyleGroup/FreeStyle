import { referenceService } from '../travelpayouts/reference.service.js';

/**
 * Кураторская коллекция популярных туристических стран с метаданными
 * (виза, валюта, климат, лучший сезон, столица, основные города).
 *
 * Travelpayouts даёт только code/name/currency — для travel-сайта этого мало,
 * нам нужен полноценный контент: визовый режим для россиян, время полёта,
 * климат, рекомендации. Этот справочник — наш ground truth, обновляем вручную.
 */
export interface CountryProfile {
  code: string;            // ISO 3166-1 alpha-2 (uppercase)
  slug: string;            // url-friendly
  name: string;            // RU название
  nameEn: string;
  flag: string;            // emoji
  capital: string;
  currency: string;        // ISO 4217 (RUB/USD/EUR)
  currencyName: string;
  language: string[];
  timeZone: string;        // основной TZ
  flightTimeFromMoscow: string;
  /** Виза для граждан РФ */
  visa: {
    required: 'no' | 'on-arrival' | 'e-visa' | 'yes';
    note: string;
    stayDays?: number;
  };
  climate: {
    summary: string;
    bestSeason: string;
  };
  /** Несколько ключевых городов (для пресет-фильтров полёта/отеля) */
  cities: Array<{ name: string; code: string }>;
  /** Hero-image URL (открытый источник или собственный CDN) */
  heroImage: string;
  /** Короткое описание для главной страны */
  shortDescription: string;
  /** Подробное описание (markdown-light) */
  longDescription: string;
  popular: boolean;
}

const COUNTRIES: CountryProfile[] = [
  {
    code: 'TR', slug: 'turkey', name: 'Турция', nameEn: 'Turkey', flag: '🇹🇷',
    capital: 'Анкара', currency: 'TRY', currencyName: 'Турецкая лира',
    language: ['Турецкий'], timeZone: 'UTC+3', flightTimeFromMoscow: '3-4 часа',
    visa: { required: 'no', note: 'Безвизовый въезд до 60 дней', stayDays: 60 },
    climate: { summary: 'Средиземноморский на побережье, континентальный в центре', bestSeason: 'Май-октябрь (пляжи), круглый год (Стамбул)' },
    cities: [
      { name: 'Стамбул',   code: 'IST' },
      { name: 'Анталия',   code: 'AYT' },
      { name: 'Бодрум',    code: 'BJV' },
      { name: 'Измир',     code: 'ADB' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=80',
    shortDescription: 'Стамбул, Анталия, Каппадокия — три причины ездить в Турцию круглый год.',
    longDescription: 'Турция остаётся №1 у россиян: безвизовый въезд на 60 дней, прямые рейсы из 20+ городов России, развитая инфраструктура all-inclusive и культурное наследие, которое трудно переоценить. Летом — пляжи Эгейского и Средиземного побережья, зимой — горнолыжный Улудаг и Эрджиес, круглый год — Стамбул как один из самых живых городов мира.',
    popular: true,
  },
  {
    code: 'TH', slug: 'thailand', name: 'Таиланд', nameEn: 'Thailand', flag: '🇹🇭',
    capital: 'Бангкок', currency: 'THB', currencyName: 'Тайский бат',
    language: ['Тайский'], timeZone: 'UTC+7', flightTimeFromMoscow: '9-10 часов',
    visa: { required: 'no', note: 'Безвизовый въезд до 60 дней (с 2024)', stayDays: 60 },
    climate: { summary: 'Тропический, два сезона: сухой и влажный', bestSeason: 'Ноябрь-март' },
    cities: [
      { name: 'Бангкок',    code: 'BKK' },
      { name: 'Пхукет',     code: 'HKT' },
      { name: 'Самуи',      code: 'USM' },
      { name: 'Краби',      code: 'KBV' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1600&q=80',
    shortDescription: 'Острова, храмы, уличная еда — пляжи мирового уровня и недорогая Азия.',
    longDescription: 'Таиланд — главная зимовка для россиян. Безвиз 60 дней, низкие цены, мягкий тропический климат, развитая инфраструктура для долгих путешествий. На Пхукете и Самуи — пляжный all-inclusive, в Краби и на островах андаманской группы — дайвинг и одно из лучших в мире рок-кламбинга. Бангкок круглый год живёт круглосуточно.',
    popular: true,
  },
  {
    code: 'AE', slug: 'uae', name: 'ОАЭ', nameEn: 'UAE', flag: '🇦🇪',
    capital: 'Абу-Даби', currency: 'AED', currencyName: 'Дирхам ОАЭ',
    language: ['Арабский', 'Английский'], timeZone: 'UTC+4', flightTimeFromMoscow: '5 часов',
    visa: { required: 'no', note: 'Безвизовый въезд до 90 дней', stayDays: 90 },
    climate: { summary: 'Пустынный, жаркий', bestSeason: 'Октябрь-апрель (летом +45°C)' },
    cities: [
      { name: 'Дубай',     code: 'DXB' },
      { name: 'Абу-Даби',  code: 'AUH' },
      { name: 'Шарджа',    code: 'SHJ' },
      { name: 'Рас-эль-Хайма', code: 'RKT' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1600&q=80',
    shortDescription: 'Дубай зимой — мировой топ-3 направлений: солнце, шопинг, гастрономия.',
    longDescription: 'ОАЭ — один из самых популярных у россиян маршрутов в зимнее время. Безвиз 90 дней, прямые рейсы Emirates / FlyDubai / Aeroflot, безупречная инфраструктура, шопинг dutty-free, мировые рестораны и в часе езды — пустыня. С 2023 года рубль стабильно конвертируется в дирхам, оплата по российским картам через сторонние сервисы работает.',
    popular: true,
  },
  {
    code: 'GE', slug: 'georgia', name: 'Грузия', nameEn: 'Georgia', flag: '🇬🇪',
    capital: 'Тбилиси', currency: 'GEL', currencyName: 'Грузинский лари',
    language: ['Грузинский', 'Русский', 'Английский'], timeZone: 'UTC+4', flightTimeFromMoscow: '2-3 часа',
    visa: { required: 'no', note: 'Безвизовый въезд до 365 дней', stayDays: 365 },
    climate: { summary: 'Субтропический на побережье, континентальный в горах', bestSeason: 'Апрель-июнь, сентябрь-октябрь' },
    cities: [
      { name: 'Тбилиси',  code: 'TBS' },
      { name: 'Батуми',   code: 'BUS' },
      { name: 'Кутаиси',  code: 'KUT' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1600&q=80',
    shortDescription: 'Вино, хачапури, горы и тёплое море — Грузия близко и круглый год.',
    longDescription: 'Грузия — самый комфортный для россиян выезд: безвиз 365 дней, многие говорят по-русски, прямые рейсы в Тбилиси и Батуми возобновились в 2023. Тбилиси — концентрат еды, архитектуры и ночной жизни, Батуми — пляжный город, Сванетия и Казбеги — для треккинга. Кахетия — мировой винный регион.',
    popular: true,
  },
  {
    code: 'IT', slug: 'italy', name: 'Италия', nameEn: 'Italy', flag: '🇮🇹',
    capital: 'Рим', currency: 'EUR', currencyName: 'Евро',
    language: ['Итальянский'], timeZone: 'UTC+1', flightTimeFromMoscow: '4 часа',
    visa: { required: 'yes', note: 'Шенген виза C (туристическая), записи в визовые центры VFS' },
    climate: { summary: 'Средиземноморский на юге, континентальный на севере', bestSeason: 'Май-июнь, сентябрь-октябрь' },
    cities: [
      { name: 'Рим',     code: 'ROM' },
      { name: 'Милан',   code: 'MIL' },
      { name: 'Венеция', code: 'VCE' },
      { name: 'Флоренция', code: 'FLR' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=1600&q=80',
    shortDescription: 'Колыбель европейской культуры — еда, искусство, мода, побережье.',
    longDescription: 'Италия — мечта-направление. Рим и Ватикан, искусство Флоренции, мода Милана, романтика Венеции, побережье Амальфи, Сицилия. Виза-шенген для россиян в 2026 году выдаётся, но запись в визовые центры может быть на 2-3 месяца вперёд — планируем заранее.',
    popular: true,
  },
  {
    code: 'EG', slug: 'egypt', name: 'Египет', nameEn: 'Egypt', flag: '🇪🇬',
    capital: 'Каир', currency: 'EGP', currencyName: 'Египетский фунт',
    language: ['Арабский', 'Английский'], timeZone: 'UTC+2', flightTimeFromMoscow: '4-5 часов',
    visa: { required: 'on-arrival', note: 'Виза по прилёту, $25', stayDays: 30 },
    climate: { summary: 'Пустынный, тёплый круглый год на Красном море', bestSeason: 'Октябрь-апрель' },
    cities: [
      { name: 'Хургада',       code: 'HRG' },
      { name: 'Шарм-эль-Шейх', code: 'SSH' },
      { name: 'Каир',          code: 'CAI' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1600&q=80',
    shortDescription: 'Красное море круглый год, пирамиды, dive-сайты мирового уровня.',
    longDescription: 'Египет — одно из старейших russian-friendly направлений. Хургада и Шарм-эль-Шейх — пляжный all-inclusive, дайвинг на коралловых рифах Красного моря входит в мировой топ. Каир и пирамиды Гизы — для культурного маршрута. Виза по прилёту — $25, оформляется за 5 минут.',
    popular: true,
  },
  {
    code: 'CY', slug: 'cyprus', name: 'Кипр', nameEn: 'Cyprus', flag: '🇨🇾',
    capital: 'Никосия', currency: 'EUR', currencyName: 'Евро',
    language: ['Греческий', 'Английский'], timeZone: 'UTC+2', flightTimeFromMoscow: '4 часа',
    visa: { required: 'e-visa', note: 'Pro-Visa онлайн, бесплатно' },
    climate: { summary: 'Средиземноморский', bestSeason: 'Май-октябрь' },
    cities: [
      { name: 'Ларнака', code: 'LCA' },
      { name: 'Пафос',   code: 'PFO' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1568849676085-51415703900f?w=1600&q=80',
    shortDescription: 'Тёплое море, греческая кухня, простая онлайн-виза за час.',
    longDescription: 'Кипр — одно из самых комфортных направлений в ЕС для россиян: онлайн-провиза за 1 час, удобные прямые рейсы, мягкий климат. Пафос — historic-зона ЮНЕСКО, Ларнака — пляжный город, Лимасол — деловой и более городской.',
    popular: true,
  },
  {
    code: 'ID', slug: 'indonesia', name: 'Индонезия (Бали)', nameEn: 'Indonesia', flag: '🇮🇩',
    capital: 'Джакарта', currency: 'IDR', currencyName: 'Индонезийская рупия',
    language: ['Индонезийский', 'Английский'], timeZone: 'UTC+7…+9', flightTimeFromMoscow: '12-14 часов',
    visa: { required: 'on-arrival', note: 'Visa on arrival $35, 30 дней + продление', stayDays: 30 },
    climate: { summary: 'Тропический, круглый год около +30°C', bestSeason: 'Апрель-октябрь (сухой сезон)' },
    cities: [
      { name: 'Денпасар (Бали)', code: 'DPS' },
      { name: 'Джакарта',        code: 'JKT' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80',
    shortDescription: 'Бали — мировая столица digital-номадов и серфинга.',
    longDescription: 'Бали — топовое long-stay направление. Visa on arrival $35, продление на месте, дешёвая аренда виллы, развитая инфраструктура для digital-nomads. Север (Убуд) — для йоги и культуры, юг (Чангу/Семиньяк) — для серферов и баров.',
    popular: true,
  },
  {
    code: 'VN', slug: 'vietnam', name: 'Вьетнам', nameEn: 'Vietnam', flag: '🇻🇳',
    capital: 'Ханой', currency: 'VND', currencyName: 'Вьетнамский донг',
    language: ['Вьетнамский', 'Английский'], timeZone: 'UTC+7', flightTimeFromMoscow: '10-11 часов',
    visa: { required: 'no', note: 'Безвизовый въезд до 45 дней', stayDays: 45 },
    climate: { summary: 'Тропический на юге, муссонный на севере', bestSeason: 'Декабрь-апрель (юг), октябрь-апрель (Нячанг)' },
    cities: [
      { name: 'Нячанг',          code: 'CXR' },
      { name: 'Хошимин',         code: 'SGN' },
      { name: 'Дананг',          code: 'DAD' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1600&q=80',
    shortDescription: 'Безвиз 45 дней, мягкий климат и одно из лучших соотношений цена/качество.',
    longDescription: 'Вьетнам — отличная альтернатива Таиланду при том же климате и более низких ценах. Безвиз 45 дней. Нячанг — пляжный курорт с большой русской диаспорой, Хойан — старинный город ЮНЕСКО, Сапа — горы и треккинг.',
    popular: true,
  },
  {
    code: 'CN', slug: 'china', name: 'Китай', nameEn: 'China', flag: '🇨🇳',
    capital: 'Пекин', currency: 'CNY', currencyName: 'Китайский юань',
    language: ['Китайский', 'Английский'], timeZone: 'UTC+8', flightTimeFromMoscow: '7-9 часов',
    visa: { required: 'no', note: 'Безвиз для тургрупп от 2 человек (с 2024)' },
    climate: { summary: 'Разный по регионам — от тропиков на юге до континентального на севере', bestSeason: 'Апрель-май, сентябрь-октябрь' },
    cities: [
      { name: 'Пекин',   code: 'PEK' },
      { name: 'Шанхай',  code: 'SHA' },
      { name: 'Гуанчжоу', code: 'CAN' },
      { name: 'Санья',   code: 'SYX' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1600&q=80',
    shortDescription: 'Древняя цивилизация, ультра-современные мегаполисы, пляжи Хайнаня.',
    longDescription: 'Китай открылся для россиян после ковида. Безвиз для турпоездок в составе организованных групп от 2 человек. Шанхай и Пекин — must-see, Санья на Хайнане — российский пляжный фаворит. Активно развивается e-Yuan и QR-платежи WeChat — кэш почти не используется.',
    popular: false,
  },
  {
    code: 'ES', slug: 'spain', name: 'Испания', nameEn: 'Spain', flag: '🇪🇸',
    capital: 'Мадрид', currency: 'EUR', currencyName: 'Евро',
    language: ['Испанский'], timeZone: 'UTC+1', flightTimeFromMoscow: '5 часов',
    visa: { required: 'yes', note: 'Шенген виза C, BLS-International' },
    climate: { summary: 'Средиземноморский на побережье, континентальный в центре', bestSeason: 'Май-июнь, сентябрь-октябрь' },
    cities: [
      { name: 'Барселона', code: 'BCN' },
      { name: 'Мадрид',    code: 'MAD' },
      { name: 'Малага',    code: 'AGP' },
      { name: 'Пальма',    code: 'PMI' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=1600&q=80',
    shortDescription: 'Барселона, Мадрид, Канары — солнце, тапас и архитектура Гауди.',
    longDescription: 'Испания — одно из самых ценных направлений Европы для россиян. Барселона — must-see, Мадрид — мировые музеи, Канары — круглогодичное лето, Андалусия — для тех кто любит флешок. Виза-шенген выдаётся через BLS-International, запись на 1-2 месяца.',
    popular: false,
  },
  {
    code: 'RS', slug: 'serbia', name: 'Сербия', nameEn: 'Serbia', flag: '🇷🇸',
    capital: 'Белград', currency: 'RSD', currencyName: 'Сербский динар',
    language: ['Сербский', 'Русский'], timeZone: 'UTC+1', flightTimeFromMoscow: '3 часа',
    visa: { required: 'no', note: 'Безвизовый въезд до 30 дней', stayDays: 30 },
    climate: { summary: 'Континентальный', bestSeason: 'Апрель-октябрь' },
    cities: [
      { name: 'Белград',   code: 'BEG' },
      { name: 'Ниш',       code: 'INI' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1620369437994-cdf12d9854f4?w=1600&q=80',
    shortDescription: 'Безвизовая Европа, доступные цены, прямые рейсы Air Serbia.',
    longDescription: 'Сербия — главный безвизовый хаб в Европе для россиян. Прямые рейсы Air Serbia, многие говорят по-русски, цены значительно ниже Западной Европы. Белград — живой ночной город, Нови-Сад — культурный центр, монастыри Фрушка Гора — для культурных маршрутов.',
    popular: false,
  },
];

export const countriesService = {
  /** Все курируемые страны (sorted: popular first, then alpha) */
  list(): Array<Omit<CountryProfile, 'longDescription'>> {
    return [...COUNTRIES]
      .sort((a, b) => {
        if (a.popular !== b.popular) return a.popular ? -1 : 1;
        return a.name.localeCompare(b.name, 'ru');
      })
      .map(({ longDescription: _ld, ...rest }) => rest);
  },

  /** Детали одной страны по slug-у */
  async getBySlug(slug: string): Promise<CountryProfile | null> {
    const country = COUNTRIES.find((c) => c.slug === slug);
    return country ?? null;
  },

  /** Резолв slug → ISO code для интеграции с TP API */
  getCodeBySlug(slug: string): string | null {
    return COUNTRIES.find((c) => c.slug === slug)?.code ?? null;
  },

  /** Обогащаем валютной информацией из Travelpayouts (currency может расходиться) */
  async enrichFromTP(country: CountryProfile): Promise<CountryProfile> {
    try {
      const all = await referenceService.getCountries('ru');
      const tp = all.find((c) => c.code === country.code);
      if (tp?.currency) return { ...country, currency: tp.currency };
    } catch {
      /** TP недоступен — не критично, возвращаем кураторскую версию */
    }
    return country;
  },
};
