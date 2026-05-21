import { apiClient } from './client';
import type {
  CabinetDashboardDto,
  BookingSummaryDto,
  FavoriteDto,
  DocumentDto,
  WalletSummaryDto,
  WalletTxnDto,
  ReferralStatsDto,
  SessionDto,
  UpdateProfileRequest,
  UpdateSettingsRequest,
  ChangePasswordRequest,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  UserDto,
} from '@freestyle/shared';

interface List<T> { success: true; items: T[] }

export const cabinetApi = {
  async dashboard(): Promise<CabinetDashboardDto> {
    const { data } = await apiClient.get<{ success: true } & CabinetDashboardDto>('/cabinet/dashboard');
    return data;
  },

  async listBookings(): Promise<BookingSummaryDto[]> {
    const { data } = await apiClient.get<List<BookingSummaryDto>>('/cabinet/bookings');
    return data.items;
  },

  async listFavorites(): Promise<FavoriteDto[]> {
    const { data } = await apiClient.get<List<FavoriteDto>>('/cabinet/favorites');
    return data.items;
  },

  async removeFavorite(type: FavoriteDto['type'], refId: string): Promise<void> {
    await apiClient.delete(`/cabinet/favorites/${type}/${encodeURIComponent(refId)}`);
  },

  async listDocuments(): Promise<DocumentDto[]> {
    const { data } = await apiClient.get<List<DocumentDto>>('/cabinet/documents');
    return data.items;
  },

  async createDocument(payload: CreateDocumentRequest): Promise<DocumentDto> {
    const { data } = await apiClient.post<{ success: true; document: DocumentDto }>('/cabinet/documents', payload);
    return data.document;
  },

  async updateDocument(id: string, payload: UpdateDocumentRequest): Promise<DocumentDto> {
    const { data } = await apiClient.patch<{ success: true; document: DocumentDto }>(`/cabinet/documents/${id}`, payload);
    return data.document;
  },

  async deleteDocument(id: string): Promise<void> {
    await apiClient.delete(`/cabinet/documents/${id}`);
  },

  async walletSummary(): Promise<WalletSummaryDto> {
    const { data } = await apiClient.get<{ success: true } & WalletSummaryDto>('/cabinet/wallet');
    return data;
  },

  async walletTransactions(kind?: 'miles' | 'cashback'): Promise<WalletTxnDto[]> {
    const { data } = await apiClient.get<List<WalletTxnDto>>('/cabinet/wallet/transactions', {
      params: kind ? { kind } : undefined,
    });
    return data.items;
  },

  async referral(): Promise<ReferralStatsDto> {
    const { data } = await apiClient.get<{ success: true } & ReferralStatsDto>('/cabinet/referral');
    return data;
  },

  async updateProfile(payload: UpdateProfileRequest): Promise<UserDto> {
    const { data } = await apiClient.patch<{ success: true; user: UserDto }>('/cabinet/profile', payload);
    return data.user;
  },

  async updateSettings(payload: UpdateSettingsRequest): Promise<UserDto> {
    const { data } = await apiClient.patch<{ success: true; user: UserDto }>('/cabinet/settings', payload);
    return data.user;
  },

  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    await apiClient.post('/cabinet/change-password', payload);
  },

  async listSessions(): Promise<SessionDto[]> {
    const { data } = await apiClient.get<List<SessionDto>>('/cabinet/sessions');
    return data.items;
  },

  async revokeSession(id: string): Promise<void> {
    await apiClient.delete(`/cabinet/sessions/${id}`);
  },
};
