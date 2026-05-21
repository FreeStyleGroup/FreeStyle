import { apiClient } from './client';
import type { CountryListItem, CountryDto } from '@freestyle/shared';

interface List<T> { success: true; items: T[] }

export const countriesApi = {
  async list(): Promise<CountryListItem[]> {
    const { data } = await apiClient.get<List<CountryListItem>>('/countries');
    return data.items;
  },

  async getBySlug(slug: string): Promise<CountryDto | null> {
    try {
      const { data } = await apiClient.get<{ success: true; country: CountryDto }>(`/countries/${encodeURIComponent(slug)}`);
      return data.country;
    } catch {
      return null;
    }
  },
};
