import React, { useState } from 'react';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { getImageUrl } from '../../utils/image.utils';
import type { RessourceHumaine } from '../../types/ressource-humaine.types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';

const RessourceHumaineCard: React.FC<{ ressourceHumaine: RessourceHumaine }> = (props) => {
  const { ressourceHumaine } = props;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const photoUrl = ressourceHumaine.photo ? getImageUrl(ressourceHumaine.photo) : FALLBACK_IMAGE;
  const fullName = `${ressourceHumaine.prenom} ${ressourceHumaine.nom}`;

  return (
    <article
      className="group rounded-xl overflow-hidden border border-ink-100 bg-white shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-ink-100">
        <img
          src={photoUrl}
          alt={fullName}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(false)}
        />
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <p className="text-sm font-semibold text-brand-600 mb-4">{ressourceHumaine.poste}</p>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-ink-900 mb-1 leading-snug">
          {fullName}
        </h3>

        {ressourceHumaine.description && (
          <p className="text-sm text-ink-500 line-clamp-3 flex-1 leading-6 mb-4">
            {ressourceHumaine.description}
          </p>
        )}

        <div className="mt-auto space-y-2">
          {ressourceHumaine.email && (
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>{ressourceHumaine.email}</span>
            </p>
          )}

          {ressourceHumaine.telephone && (
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{ressourceHumaine.telephone}</span>
            </p>
          )}
        </div>

        <Button
          component={RouterLink}
          to={`/ressources-humaines/${ressourceHumaine.slug ?? ressourceHumaine.id}`}
          variant="text"
          endIcon={<ArrowForwardRoundedIcon />}
          aria-label={`Voir le profil de ${fullName}`}
          sx={{
            mt: 2,
            p: 0,
            minWidth: 'auto',
            color: '#2e6a5f',
            fontWeight: 600,
            textTransform: 'none',
            justifyContent: 'flex-start',
            alignSelf: 'flex-start',
            '&:hover': {
              backgroundColor: 'transparent',
              color: '#27564e',
            },
          }}
        >
          Voir le profil
        </Button>
      </div>
    </article>
  );
};

export default RessourceHumaineCard;