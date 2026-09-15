import { LogOut, Menu } from 'lucide-react';
import { Avatar } from '../../components/ui/avatar.js';
import { Badge } from '../../components/ui/badge.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu.js';
import { useAuth } from '../../features/auth/AuthContext.js';
import type { AuthProfile } from '../../features/auth/types.js';
import { ROLE_LABEL } from './navConfig.js';

export function Header({
  title,
  profile,
  onOpenSidebar,
}: {
  title: string;
  profile: AuthProfile;
  onOpenSidebar: () => void;
}) {
  const { signOut } = useAuth();
  const displayName = profile.fullName ?? profile.email;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[var(--color-border)] bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-md p-2 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-muted)] md:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-lg font-semibold text-[var(--color-ink)]">{title}</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 rounded-full py-1 pl-1 pr-3 outline-none transition-colors hover:bg-[var(--color-surface-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand-600)]">
          <Avatar name={displayName} />
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-tight text-[var(--color-ink)]">
              {displayName}
            </p>
            <p className="text-xs leading-tight text-[var(--color-ink-subtle)]">
              {ROLE_LABEL[profile.role]}
            </p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="space-y-1">
              <p className="text-[var(--color-ink)]">{displayName}</p>
              <p className="font-normal text-[var(--color-ink-subtle)]">{profile.email}</p>
              <Badge variant="brand">{ROLE_LABEL[profile.role]}</Badge>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              void signOut();
            }}
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
