import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import { Loader2 } from 'lucide-react';

/**
 * Защищённый роут: ждёт hydration, потом либо рендерит детей, либо редиректит
 * на главную с return-to в state (модал входа можно открыть на главной).
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isHydrated } = useAuth();
  const location = useLocation();

  if (!isHydrated) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location.pathname, requireAuth: true }} replace />;
  }

  return <>{children}</>;
}
