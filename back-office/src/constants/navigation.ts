import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import SchoolIcon from '@mui/icons-material/School';
import FolderIcon from '@mui/icons-material/Folder';
import HandshakeIcon from '@mui/icons-material/Handshake';
import MailIcon from '@mui/icons-material/Mail';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PeopleIcon from '@mui/icons-material/People';
import { routesStatic } from '../routes';

export interface NavItem {
  name: string;
  label: string;
  href: string;
  icon: typeof DashboardIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { name: 'Tableau de bord', label: 'Accueil', href: routesStatic.dashboard, icon: DashboardIcon },
  { name: 'Actualités', label: 'Actualités', href: routesStatic.actualites, icon: ArticleIcon },
  { name: 'Formations', label: 'Formations', href: routesStatic.formations, icon: SchoolIcon },
  { name: 'Projets', label: 'Projets', href: routesStatic.projets, icon: FolderIcon },
  {
    name: 'Partenaires',
    label: 'Partenaires',
    href: routesStatic.partenaires,
    icon: HandshakeIcon,
  },
  { name: 'Contacts', label: 'Contacts', href: routesStatic.contacts, icon: MailIcon },
  { name: 'Admissions', label: 'Admissions', href: routesStatic.admissions, icon: HowToRegIcon },
  {
    name: 'Ressources Humaines',
    label: 'Ressources',
    href: routesStatic.ressourcesHumaines,
    icon: PeopleIcon,
  },
  {
    name: 'Utilisateurs',
    label: 'Utilisateurs',
    href: routesStatic.utilisateurs,
    icon: PeopleIcon,
  },
];

export const isNavActive = (href: string, pathname: string): boolean => {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }
  return pathname.startsWith(href);
};


export const PRIMARY_NAV_LABELS = ['Tableau de bord', 'Formations', 'Actualités', 'Projets'];
