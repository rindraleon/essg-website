import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import { routesStatic } from '../../routes';

interface BreadcrumbItem {
  to: string;
  label: string;
  isLast: boolean;
}

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbMap: Record<string, string> = {
    home: 'Accueil',
    dashboard: 'Tableau de bord',
    actualites: 'Actualités',
    formations: 'Formations',
    projets: 'Projets',
    partenaires: 'Partenaires',
    contacts: 'Contacts',
    admissions: 'Admissions',
    example: 'Example',
    profil: 'Profil',
    parametres: 'Paramètres',
    messages: 'Messages',
    notifications: 'Notifications',
  };

  const breadcrumbs: BreadcrumbItem[] = pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;
    const label = breadcrumbMap[value] || value;

    return {
      to,
      label,
      isLast,
    };
  });

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-500 mb-4">
      <Link
        to={routesStatic.home}
        className="flex items-center hover:text-indigo-600 transition-colors"
      >
        <HomeIcon sx={{ fontSize: 16, mr: 0.5 }} />
        Accueil
      </Link>
      {breadcrumbs.map((crumb) => (
        <React.Fragment key={crumb.to}>
          <ChevronRightIcon sx={{ fontSize: 16 }} />
          {crumb.isLast ? (
            <span className="text-gray-900 font-medium truncate max-w-[200px]" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.to}
              className="hover:text-indigo-600 transition-colors truncate max-w-[150px]"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
