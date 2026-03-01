import { tpClient } from './tp.client.js';
import { cacheService } from '../cache.service.js';
import { config } from '../../config/index.js';
import type { FlightOffer, PriceCalendarEntry, PopularDirection } from '@freestyle/shared';

const CACHE_TTL = config.cache.defaultTtl;

function buildCacheKey(prefix: string, params: Record<string, unknown>): string {
  const sorted = Object.entries(params).sort(([a], [b]) => a.localeCompare(b));
  return `${prefix}:${JSON.stringify(sorted)}`;
}

function airlineLogoUrl(code: string): string {
  return `https://pics.avs.io/100/40/${code}.png`;
}

export const flightsService = {
  async getPricesForDates(params: {
    origin: string;
    destination?: string;
    departureAt?: string;
    returnAt?: string;
    direct?: boolean;
    currency?: string;
    limit?: number;
    oneWay?: boolean;
    sorting?: string;
  }): Promise<FlightOffer[]> {
    const cacheKey = buildCacheKey('flights:prices', params);
    const cached = cacheService.get<FlightOffer[]>(cacheKey);
    if (cached) return cached;

    const { data } = await tpClient.get('/aviasales/v3/prices_for_dates', {
      params: {
        origin: params.origin,
        destination: params.destination,
        departure_at: params.departureAt,
        return_at: params.returnAt,
        direct: params.direct,
        currency: params.currency || config.defaultCurrency,
        limit: params.limit || 30,
        one_way: params.oneWay,
        sorting: params.sorting || 'price',
        token: config.tp.apiToken,
      },
    });

    if (!data.success) return [];

    const offers: FlightOffer[] = data.data.map((item: any, index: number) => ({
      id: `${item.origin}-${item.destination}-${index}`,
      origin: {
        code: item.origin_airport,
        cityCode: item.origin,
        name: item.origin,
      },
      destination: {
        code: item.destination_airport,
        cityCode: item.destination,
        name: item.destination,
      },
      price: {
        amount: item.price,
        currency: data.currency || params.currency || config.defaultCurrency,
      },
      airline: {
        code: item.airline,
        name: item.airline,
        logoUrl: airlineLogoUrl(item.airline),
      },
      flightNumber: item.flight_number || '',
      departureAt: item.departure_at,
      returnAt: item.return_at || null,
      transfers: item.transfers || 0,
      durationMinutes: item.duration || 0,
      durationOutbound: item.duration_to || 0,
      durationReturn: item.duration_back || null,
      affiliateLink: buildAffiliateLink(item),
      isDirectFlight: (item.transfers || 0) === 0,
    }));

    cacheService.set(cacheKey, offers, CACHE_TTL);
    return offers;
  },

  async getCheapTickets(params: {
    origin: string;
    destination?: string;
    departDate?: string;
    returnDate?: string;
    currency?: string;
  }): Promise<FlightOffer[]> {
    const cacheKey = buildCacheKey('flights:cheap', params);
    const cached = cacheService.get<FlightOffer[]>(cacheKey);
    if (cached) return cached;

    const { data } = await tpClient.get('/v1/prices/cheap', {
      params: {
        origin: params.origin,
        destination: params.destination,
        depart_date: params.departDate,
        return_date: params.returnDate,
        currency: params.currency || config.defaultCurrency,
        token: config.tp.apiToken,
      },
    });

    if (!data.success) return [];

    const offers: FlightOffer[] = [];
    for (const [destCode, transfers] of Object.entries(data.data as Record<string, any>)) {
      for (const [transferCount, ticket] of Object.entries(transfers as Record<string, any>)) {
        offers.push({
          id: `${params.origin}-${destCode}-${transferCount}`,
          origin: { code: params.origin, cityCode: params.origin, name: params.origin },
          destination: { code: destCode, cityCode: destCode, name: destCode },
          price: { amount: ticket.price, currency: data.currency || config.defaultCurrency },
          airline: {
            code: ticket.airline,
            name: ticket.airline,
            logoUrl: airlineLogoUrl(ticket.airline),
          },
          flightNumber: String(ticket.flight_number || ''),
          departureAt: ticket.departure_at,
          returnAt: ticket.return_at || null,
          transfers: parseInt(transferCount, 10),
          durationMinutes: 0,
          durationOutbound: 0,
          durationReturn: null,
          affiliateLink: '',
          isDirectFlight: transferCount === '0',
        });
      }
    }

    cacheService.set(cacheKey, offers, CACHE_TTL);
    return offers;
  },

  async getPriceCalendar(params: {
    origin: string;
    destination: string;
    departDate: string;
    returnDate?: string;
    currency?: string;
  }): Promise<PriceCalendarEntry[]> {
    const cacheKey = buildCacheKey('flights:calendar', params);
    const cached = cacheService.get<PriceCalendarEntry[]>(cacheKey);
    if (cached) return cached;

    const { data } = await tpClient.get('/v1/prices/calendar', {
      params: {
        origin: params.origin,
        destination: params.destination,
        depart_date: params.departDate,
        return_date: params.returnDate,
        currency: params.currency || config.defaultCurrency,
        token: config.tp.apiToken,
      },
    });

    if (!data.success) return [];

    const entries: PriceCalendarEntry[] = Object.entries(data.data as Record<string, any>).map(
      ([date, item]: [string, any]) => ({
        date,
        price: item.price,
        currency: data.currency || config.defaultCurrency,
        transfers: item.transfers || 0,
        airline: item.airline,
        flightNumber: String(item.flight_number || ''),
        departureAt: item.departure_at,
        returnAt: item.return_at || null,
      }),
    );

    cacheService.set(cacheKey, entries, CACHE_TTL);
    return entries;
  },

  async getPopularDirections(origin: string, currency?: string): Promise<PopularDirection[]> {
    const cacheKey = `flights:popular:${origin}:${currency || config.defaultCurrency}`;
    const cached = cacheService.get<PopularDirection[]>(cacheKey);
    if (cached) return cached;

    const { data } = await tpClient.get('/v1/city-directions', {
      params: {
        origin,
        currency: currency || config.defaultCurrency,
        token: config.tp.apiToken,
      },
    });

    if (!data.success) return [];

    const directions: PopularDirection[] = Object.entries(data.data as Record<string, any>).map(
      ([destCode, item]: [string, any]) => ({
        destination: { code: destCode, cityCode: destCode, name: destCode },
        price: { amount: item.price, currency: data.currency || config.defaultCurrency },
        airline: {
          code: item.airline,
          name: item.airline,
          logoUrl: airlineLogoUrl(item.airline),
        },
        departureAt: item.departure_at,
        returnAt: item.return_at || null,
        transfers: item.transfers || 0,
      }),
    );

    cacheService.set(cacheKey, directions, 3600);
    return directions;
  },
};

function buildAffiliateLink(item: any): string {
  if (!config.tp.marker) return '';
  const link = item.link || '';
  return `https://www.aviasales.ru${link}&marker=${config.tp.marker}`;
}
