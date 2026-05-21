import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import { Loader2, ShieldAlert } from 'lucide-react';
import type { UserRole } from '@freestyle/shared';

/**
 * RBAC-гард. Должен оборачиваться внутри AuthGuard (или включает его сам через redirect).
 * Если у юзера нет ни одной из allowed ролей — показывает "403"-стейт с пояснением.
 */
export function RoleGuard({ allowed, children }: { allowed: UserRole[]; children: ReactNode }) {
  const { user, isAuthenticated, isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (!allowed.includes(user.role)) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <ShieldAlert className="w-14 h-14 mx-auto text-brand-600" />
        <h1 className="font-display font-extrabold text-2xl mt-6 text-ink-900">Доступ закрыт</h1>
        <p className="text-ink-500 mt-2">
          У вашей учётной записи нет прав для этого раздела. Если вам нужен доступ — обратитесь к администратору.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
