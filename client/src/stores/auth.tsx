import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi } from '@/api/auth.api';
import type { UserDto } from '@freestyle/shared';

/**
 * Глобальный auth-стор: контекст + хук useAuth().
 *
 * - При маунте AuthProvider дёргает /auth/me чтобы восстановить сессию из cookie.
 * - login()/register() заполняют user после успешной API-ответы.
 * - logout() чистит state + дёргает /auth/logout.
 *
 * isHydrated отделяет «ещё не проверили» от «гарантированно не залогинен» —
 * чтобы UI не моргал между «гость → юзер» при F5.
 */

interface AuthContextValue {
  user: UserDto | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setUser: (user: UserDto | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const me = await authApi.me();
      if (!cancelled) {
        setUser(me);
        setIsHydrated(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isHydrated,
      setUser,
      logout: async () => {
        try { await authApi.logout(); } catch { /* ignore */ }
        setUser(null);
      },
    }),
    [user, isHydrated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
