import { Navigate, Route, Routes } from 'react-router';
import { AppShell } from '../layouts/AppShell.js';
import { AthletePage } from '../../features/athletes/AthletePage.js';
import { CompleteProfilePage } from '../../features/auth/CompleteProfilePage.js';
import { LoginPage } from '../../features/auth/LoginPage.js';
import { UnderConstructionPage } from '../../components/feedback/UnderConstructionPage.js';
import { ProtectedRoute } from './ProtectedRoute.js';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/completar-perfil"
        element={
          <ProtectedRoute>
            <CompleteProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sistema"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="atleta" replace />} />
        <Route path="atleta" element={<AthletePage />} />
        <Route
          path="dm"
          element={
            <ProtectedRoute allow={['dm', 'gestao']}>
              <UnderConstructionPage label="Minha modalidade" />
            </ProtectedRoute>
          }
        />
        <Route
          path="gestao"
          element={
            <ProtectedRoute allow={['gestao']}>
              <UnderConstructionPage label="Gestão" />
            </ProtectedRoute>
          }
        />
        <Route path="loja" element={<UnderConstructionPage label="Loja" />} />
        <Route
          path="econo"
          element={
            <ProtectedRoute allow={['dm', 'gestao']}>
              <UnderConstructionPage label="ECONO" />
            </ProtectedRoute>
          }
        />
        <Route
          path="auditoria"
          element={
            <ProtectedRoute allow={['gestao']}>
              <UnderConstructionPage label="Auditoria" />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
