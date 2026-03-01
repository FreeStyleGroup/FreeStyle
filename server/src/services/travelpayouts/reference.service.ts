import axios from 'axios';
import { cacheService } from '../cache.service.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import type { Airport, City, Country, Airline, AutocompleteItem } from '@freestyle/shared';

const REFERENCE_TTL = config.cache.referenceTtl;
const BASE_URL = config.tp.apiBaseUrl;

export const referenceService = {
  async getAirports(lang = 'ru'): Promise<Airport[]> {
    const cacheKey = `ref:airports:${lang}`;
    const cached = cacheService.get<Airport[]>(cacheKey);
    if (cached) return cached;

    const { data } = await axios.get(`${BASE_URL}/data/${lang}/airports.json`);

    const airports: Airport[] = data
      .filter((a: any) => a.code && a.name)
      .map((a: any) => ({
        code: a.code,
        name: a.name,
        cityCode: a.city_code || '',
        cityName: '',
        countryCode: a.country_code || '',
        countryName: '',
        coordinates: a.coordinates || { lat: 0, lon: 0 },
        timeZone: a.time_zone || '',
      }));

    cacheService.set(cacheKey, airports, REFERENCE_TTL);
    return airports;
  },

  async getCities(lang = 'ru'): Promise<City[]> {
    const cacheKey = `ref:cities:${lang}`;
    const cached = cacheService.get<City[]>(cacheKey);
    if (cached) return cached;

    const { data } = await axios.get(`${BASE_URL}/data/${lang}/cities.json`);

    const cities: City[] = data
      .filter((c: any) => c.code && c.name)
      .map((c: any) => ({
        code: c.code,
        name: c.name,
        countryCode: c.country_code || '',
        countryName: '',
        coordinates: c.coordinates || { lat: 0, lon: 0 },
        timeZone: c.time_zone || '',
      }));

    cacheService.set(cacheKey, cities, REFERENCE_TTL);
    return cities;
  },

  async getCountries(lang = 'ru'): Promise<Country[]> {
    const cacheKey = `ref:countries:${lang}`;
    const cached = cacheService.get<Country[]>(cacheKey);
    if (cached) return cached;

    const { data } = await axios.get(`${BASE_URL}/data/${lang}/countries.json`);

    const countries: Country[] = data
      .filter((c: any) => c.code && c.name)
      .map((c: any) => ({
        code: c.code,
        name: c.name,
        currency: c.currency || '',
      }));

    cacheService.set(cacheKey, countries, REFERENCE_TTL);
    return countries;
  },

  async getAirlines(lang = 'ru'): Promise<Airline[]> {
    const cacheKey = `ref:airlines:${lang}`;
    const cached = cacheService.get<Airline[]>(cacheKey);
    if (cached) return cached;

    const { data } = await axios.get(`${BASE_URL}/data/${lang}/airlines.json`);

    const airlines: Airline[] = data
      .filter((a: any) => a.code && a.name)
      .map((a: any) => ({
        code: a.code,
        name: a.name,
        isLowCost: a.is_lowcost || false,
        logoUrl: `https://pics.avs.io/100/40/${a.code}.png`,
      }));

    cacheService.set(cacheKey, airlines, REFERENCE_TTL);
    return airlines;
  },

  async autocomplete(query: string, lang = 'ru'): Promise<AutocompleteItem[]> {
    if (!query || query.length < 2) return [];

    const q = query.toLowerCase();
    const results: AutocompleteItem[] = [];

    const [airports, cities] = await Promise.all([
      this.getAirports(lang),
      this.getCities(lang),
    ]);

    // Search cities first
    for (const city of cities) {
      if (
        city.name?.toLowerCase().includes(q) ||
        city.code?.toLowerCase() === q
      ) {
        results.push({
          type: 'city',
          code: city.code,
          name: city.name,
          cityName: city.name,
          countryName: city.countryCode,
          countryCode: city.countryCode,
        });
      }
      if (results.length >= 5) break;
    }

    // Then airports
    for (const airport of airports) {
      if (
        airport.name?.toLowerCase().includes(q) ||
        airport.code?.toLowerCase() === q ||
        airport.cityCode?.toLowerCase() === q
      ) {
        results.push({
          type: 'airport',
          code: airport.code,
          name: airport.name,
          cityName: airport.cityCode,
          countryName: airport.countryCode,
          countryCode: airport.countryCode,
        });
      }
      if (results.length >= 10) break;
    }

    return results.slice(0, 10);
  },

  async warmCache(): Promise<void> {
    logger.info('Warming reference data cache...');
    try {
      await Promise.all([
        this.getAirports('ru'),
        this.getCities('ru'),
        this.getCountries('ru'),
        this.getAirlines('ru'),
      ]);
      logger.info('Reference data cache warmed successfully');
    } catch (error) {
      logger.error(error, 'Failed to warm reference data cache');
    }
  },
};
