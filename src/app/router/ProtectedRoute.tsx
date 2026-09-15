import { Navigate } from 'react-router';
import type { ReactNode } from 'react';
import { LoadingScreen } from '../../components/feedback/LoadingScreen.js';
import { ErrorScreen } from '../../components/feedback/ErrorScreen.js';
import { useAuth } from '../../features/auth/AuthContext.js';
import type { Role } from '../../features/auth/types.js';

// UX-only gating — the real authorization check happens server-side on
// every request. This just avoids flashing screens the viewer has no
// business seeing and redirects them somewhere useful.
export function ProtectedRoute({ allow, children }: { allow?: Role[]; children: ReactNode }) {
  const { state, refreshProfile } = useAuth();

  if (state.status === 'loading') return <LoadingScreen label="Verificando sessão…" />;
  if (state.status === 'error') {
    return <ErrorScreen message={state.message} onRetry={() => void refreshProfile()} />;
  }
  if (state.status === 'unauthenticated') return <Navigate to="/login" replace />;

  if (!state.profile.profileComplete) {
    return <Navigate to="/completar-perfil" replace />;
  }

  if (allow && !allow.includes(state.profile.role)) {
    return <Navigate to="/sistema/atleta" replace />;
  }

  return children;
}
