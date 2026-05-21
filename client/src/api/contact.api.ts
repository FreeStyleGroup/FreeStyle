import { apiClient } from './client';
import type { ContactRequest, ContactResponse } from '@freestyle/shared';

export const contactApi = {
  async submit(payload: ContactRequest): Promise<ContactResponse> {
    const { data } = await apiClient.post<ContactResponse>('/contact', payload);
    return data;
  },
};
