import React from 'react';
import { Link } from 'react-router-dom';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}


const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Fil d'Ariane" className="border-ink-100">
      <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto scrollbar-hide px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-ink-600 transition-colors hover:text-brand-700"
        >
          <HomeRoundedIcon sx={{ fontSize: 16 }} aria-hidden="true" />
          <span className="hidden sm:inline">Accueil</span>
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <ChevronRightRoundedIcon
                sx={{ fontSize: 16 }}
                className="shrink-0 text-ink-300"
                aria-hidden="true"
              />

              {isLast || !item.to ? (
                <span
                  className="truncate text-sm font-medium text-ink-900"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="shrink-0 text-sm font-medium text-ink-600 transition-colors hover:text-brand-700"
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumb;
