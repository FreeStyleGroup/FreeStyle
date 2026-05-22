import { apiClient } from './client';
import { isPreview, mockDashboard, mockBookingsList, mockFavorites, mockDocuments, mockWalletSummary, mockWalletTxns, mockReferral, mockSessions, mockUser } from '@/lib/preview';
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

/** Helper: вызывает реальный API, при ошибке в preview-режиме возвращает mock. */
async function pv<T>(real: () => Promise<T>, mock: () => T): Promise<T> {
  if (isPreview()) {
    try { return await real(); } catch { return mock(); }
  }
  return real();
}

export const cabinetApi = {
  dashboard: () => pv<CabinetDashboardDto>(
    async () => (await apiClient.get<{ success: true } & CabinetDashboardDto>('/cabinet/dashboard')).data,
    mockDashboard,
  ),

  listBookings: () => pv<BookingSummaryDto[]>(
    async () => (await apiClient.get<List<BookingSummaryDto>>('/cabinet/bookings')).data.items,
    () => mockBookingsList,
  ),

  listFavorites: () => pv<FavoriteDto[]>(
    async () => (await apiClient.get<List<FavoriteDto>>('/cabinet/favorites')).data.items,
    () => mockFavorites,
  ),

  async removeFavorite(type: FavoriteDto['type'], refId: string): Promise<void> {
    if (isPreview()) return;
    await apiClient.delete(`/cabinet/favorites/${type}/${encodeURIComponent(refId)}`);
  },

  listDocuments: () => pv<DocumentDto[]>(
    async () => (await apiClient.get<List<DocumentDto>>('/cabinet/documents')).data.items,
    () => mockDocuments,
  ),

  async createDocument(payload: CreateDocumentRequest): Promise<DocumentDto> {
    if (isPreview()) {
      return { id: 'preview-new', type: payload.type, name: payload.name, number: payload.number ?? null, issuedAt: payload.issuedAt ?? null, expiresAt: payload.expiresAt ?? null, countryCode: payload.countryCode ?? null, fileUrl: payload.fileUrl ?? null, meta: payload.meta ?? {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    }
    const { data } = await apiClient.post<{ success: true; document: DocumentDto }>('/cabinet/documents', payload);
    return data.document;
  },

  async updateDocument(id: string, payload: UpdateDocumentRequest): Promise<DocumentDto> {
    if (isPreview()) return mockDocuments[0];
    const { data } = await apiClient.patch<{ success: true; document: DocumentDto }>(`/cabinet/documents/${id}`, payload);
    return data.document;
  },

  async deleteDocument(id: string): Promise<void> {
    if (isPreview()) return;
    await apiClient.delete(`/cabinet/documents/${id}`);
  },

  walletSummary: () => pv<WalletSummaryDto>(
    async () => (await apiClient.get<{ success: true } & WalletSummaryDto>('/cabinet/wallet')).data,
    mockWalletSummary,
  ),

  walletTransactions: (kind?: 'miles' | 'cashback') => pv<WalletTxnDto[]>(
    async () => (await apiClient.get<List<WalletTxnDto>>('/cabinet/wallet/transactions', { params: kind ? { kind } : undefined })).data.items,
    () => kind ? mockWalletTxns.filter((t) => t.kind === kind) : mockWalletTxns,
  ),

  referral: () => pv<ReferralStatsDto>(
    async () => (await apiClient.get<{ success: true } & ReferralStatsDto>('/cabinet/referral')).data,
    mockReferral,
  ),

  async updateProfile(payload: UpdateProfileRequest): Promise<UserDto> {
    if (isPreview()) return { ...mockUser('admin'), name: payload.name ?? mockUser('admin').name, phone: payload.phone ?? null, avatarUrl: payload.avatarUrl ?? null };
    const { data } = await apiClient.patch<{ success: true; user: UserDto }>('/cabinet/profile', payload);
    return data.user;
  },

  async updateSettings(payload: UpdateSettingsRequest): Promise<UserDto> {
    if (isPreview()) return { ...mockUser('admin'), locale: payload.locale ?? 'ru', currency: payload.currency ?? 'rub', marketingOptIn: payload.marketingOptIn ?? false };
    const { data } = await apiClient.patch<{ success: true; user: UserDto }>('/cabinet/settings', payload);
    return data.user;
  },

  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    if (isPreview()) return;
    await apiClient.post('/cabinet/change-password', payload);
  },

  listSessions: () => pv<SessionDto[]>(
    async () => (await apiClient.get<List<SessionDto>>('/cabinet/sessions')).data.items,
    () => mockSessions,
  ),

  async revokeSession(id: string): Promise<void> {
    if (isPreview()) return;
    await apiClient.delete(`/cabinet/sessions/${id}`);
  },
};
