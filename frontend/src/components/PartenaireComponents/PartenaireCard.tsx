import React, { useState } from 'react';
import { getImageUrl } from '../../utils/image.utils';
import ViewDetailsButton from '../common/ViewDetailsButton';
import type { PartenaireCardProps } from '../../types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';

const PartenaireCard: React.FC<PartenaireCardProps> = (props: Readonly<PartenaireCardProps>) => {
  const { partenaire } = props;
  const [, setImageLoaded] = useState(false);
  const [, setImageError] = useState(false);

  const logoUrl = partenaire.logo ? getImageUrl(partenaire.logo) : FALLBACK_IMAGE;

  return (
    <article
      data-gsap
      className="group rounded-xl overflow-hidden border border-ink-100 bg-white shadow-card hover:shadow-card-hover hover:-translate-y-1.5 hover:border-brand-100 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-ink-100">
        <img
          src={logoUrl}
          alt={`${partenaire.nom} logo`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(false)}
        />
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <p className="text-sm font-semibold text-brand-600 mb-4">{partenaire.type}</p>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-ink-900 mb-1 leading-snug">
          {partenaire.nom}
        </h3>

        {partenaire.secteur && (
          <p className="text-sm text-ink-500 line-clamp-3 flex-1 leading-6 mb-4">
            {partenaire.secteur}
          </p>
        )}

        <div className="mt-auto space-y-2">
          {partenaire.siteWeb && (
            <p className="text-xs text-ink-500 flex items-start gap-2 break-all">
              <svg
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              <span>{partenaire.siteWeb}</span>
            </p>
          )}

          {partenaire.contact && (
            <p className="text-xs text-ink-500 flex items-start gap-2">
              <svg
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>{partenaire.contact}</span>
            </p>
          )}
        </div>

        <ViewDetailsButton
          to={`/partenaires/${partenaire.slug ?? partenaire.nom.toLowerCase().replace(/\s+/g, '-')}`}
          ariaLabel={`Voir le détail de ${partenaire.nom}`}
        />
      </div>
    </article>
  );
};

export default PartenaireCard;