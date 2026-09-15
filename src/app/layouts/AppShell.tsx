import { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useAuth } from '../../features/auth/AuthContext.js';
import { LoadingScreen } from '../../components/feedback/LoadingScreen.js';
import { NAV_ITEMS } from './navConfig.js';
import { Header } from './Header.js';
import { Sidebar } from './Sidebar.js';

function currentPageTitle(pathname: string): string {
  const match = NAV_ITEMS.find((item) => pathname.startsWith(item.path));
  return match?.label ?? 'Sistema';
}

export function AppShell() {
  const { state } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (state.status !== 'authenticated') {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar role={state.profile.role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={currentPageTitle(location.pathname)}
          profile={state.profile}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto bg-[var(--color-surface-muted)] p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
