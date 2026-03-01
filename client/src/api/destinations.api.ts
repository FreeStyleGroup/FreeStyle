import { apiClient } from './client';
import type { Destination, ApiResponse } from '@freestyle/shared';

export const destinationsApi = {
  async getAll(): Promise<Destination[]> {
    const { data } = await apiClient.get<ApiResponse<Destination[]>>('/destinations');
    return data.data;
  },

  async getBySlug(slug: string): Promise<Destination> {
    const { data } = await apiClient.get<ApiResponse<Destination>>(`/destinations/${slug}`);
    return data.data;
  },
};
