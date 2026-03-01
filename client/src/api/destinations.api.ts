import { apiClient } from './client';
import { staticDestinations } from '@/data/destinations';
import type { Destination, ApiResponse } from '@freestyle/shared';

export const destinationsApi = {
  async getAll(): Promise<Destination[]> {
    try {
      const { data } = await apiClient.get<ApiResponse<Destination[]>>('/destinations');
      return data.data;
    } catch {
      return staticDestinations;
    }
  },

  async getBySlug(slug: string): Promise<Destination> {
    try {
      const { data } = await apiClient.get<ApiResponse<Destination>>(`/destinations/${slug}`);
      return data.data;
    } catch {
      const dest = staticDestinations.find((d) => d.slug === slug);
      if (!dest) throw new Error('Destination not found');
      return dest;
    }
  },
};
