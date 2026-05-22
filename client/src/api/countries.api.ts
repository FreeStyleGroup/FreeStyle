import { apiClient } from './client';
import { isPreview, mockCountries } from '@/lib/preview';
import type { CountryListItem, CountryDto } from '@freestyle/shared';

interface List<T> { success: true; items: T[] }

async function pv<T>(real: () => Promise<T>, mock: () => T): Promise<T> {
  if (isPreview()) {
    try { return await real(); } catch { return mock(); }
  }
  return real();
}

export const countriesApi = {
  list: () => pv<CountryListItem[]>(
    async () => (await apiClient.get<List<CountryListItem>>('/countries')).data.items,
    () => mockCountries,
  ),

  async getBySlug(slug: string): Promise<CountryDto | null> {
    try {
      const { data } = await apiClient.get<{ success: true; country: CountryDto }>(`/countries/${encodeURIComponent(slug)}`);
      return data.country;
    } catch {
      if (isPreview()) {
        const item = mockCountries.find((c) => c.slug === slug) ?? mockCountries[0];
        return {
          ...item,
          longDescription: 'В preview-режиме здесь будет подробное описание страны (несколько параграфов). После деплоя бэкенда — реальный контент из кураторского справочника.',
        };
      }
      return null;
    }
  },
};
