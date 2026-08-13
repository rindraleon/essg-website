import type { LucideIcon } from 'lucide-react';
import {
  Folder,
  GraduationCap,
  Handshake,
  LayoutDashboard,
  Mail,
  Newspaper,
  ScrollText,
  UserCheck,
  Users,
} from 'lucide-react';
import { routesStatic } from '../routes';

export interface NavItem {
  name: string;
  label: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { name: 'Tableau de bord', label: 'Accueil', href: routesStatic.dashboard, icon: LayoutDashboard },
  { name: 'Actualités', label: 'Actualités', href: routesStatic.actualites, icon: Newspaper },
  { name: 'Formations', label: 'Formations', href: routesStatic.formations, icon: GraduationCap },
  { name: 'Projets', label: 'Projets', href: routesStatic.projets, icon: Folder },
  { name: 'Partenaires', label: 'Partenaires', href: routesStatic.partenaires, icon: Handshake },
  { name: 'Contacts', label: 'Contacts', href: routesStatic.contacts, icon: Mail },
  { name: 'Admissions', label: 'Admissions', href: routesStatic.admissions, icon: UserCheck },
  {
    name: 'Ressources Humaines',
    label: 'Ressources',
    href: routesStatic.ressourcesHumaines,
    icon: Users,
  },
  { name: 'Utilisateurs', label: 'Utilisateurs', href: routesStatic.utilisateurs, icon: Users },
  {
    name: 'Journal',
    label: 'Journal',
    href: routesStatic.activityLogs,
    icon: ScrollText,
    adminOnly: true,
  },
];

export const isNavActive = (href: string, pathname: string): boolean => {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }
  return pathname.startsWith(href);
};

export const PRIMARY_NAV_LABELS = ['Tableau de bord', 'Formations', 'Actualités', 'Projets'];

export const getVisibleNavItems = (role?: string): NavItem[] =>
  NAV_ITEMS.filter((item) => !item.adminOnly || role === 'admin');
