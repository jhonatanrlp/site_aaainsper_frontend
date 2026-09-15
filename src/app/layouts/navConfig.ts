import { LayoutDashboard, ShieldCheck, ShoppingBag, Trophy, User, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Role } from '../../features/auth/types.js';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  roles: Role[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Meu perfil', path: '/sistema/atleta', icon: User, roles: ['atleta', 'dm', 'gestao'] },
  { label: 'Minha modalidade', path: '/sistema/dm', icon: Users, roles: ['dm', 'gestao'] },
  { label: 'Gestão', path: '/sistema/gestao', icon: LayoutDashboard, roles: ['gestao'] },
  { label: 'Loja', path: '/sistema/loja', icon: ShoppingBag, roles: ['atleta', 'dm', 'gestao'] },
  { label: 'ECONO', path: '/sistema/econo', icon: Trophy, roles: ['dm', 'gestao'] },
  { label: 'Auditoria', path: '/sistema/auditoria', icon: ShieldCheck, roles: ['gestao'] },
];

export function navItemsForRole(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

export const ROLE_LABEL: Record<Role, string> = {
  atleta: 'Atleta',
  dm: 'Diretor de Modalidade',
  gestao: 'Gestão',
};
