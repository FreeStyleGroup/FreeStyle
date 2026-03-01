import { apiClient } from './client';
import type { AutocompleteItem, ApiResponse } from '@freestyle/shared';

export const referenceApi = {
  async autocomplete(query: string, lang = 'ru'): Promise<AutocompleteItem[]> {
    const { data } = await apiClient.get<ApiResponse<AutocompleteItem[]>>('/reference/autocomplete', {
      params: { q: query, lang },
    });
    return data.data;
  },
};
