import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { bootstrapSession, signOut as signOutRequest } from './authApi.js';
import { supabaseAuth } from '../../lib/supabaseAuth.js';
import type { AuthState } from './types.js';

interface AuthContextValue {
  state: AuthState;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  const loadProfile = useCallback(async () => {
    try {
      const profile = await bootstrapSession();
      setState({ status: 'authenticated', profile });
    } catch {
      setState({
        status: 'error',
        message: 'Não foi possível carregar seu perfil. Tente novamente.',
      });
    }
  }, []);

  useEffect(() => {
    let active = true;

    supabaseAuth.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) {
        void loadProfile();
      } else {
        setState({ status: 'unauthenticated' });
      }
    });

    const { data: subscription } = supabaseAuth.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === 'SIGNED_OUT') {
        setState({ status: 'unauthenticated' });
      } else if (session) {
        void loadProfile();
      }
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await signOutRequest();
    setState({ status: 'unauthenticated' });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ state, signOut, refreshProfile: loadProfile }),
    [state, signOut, loadProfile],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
