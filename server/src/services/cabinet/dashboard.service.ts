import { bookingsService } from './bookings.service.js';
import { documentsService } from './documents.service.js';
import { favoritesService } from './favorites.service.js';
import { walletService } from './wallet.service.js';
import { authService } from '../auth/auth.service.js';
import type { CabinetDashboardDto } from '@freestyle/shared';

export const dashboardService = {
  async build(userId: string): Promise<CabinetDashboardDto> {
    const [user, wallet, upcomingTrips, documents, favoritesCount, expiring] = await Promise.all([
      authService.getById(userId),
      walletService.getSummary(userId),
      bookingsService.listUpcoming(userId),
      documentsService.list(userId),
      favoritesService.count(userId),
      documentsService.listExpiringSoon(userId, 90),
    ]);
    if (!user) throw new Error('User not found');
    return {
      user,
      wallet: {
        tier: wallet.tier,
        milesBalance: wallet.milesBalance,
        cashbackBalance: wallet.cashbackBalance,
        nextTier: wallet.nextTier,
        milesToNextTier: wallet.milesToNextTier,
      },
      upcomingTrips: upcomingTrips.slice(0, 5),
      documentsCount: documents.length,
      favoritesCount,
      expiringDocuments: expiring.slice(0, 3).map((d) => ({
        id: d.id,
        name: d.name,
        expiresAt: d.expiresAt!,
      })),
    };
  },
};
