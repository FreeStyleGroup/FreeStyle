/**
 * DTO для кабинета. Все строки даты — ISO 8601 (как и в UserDto).
 */

import type { Locale, Currency, UserDto } from './auth';

export type UserTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type DocumentType =
  | 'passport'
  | 'foreign_passport'
  | 'visa'
  | 'id_card'
  | 'driver_license'
  | 'photo'
  | 'other';

export type WalletKind = 'miles' | 'cashback';
export type WalletTxnType = 'accrual' | 'spend' | 'refund' | 'manual_adjustment' | 'expired';

export interface DocumentDto {
  id: string;
  type: DocumentType;
  name: string;
  number: string | null;
  issuedAt: string | null;
  expiresAt: string | null;
  countryCode: string | null;
  fileUrl: string | null;
  meta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTxnDto {
  id: string;
  kind: WalletKind;
  type: WalletTxnType;
  amount: string;
  currency: Currency | null;
  description: string;
  bookingId: string | null;
  createdAt: string;
}

export interface WalletSummaryDto {
  tier: UserTier;
  milesBalance: number;
  cashbackBalance: string;
  nextTier: UserTier | null;
  /** Сколько миль не хватает до следующего тира. null если уже platinum. */
  milesToNextTier: number | null;
  recentTransactions: WalletTxnDto[];
}

export interface ReferralStatsDto {
  code: string;
  shareUrl: string;
  signupsCount: number;
  bookingsCount: number;
  totalMilesEarned: number;
  recentRedemptions: Array<{
    invitedName: string;
    invitedAt: string;
    awardedAt: string | null;
    milesAwarded: number;
  }>;
}

export interface BookingSummaryDto {
  id: string;
  publicId: string;
  type: 'flight' | 'hotel' | 'tour' | 'visa' | 'transfer' | 'insurance';
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'completed' | 'refunded';
  amount: string;
  currency: Currency;
  /** Произвольное заголовочное представление: "Москва → Стамбул, 12 марта" */
  title: string;
  startsAt: string | null;
  createdAt: string;
}

export interface FavoriteDto {
  type: 'flight' | 'hotel' | 'destination' | 'post' | 'tour';
  refId: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface SessionDto {
  id: string;
  userAgent: string | null;
  ip: string | null;
  createdAt: string;
  expiresAt: string;
  /** True если эта сессия — текущая (где пользователь открыл /cabinet) */
  isCurrent: boolean;
}

export interface CabinetDashboardDto {
  user: UserDto;
  wallet: Pick<WalletSummaryDto, 'tier' | 'milesBalance' | 'cashbackBalance' | 'milesToNextTier' | 'nextTier'>;
  upcomingTrips: BookingSummaryDto[];
  documentsCount: number;
  favoritesCount: number;
  expiringDocuments: Array<{ id: string; name: string; expiresAt: string }>;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

export interface UpdateSettingsRequest {
  locale?: Locale;
  currency?: Currency;
  marketingOptIn?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateDocumentRequest {
  type: DocumentType;
  name: string;
  number?: string;
  issuedAt?: string;
  expiresAt?: string;
  countryCode?: string;
  fileUrl?: string;
  meta?: Record<string, unknown>;
}

export interface UpdateDocumentRequest extends Partial<CreateDocumentRequest> {}
